<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CreditApplication;
use App\Models\Phone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


/**
 * @OA\Tag(
 *     name="Credits",
 *     description="credit applications"
 * )
 */
class CreditController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/credits",
     *     summary="Crear solicitud de crédito",
     *     tags={"Credits"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"client_id","phone_id","term"},
     *             @OA\Property(property="client_id", type="string", format="uuid"),
     *             @OA\Property(property="phone_id", type="string", format="uuid"),
     *             @OA\Property(property="term", type="integer", example=12)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Solicitud creada exitosamente"),
     *     @OA\Response(response=400, description="Error de validación o crédito activo/stock insuficiente")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required|uuid|exists:clients,id',
            'phone_id' => 'required|uuid|exists:phones,id',
            'term' => 'required|integer|min:1|max:36',
        ]);

        $hasActive = CreditApplication::where('client_id', $data['client_id'])
            ->whereIn('state', ['pending', 'approved'])
            ->exists();

        if ($hasActive) {
            return response()->json(['error' => 'El cliente ya tiene un crédito activo.'], 400);
        }

        $phone = Phone::findOrFail($data['phone_id']);
        if ($phone->stock <= 0) {
            return response()->json(['error' => 'El celular no tiene stock disponible.'], 400);
        }

        $data['amount'] = $phone->price;
        $data['state'] = 'pending';

        $credit = CreditApplication::create($data);
        return response()->json($credit, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/credits/{id}",
     *     summary="Obtener detalle de una solicitud de crédito",
     *     tags={"Credits"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(response=200, description="Detalles de la solicitud"),
     *     @OA\Response(response=404, description="No encontrado")
     * )
     */
    public function show(string $id)
    {
        $credit = CreditApplication::with(['client', 'phone'])->findOrFail($id);
        return response()->json($credit);
    }

    /**
     * @OA\Get(
     *     path="/api/credits",
     *     summary="Listar solicitudes de crédito con filtros",
     *     tags={"Credits"},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Buscar por nombre del cliente o modelo de teléfono",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="state",
     *         in="query",
     *         description="Filtrar por estado (pending, approved, rejected)",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(response=200, description="Lista de solicitudes")
     * )
     */
    public function index(Request $request)
    {
        $query = CreditApplication::with(['client', 'phone']);

        if ($request->filled('state')) {
            $query->where('state', $request->state);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('client', function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%$search%");
            })->orWhereHas('phone', function ($q) use ($search) {
                $q->where('model', 'ILIKE', "%$search%");
            });
        }

        return response()->json($query->paginate(50));
    }

    /**
     * @OA\Patch(
     *     path="/api/credits/{id}",
     *     summary="Actualizar parcialmente una solicitud de crédito",
     *     tags={"Credits"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="state", type="string", enum={"approved", "rejected"})
     *         )
     *     ),
     *     @OA\Response(response=200, description="Solicitud actualizada"),
     *     @OA\Response(response=400, description="Error de validación"),
     *     @OA\Response(response=404, description="No encontrado")
     * )
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'state' => 'required|in:approved,rejected',
        ]);

        $credit = CreditApplication::with('phone')->findOrFail($id);

        if ($credit->state !== 'pending') {
            return response()->json(['error' => 'Solo se puede cambiar el estado desde pending.'], 400);
        }

        if ($data['state'] === 'approved') {
            if ($credit->phone->stock <= 0) {
                return response()->json(['error' => 'No hay stock disponible.'], 400);
            }

            DB::transaction(function () use ($credit) {
                $credit->phone->decrement('stock');
                $credit->update(['state' => 'approved']);

                $interestRate = 0.015; // 1.5%
                $total = $credit->amount * (1 + ($interestRate * $credit->term));
                $monthly = round($total / $credit->term, 2);

                for ($i = 1; $i <= $credit->term; $i++) {
                    $due = now()->addMonths($i);
                    $credit->instalments()->create([
                        'number' => $i,
                        'amount' => $monthly,
                        'due_date' => $due->format('Y-m-d'),
                    ]);
                }
            });

            return response()->json($credit->load('instalments'));
        }


        $credit->update(['state' => $data['state']]);
        return response()->json($credit);
    }

    /**
     * @OA\Get(
     *     path="/api/credits/{id}/instalments",
     *     summary="Listar cuotas de un crédito",
     *     tags={"Credits"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Lista de cuotas"),
     *     @OA\Response(response=404, description="Crédito no encontrado")
     * )
     */
    public function instalments(string $id)
    {
        $credit = CreditApplication::with('instalments')->findOrFail($id);
        return response()->json($credit->instalments);
    }

    /**
     * @OA\Get(
     *     path="/api/credits/simulate",
     *     summary="Simular plan de pagos antes de crear la solicitud",
     *     tags={"Credits"},
     *     @OA\Parameter(name="amount", in="query", required=true, @OA\Schema(type="number")),
     *     @OA\Parameter(name="term", in="query", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="interest", in="query", required=false, @OA\Schema(type="number")),
     *     @OA\Response(response=200, description="Plan de cuotas simulado"),
     *     @OA\Response(response=400, description="Parámetros inválidos")
     * )
     */
    public function simulate(Request $request)
{
    try {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'term' => 'required|integer|min:1|max:36',
            'interest' => 'nullable|numeric|min:0',
        ]);

        $amount = (float) $request->amount;
        $term = (int) $request->term;
        $interestRate = (float) ($request->input('interest', 0.015));

        $total = $amount * (1 + ($interestRate * $term));
        $monthly = round($total / $term, 2);

        $instalments = [];
        for ($i = 1; $i <= $term; $i++) {
            $instalments[] = [
                'number' => $i,
                'amount' => $monthly,
                'due_date' => now()->addMonths($i)->format('Y-m-d'),
            ];
        }

        return response()->json([
            'total_amount' => round($total, 2),
            'monthly_amount' => $monthly,
            'instalments' => $instalments,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => 'Error al simular el crédito',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
}



}
