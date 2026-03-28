<?php
require_once __DIR__ . '/config/auth.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/helpers.php';

$id = (int) ($_GET['id'] ?? 0);
$row = $conn->query("SELECT b.*, c.name customer_name, c.phone, c.email, p.title package_name, p.destination FROM bookings b JOIN customers c ON c.id=b.customer_id JOIN packages p ON p.id=b.package_id WHERE b.id=$id")->fetch_assoc();
if (!$row) {
    die('Invoice not found.');
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #<?= e($row['id']) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="p-4">
<div class="container border p-4">
    <h3>Travel Agency Invoice</h3>
    <hr>
    <div class="row">
        <div class="col-md-6">
            <strong>Customer:</strong> <?= e($row['customer_name']) ?><br>
            <strong>Phone:</strong> <?= e($row['phone']) ?><br>
            <strong>Email:</strong> <?= e($row['email']) ?><br>
        </div>
        <div class="col-md-6 text-md-end">
            <strong>Invoice #:</strong> <?= e($row['id']) ?><br>
            <strong>Date:</strong> <?= date('Y-m-d') ?><br>
            <strong>Travel Date:</strong> <?= e($row['travel_date']) ?><br>
        </div>
    </div>

    <table class="table table-bordered mt-4">
        <tr><th>Package</th><td><?= e($row['package_name']) ?> (<?= e($row['destination']) ?>)</td></tr>
        <tr><th>Traveler</th><td><?= e($row['traveler_count']) ?></td></tr>
        <tr><th>Total</th><td>৳<?= money((float) $row['total_price']) ?></td></tr>
        <tr><th>Paid</th><td>৳<?= money((float) $row['paid_amount']) ?></td></tr>
        <tr><th>Due</th><td>৳<?= money((float) $row['due_amount']) ?></td></tr>
    </table>

    <div class="text-end mt-4">
        <button onclick="window.print()" class="btn btn-primary">Print Invoice</button>
    </div>
</div>
</body>
</html>
