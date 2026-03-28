<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $customerId = (int) $_POST['customer_id'];
        $packageId = (int) $_POST['package_id'];
        $travelDate = $_POST['travel_date'];
        $travelerCount = (int) $_POST['traveler_count'];
        $total = (float) $_POST['total_price'];
        $paid = (float) $_POST['paid_amount'];
        $due = max(0, $total - $paid);

        $stmt = $conn->prepare('INSERT INTO bookings (customer_id, package_id, travel_date, traveler_count, total_price, paid_amount, due_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $status = $due > 0 ? 'partial' : 'paid';
        $stmt->bind_param('iisiddds', $customerId, $packageId, $travelDate, $travelerCount, $total, $paid, $due, $status);
        $stmt->execute();

        if ($paid > 0) {
            $note = 'Booking payment received';
            $txn = $conn->prepare('INSERT INTO transactions (type, category, amount, note, date) VALUES ("income", "Booking", ?, ?, CURDATE())');
            $txn->bind_param('ds', $paid, $note);
            $txn->execute();
        }
    }

    if ($action === 'delete') {
        $id = (int) $_POST['id'];
        $conn->query("DELETE FROM bookings WHERE id=$id");
    }

    header('Location: dashboard.php?page=bookings');
    exit();
}

$customers = $conn->query('SELECT id, name FROM customers ORDER BY name ASC');
$packages = $conn->query('SELECT id, title, base_price FROM packages ORDER BY title ASC');
$bookings = $conn->query('SELECT b.*, c.name customer_name, p.title package_name FROM bookings b JOIN customers c ON c.id=b.customer_id JOIN packages p ON p.id=b.package_id ORDER BY b.id DESC');
?>
<div class="row g-3 mb-3">
    <div class="col-lg-4">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">Create Booking</div>
            <div class="card-body">
                <form method="post">
                    <input type="hidden" name="action" value="create">
                    <label class="form-label">Customer</label>
                    <select class="form-select mb-2" name="customer_id" required>
                        <option value="">Select customer</option>
                        <?php while ($c = $customers->fetch_assoc()): ?>
                            <option value="<?= e($c['id']) ?>"><?= e($c['name']) ?></option>
                        <?php endwhile; ?>
                    </select>
                    <label class="form-label">Package</label>
                    <select class="form-select mb-2" name="package_id" required>
                        <option value="">Select package</option>
                        <?php while ($p = $packages->fetch_assoc()): ?>
                            <option value="<?= e($p['id']) ?>"><?= e($p['title']) ?> (৳<?= money((float) $p['base_price']) ?>)</option>
                        <?php endwhile; ?>
                    </select>
                    <input class="form-control mb-2" type="date" name="travel_date" required>
                    <input class="form-control mb-2" type="number" name="traveler_count" placeholder="Traveler Count" min="1" required>
                    <input class="form-control mb-2" type="number" step="0.01" name="total_price" placeholder="Total Price" required>
                    <input class="form-control mb-2" type="number" step="0.01" name="paid_amount" placeholder="Paid Amount" required>
                    <button class="btn btn-primary w-100">Save Booking</button>
                </form>
            </div>
        </div>
    </div>
    <div class="col-lg-8">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">Booking List</div>
            <div class="table-responsive">
                <table class="table table-striped mb-0">
                    <thead><tr><th>ID</th><th>Customer</th><th>Package</th><th>Date</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                    <?php while ($b = $bookings->fetch_assoc()): ?>
                        <tr>
                            <td>#<?= e($b['id']) ?></td>
                            <td><?= e($b['customer_name']) ?></td>
                            <td><?= e($b['package_name']) ?></td>
                            <td><?= e($b['travel_date']) ?></td>
                            <td>৳<?= money((float) $b['total_price']) ?></td>
                            <td>৳<?= money((float) $b['paid_amount']) ?></td>
                            <td>৳<?= money((float) $b['due_amount']) ?></td>
                            <td><span class="badge bg-<?= $b['status'] === 'paid' ? 'success' : 'warning' ?>"><?= e($b['status']) ?></span></td>
                            <td class="d-flex gap-1">
                                <a class="btn btn-sm btn-outline-primary" href="invoice.php?id=<?= e($b['id']) ?>" target="_blank">Invoice</a>
                                <form method="post" onsubmit="return confirm('Delete this booking?')">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= e($b['id']) ?>">
                                    <button class="btn btn-sm btn-danger">Delete</button>
                                </form>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
