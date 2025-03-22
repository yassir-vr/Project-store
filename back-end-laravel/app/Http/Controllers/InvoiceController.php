<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function downloadInvoice($orderId)
    {
        // Récupérer la commande avec ses articles et les produits associés
        $order = Order::with(['items.product'])->findOrFail($orderId);

        // Générer le PDF
        $pdf = Pdf::loadView('invoices.invoice', compact('order'));

        // Télécharger le PDF
        return $pdf->download("invoice-{$orderId}.pdf");
    }
}
