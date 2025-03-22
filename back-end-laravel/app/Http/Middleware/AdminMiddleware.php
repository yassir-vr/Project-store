<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifiez si l'utilisateur est authentifié et a le rôle 'admin'
        if (auth()->check() && auth()->user()->role === 'admin') {
            return $next($request);
        }

        // Redirigez les utilisateurs non administrateurs vers une page d'erreur ou la page d'accueil
        return redirect('/')->with('error', 'You do not have permission to access this page.');
    }
}
