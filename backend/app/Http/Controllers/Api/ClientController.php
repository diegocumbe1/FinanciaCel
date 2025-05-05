<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Clients")
 */
class ClientController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/clients",
     *     summary="Buscar clientes por nombre, email o documento",
     *     tags={"Clients"},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Texto de búsqueda",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Listado de clientes"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $clients = Client::when($search, function ($query, $search) {
            return $query->where('name', 'ILIKE', "%$search%")
                         ->orWhere('email', 'ILIKE', "%$search%")
                         ->orWhere('document_number', 'ILIKE', "%$search%");
        })->get();

        return response()->json($clients);
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
        $client = Client::findOrFail($id);
        return response()->json($client);
    }
}
