<?php
$month = $_GET['month'] ?? date('Y-m');
$start = $month . '-01';
$end = date('Y-m-t', strtotime($start));

$income = (float) ($conn->query("SELECT COALESCE(SUM(amount),0) total FROM transactions WHERE type='income' AND date BETWEEN '$start' AND '$end'")->fetch_assoc()['total'] ?? 0);
$expense = (float) ($conn->query("SELECT COALESCE(SUM(amount),0) total FROM transactions WHERE type='expense' AND date BETWEEN '$start' AND '$end'")->fetch_assoc()['total'] ?? 0);
$profit = $income - $expense;

$dues = $conn->query("SELECT b.id, c.name customer, p.title package, b.due_amount FROM bookings b JOIN customers c ON c.id=b.customer_id JOIN packages p ON p.id=b.package_id WHERE b.due_amount > 0 ORDER BY b.id DESC");
?>
<div class="card shadow-sm mb-3">
    <div class="card-body">
        <form method="get" class="row g-2 align-items-end">
            <input type="hidden" name="page" value="reports">
            <div class="col-md-3">
                <label class="form-label">Select Month</label>
                <input type="month" class="form-control" name="month" value="<?= e($month) ?>">
            </div>
            <div class="col-md-2">
                <button class="btn btn-primary">Load Report</button>
            </div>
        </form>
    </div>
</div>

<div class="row g-3 mb-3">
    <div class="col-md-4"><div class="card card-stat p-3"><div class="text-muted">Income</div><h4 class="text-success">৳<?= money($income) ?></h4></div></div>
    <div class="col-md-4"><div class="card card-stat p-3"><div class="text-muted">Expense</div><h4 class="text-danger">৳<?= money($expense) ?></h4></div></div>
    <div class="col-md-4"><div class="card card-stat p-3"><div class="text-muted">Net Profit</div><h4 class="text-primary">৳<?= money($profit) ?></h4></div></div>
</div>

<div class="card shadow-sm">
    <div class="card-header bg-white fw-bold">Outstanding Dues</div>
    <div class="table-responsive">
        <table class="table table-striped mb-0">
            <thead><tr><th>Booking ID</th><th>Customer</th><th>Package</th><th>Due Amount</th></tr></thead>
            <tbody>
            <?php while ($d = $dues->fetch_assoc()): ?>
                <tr>
                    <td>#<?= e($d['id']) ?></td>
                    <td><?= e($d['customer']) ?></td>
                    <td><?= e($d['package']) ?></td>
                    <td>৳<?= money((float) $d['due_amount']) ?></td>
                </tr>
            <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</div>
