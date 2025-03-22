<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\InvoiceController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
});
// Invoice Download
Route::get('/download-invoice/{orderId}', [InvoiceController::class, 'downloadInvoice']);

// Categories Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
Route::get('categories/{id}/products', [CategoryController::class, 'getProducts']);

// Products Routes
Route::get('products', [ProductController::class, 'index']);
Route::post('products', [ProductController::class, 'store']);
Route::put('products/{id}', [ProductController::class, 'update']);
Route::delete('products/{id}', [ProductController::class, 'destroy']);
Route::post('products/{id}/toggle', [ProductController::class, 'toggleActive']);
Route::get('/products-by-category', [ProductController::class, 'productsByCategory']);

// Payment Routes
Route::post('/payment-intent', function (Request $request) {
    Stripe::setApiKey(env('STRIPE_SECRET'));

    try {
        $paymentIntent = PaymentIntent::create([
            'amount' => $request->amount,
            'currency' => 'usd',
            'payment_method' => $request->token,
            'confirm' => true,
        ]);
        return response()->json(['success' => true, 'paymentIntent' => $paymentIntent]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()]);
    }
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::get('/admin/products', [ProductController::class, 'index']);
    // Route pour récupérer toutes les commandes (GET)
    Route::get('/admin/orders', [OrderController::class, 'index']);

    // Route pour créer une commande (POST)
    Route::post('/admin/orders', [OrderController::class, 'store']);
});

Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store'])->middleware('auth:api');

Route::middleware('auth:sanctum')->get('/user/orders', [OrderController::class, 'userOrders']);
Route::middleware('auth:sanctum')->get('/orders/{orderId}/invoice', [InvoiceController::class, 'downloadInvoice']);

use App\Http\Controllers\UserController;

Route::middleware('auth:sanctum')->group(function () {
    // Récupérer les informations de l'utilisateur
    Route::get('/user', [UserController::class, 'show']);

    // Mettre à jour les informations de l'utilisateur
    Route::put('/user', [UserController::class, 'update']);

    // Changer le mot de passe de l'utilisateur
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
});
