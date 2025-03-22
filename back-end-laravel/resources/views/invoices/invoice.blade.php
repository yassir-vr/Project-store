<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .invoice-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .invoice-header h1 {
            margin: 0;
            font-size: 28px;
            color: #2c3e50;
        }
        .invoice-header p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .invoice-details .left, .invoice-details .right {
            width: 48%;
        }
        .invoice-details h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #2c3e50;
        }
        .invoice-details ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .invoice-details ul li {
            margin-bottom: 10px;
            font-size: 14px;
            color: #555;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .invoice-table th, .invoice-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .invoice-table th {
            background-color: #f5f5f5;
            font-weight: bold;
            color: #2c3e50;
        }
        .invoice-total {
            text-align: right;
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- En-tête de la facture -->
        <div class="invoice-header">
            <h1>Invoice #{{ $order->id }}</h1>
            <p>Date: {{ $order->created_at->format('d/m/Y') }}</p>
        </div>

        <!-- Informations du client et de la société -->
        <div class="invoice-details">
            <div class="left">
                <h3>Bill To:</h3>
                <ul>
                    <li><strong>Name:</strong> {{ $order->name }}</li>
                    <li><strong>Email:</strong> {{ $order->email }}</li>
                    <li><strong>Phone:</strong> {{ $order->phone }}</li>
                    <li><strong>Address:</strong> {{ $order->address }}</li>
                </ul>
            </div>
            <div class="right">
                <h3>From:</h3>
                <ul>
                    <li><strong>Company Name:</strong> Your Company</li>
                    <li><strong>Email:</strong> info@yourcompany.com</li>
                    <li><strong>Phone:</strong> +123 456 789</li>
                    <li><strong>Address:</strong> 123 Main St, City, Country</li>
                </ul>
            </div>
        </div>

        <!-- Détails de la commande -->
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price (DH)</th>
                    <th>Total (DH)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->product->title }}</td> <!-- Afficher le nom du produit -->
                        <td>{{ $item->quantity }}</td>
                        <td>{{ number_format($item->price, 2) }}</td>
                        <td>{{ number_format($item->price * $item->quantity, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Total de la facture -->
        <div class="invoice-total">
            <p>Total: {{ number_format($order->total_price, 2) }} DH</p>
        </div>

        <!-- Pied de page -->
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>If you have any questions, please contact us at info@yourcompany.com</p>
        </div>
    </div>
</body>
</html>