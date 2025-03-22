<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->get();
        return ProductResource::collection($products); // Retourne les produits formatés
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'sale_attribute' => 'nullable|string',
            'image' => 'nullable|image',
        ]);

        $product = new Product();
        $product->title = $validated['title'];
        $product->description = $validated['description'];
        $product->price = $validated['price'];
        $product->category_id = $validated['category_id'];
        $product->sale_attribute = $validated['sale_attribute'];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->image = $path;
        }

        $product->save();

        return new ProductResource($product); // Retourne le produit formaté
    }


    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'sale_attribute' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $validated['sale_attribute'] = $validated['sale_attribute'] ?? $product->sale_attribute;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        } else {
            $validated['image'] = $product->image;
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Produit mis à jour avec succès',
            'product' => new ProductResource($product)
        ], 200);
    }



    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function toggleActive($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_active' => !$product->is_active]);
        return new ProductResource($product); // Retourne le produit après avoir basculé son statut
    }

    public function productsByCategory()
    {
        $categories = \App\Models\Category::with(['products' => function ($query) {
            $query->where('is_active', 1); // Filtrer les produits actifs
        }])->get();

        return response()->json($categories);
    }
}
