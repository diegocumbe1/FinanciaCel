<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Tag(name="Clients")
 */
class ClientController extends Controller
{
    /**
 * @OA\Get(
 *     path="/api/clients",
 *     summary="Buscar clientes por nombre, email o número de documento",
 *     tags={"Clients"},
 *     @OA\Parameter(
 *         name="search",
 *         in="query",
 *         description="Buscar por nombre, email o número de documento (búsqueda parcial)",
 *         required=false,
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Parameter(
 *         name="document",
 *         in="query",
 *         description="Buscar cliente por número exacto de documento",
 *         required=false,
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Listado de clientes",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", type="array", @OA\Items(
 *                 @OA\Property(property="id", type="string", format="uuid"),
 *                 @OA\Property(property="name", type="string"),
 *                 @OA\Property(property="document_number", type="string"),
 *                 @OA\Property(property="email", type="string", nullable=true),
 *                 @OA\Property(property="address", type="string", nullable=true),
 *                 @OA\Property(property="phone_number", type="string", nullable=true)
 *             ))
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Cliente no encontrado por número de documento",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Cliente no encontrado por número de documento.")
 *         )
 *     )
 * )
 */
public function index(Request $request)
{
    $document = $request->input('document');
    $search = $request->input('search');

    $clients = Client::query();

    if ($document) {
        $clients->where('document_number', 'ILIKE', "%$document%");
    }

    if ($search) {
        $clients->where(function ($q) use ($search) {
            $q->where('name', 'ILIKE', "%$search%")
              ->orWhere('email', 'ILIKE', "%$search%")
              ->orWhere('document_number', 'ILIKE', "%$search%");
        });
    }

    $results = $clients->get();

    if ($results->isEmpty()) {
        return response()->json([
            'message' => 'Cliente no encontrado.',
        ], 404);
    }

    return response()->json(['data' => $results]);
}




    /**
     * @OA\Get(
     *     path="/api/clients/{id}",
     *     summary="Obtener cliente por UUID",
     *     tags={"Clients"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="UUID del cliente",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cliente encontrado"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Cliente no encontrado"
     *     )
     * )
     */
    public function show($id)
{
    try {
        $client = Client::with([
            'documentType:id,name',
            'creditApplications' => function ($query) {
                $query->select('id', 'client_id', 'phone_id', 'amount', 'state', 'term', 'created_at')
                      ->orderByDesc('created_at');
            },
            'creditApplications.phone:id,model,price',
            'creditApplications.instalments:id,credit_application_id,number,amount,due_date'
        ])->findOrFail($id);
        

        return response()->json(['data' => $client]);
    } catch (\Throwable $e) {
        Log::error('Error al obtener cliente:', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'Error interno del servidor'], 500);
    }
}


    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'document_number' => 'required|string|unique:clients,document_number',
        'document_type_id' => 'required|uuid|exists:document_types,id',
        'email' => 'nullable|email',
        'address' => 'nullable|string',
        'phone_number' => 'nullable|string',
    ]);

    $client = Client::create($validated);

    return response()->json($client, 201);
}

/**
 * @OA\Patch(
 *     path="/api/clients/{id}",
 *     summary="Actualizar cliente por UUID",
 *     tags={"Clients"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="UUID del cliente",
 *         required=true,
 *         @OA\Schema(type="string", format="uuid")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="document_number", type="string"),
 *             @OA\Property(property="document_type_id", type="string", format="uuid"),
 *             @OA\Property(property="email", type="string", format="email"),
 *             @OA\Property(property="address", type="string"),
 *             @OA\Property(property="phone_number", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Cliente actualizado exitosamente"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Cliente no encontrado"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Error de validación"
 *     )
 * )
 */
public function update(Request $request, $id)
{
    $client = Client::findOrFail($id);

    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'document_number' => 'sometimes|string|unique:clients,document_number,' . $id,
        'document_type_id' => 'sometimes|uuid|exists:document_types,id',
        'email' => 'nullable|email',
        'address' => 'nullable|string',
        'phone_number' => 'nullable|string',
    ]);

    $client->update($validated);

    return response()->json($client);
}

/**
 * @OA\Delete(
 *     path="/api/clients/{id}",
 *     summary="Eliminar cliente por UUID",
 *     tags={"Clients"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="UUID del cliente",
 *         required=true,
 *         @OA\Schema(type="string", format="uuid")
 *     ),
 *     @OA\Response(
 *         response=204,
 *         description="Cliente eliminado exitosamente"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Cliente no encontrado"
 *     )
 * )
 */
public function destroy($id)
{
    $client = Client::find($id);
    if (!$client) {
        return response()->json(['message' => 'Cliente no encontrado.'], 404);
    }
    $client->delete();
    return response()->json(null, 204);
}

}
