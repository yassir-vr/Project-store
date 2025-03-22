<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.product')->get(); // Chargez les commandes avec leurs articles et les produits associés
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'payment_method' => 'required|string',
            'items' => 'required|array',
            'total_price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Add the authenticated user's ID to the order data
        $orderData = [
            'user_id' => auth()->id(), // Ensure the user is authenticated
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'payment_method' => $request->payment_method,
            'total_price' => $request->total_price,
            'status' => 'pending',
        ];

        // Create the order
        $order = Order::create($orderData);

        // Create order items
        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'sale_attribute' => $item['sale_attribute'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Order placed successfully!', 'order' => $order], 201);
    }

    public function userOrders(Request $request)
    {
        $user = $request->user(); // Récupère l'utilisateur connecté
        $orders = Order::where('user_id', $user->id)->get(); // Récupère les commandes de l'utilisateur
        return response()->json($orders);
    }
}
