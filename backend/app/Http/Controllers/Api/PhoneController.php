<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Phone;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Phones",
 *     description="teléfonos"
 * )
 */

/**
 * @OA\Schema(
 *     schema="Phone",
 *     type="object",
 *     title="Phone",
 *     description="Modelo de un teléfono",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="brand", type="string"),
 *     @OA\Property(property="model", type="string"),
 *     @OA\Property(property="storage", type="string"),
 *     @OA\Property(property="ram", type="string"),
 *     @OA\Property(property="display", type="string"),
 *     @OA\Property(property="os", type="string"),
 *     @OA\Property(property="processor", type="string"),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="price", type="number", format="float"),
 *     @OA\Property(property="stock", type="integer"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 * )
 */
class PhoneController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/phones",
     *     tags={"Phones"},
     *     summary="Listar teléfonos con filtros",
     *     description="Devuelve una lista paginada de teléfonos. Permite filtrar por disponibilidad y buscar por marca o modelo.",
     *     @OA\Parameter(
     *         name="available",
     *         in="query",
     *         description="Filtrar solo los que tienen stock mayor a 0",
     *         required=false,
     *         @OA\Schema(type="boolean")
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Buscar por marca o modelo",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Número de página para paginación (100 por defecto)",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de teléfonos paginada",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Phone")),
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="per_page", type="integer")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Phone::query();

        if ($request->boolean('available')) {
            $query->where('stock', '>', 0);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('brand', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('model', 'ILIKE', '%' . $request->search . '%');
            });
        }

        return response()->json($query->paginate(100));
    }


    /**
     * @OA\Post(
     *     path="/api/phones",
     *     tags={"Phones"},
     *     summary="Crear teléfono",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"brand","model","storage","ram","display","os","processor","description","price","stock"},
     *             @OA\Property(property="brand", type="string"),
     *             @OA\Property(property="model", type="string"),
     *             @OA\Property(property="storage", type="string"),
     *             @OA\Property(property="ram", type="string"),
     *             @OA\Property(property="display", type="string"),
     *             @OA\Property(property="os", type="string"),
     *             @OA\Property(property="processor", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="price", type="number", format="float"),
     *             @OA\Property(property="stock", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Teléfono creado")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'storage' => 'required|string',
            'ram' => 'required|string',
            'display' => 'required|string',
            'os' => 'required|string',
            'processor' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        return response()->json(Phone::create($validated), 201);
    }

    /**
     * @OA\Get(
     *     path="/api/phones/{id}",
     *     tags={"Phones"},
     *     summary="Ver detalles de un teléfono",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(response=200, description="Detalles del teléfono"),
     *     @OA\Response(response=404, description="Teléfono no encontrado")
     * )
     */
    public function show(Phone $phone)
    {
        return response()->json($phone);
    }

    /**
     * @OA\Patch(
     *     path="/api/phones/{id}",
     *     tags={"Phones"},
     *     summary="Actualizar parcialmente un teléfono",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="stock", type="integer", example=5),
     *             @OA\Property(property="price", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Teléfono actualizado"),
     *     @OA\Response(response=404, description="Teléfono no encontrado")
     * )
     */
    public function update(Request $request, Phone $phone)
    {
        $validated = $request->validate([
            'brand' => 'sometimes|string',
            'model' => 'sometimes|string',
            'storage' => 'sometimes|string',
            'ram' => 'sometimes|string',
            'display' => 'sometimes|string',
            'os' => 'sometimes|string',
            'processor' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
        ]);

        $phone->update($validated);
        return response()->json($phone);
    }

    /**
     * @OA\Delete(
     *     path="/api/phones/{id}",
     *     tags={"Phones"},
     *     summary="Eliminar un teléfono",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(response=204, description="Eliminado correctamente"),
     *     @OA\Response(response=404, description="Teléfono no encontrado")
     * )
     */
    public function destroy(Phone $phone)
    {
        $phone->delete();
        return response()->json(null, 204);
    }
}
