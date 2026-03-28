<?php
$today = date('Y-m-d');

$incomeToday = (float) ($conn->query("SELECT COALESCE(SUM(amount),0) total FROM transactions WHERE type='income' AND date='$today'")->fetch_assoc()['total'] ?? 0);
$expenseToday = (float) ($conn->query("SELECT COALESCE(SUM(amount),0) total FROM transactions WHERE type='expense' AND date='$today'")->fetch_assoc()['total'] ?? 0);
$dueTotal = (float) ($conn->query("SELECT COALESCE(SUM(due_amount),0) total FROM bookings")->fetch_assoc()['total'] ?? 0);
$profitToday = $incomeToday - $expenseToday;

$recentBookings = $conn->query("SELECT b.id, c.name customer, p.title package, b.travel_date, b.total_price, b.paid_amount, b.due_amount FROM bookings b JOIN customers c ON c.id=b.customer_id JOIN packages p ON p.id=b.package_id ORDER BY b.id DESC LIMIT 8");
?>
<div class="row g-3 mb-4">
    <div class="col-md-3"><div class="card card-stat p-3"><div class="text-muted">Today Income</div><h4 class="text-success">৳<?= money($incomeToday) ?></h4></div></div>
    <div class="col-md-3"><div class="card card-stat p-3"><div class="text-muted">Today Expense</div><h4 class="text-danger">৳<?= money($expenseToday) ?></h4></div></div>
    <div class="col-md-3"><div class="card card-stat p-3"><div class="text-muted">Today Profit</div><h4 class="text-primary">৳<?= money($profitToday) ?></h4></div></div>
    <div class="col-md-3"><div class="card card-stat p-3"><div class="text-muted">Total Due</div><h4 class="text-warning">৳<?= money($dueTotal) ?></h4></div></div>
</div>

<div class="card shadow-sm">
    <div class="card-header bg-white fw-bold">Recent Bookings</div>
    <div class="table-responsive">
        <table class="table table-striped mb-0">
            <thead><tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Total</th><th>Paid</th><th>Due</th></tr></thead>
            <tbody>
            <?php while ($row = $recentBookings->fetch_assoc()): ?>
                <tr>
                    <td>#<?= e($row['id']) ?></td>
                    <td><?= e($row['customer']) ?></td>
                    <td><?= e($row['package']) ?></td>
                    <td><?= e($row['travel_date']) ?></td>
                    <td>৳<?= money((float) $row['total_price']) ?></td>
                    <td>৳<?= money((float) $row['paid_amount']) ?></td>
                    <td>৳<?= money((float) $row['due_amount']) ?></td>
                </tr>
            <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</div>
