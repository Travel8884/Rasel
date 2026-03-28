<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $stmt = $conn->prepare('INSERT INTO transactions (type, category, amount, note, date) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('ssdss', $_POST['type'], $_POST['category'], $_POST['amount'], $_POST['note'], $_POST['date']);
        $stmt->execute();
    }

    if ($action === 'delete') {
        $id = (int) $_POST['id'];
        $conn->query("DELETE FROM transactions WHERE id=$id");
    }

    header('Location: dashboard.php?page=transactions');
    exit();
}

$txns = $conn->query('SELECT * FROM transactions ORDER BY date DESC, id DESC');
?>
<div class="row g-3">
    <div class="col-lg-4">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">Add Transaction</div>
            <div class="card-body">
                <form method="post">
                    <input type="hidden" name="action" value="create">
                    <select class="form-select mb-2" name="type" required>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <input class="form-control mb-2" name="category" placeholder="Category (Ticket, Hotel, Office)" required>
                    <input class="form-control mb-2" type="number" step="0.01" name="amount" placeholder="Amount" required>
                    <input class="form-control mb-2" type="date" name="date" value="<?= date('Y-m-d') ?>" required>
                    <textarea class="form-control mb-2" name="note" placeholder="Note"></textarea>
                    <button class="btn btn-primary w-100">Save Transaction</button>
                </form>
            </div>
        </div>
    </div>
    <div class="col-lg-8">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">Transaction History</div>
            <div class="table-responsive">
                <table class="table table-striped mb-0">
                    <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Note</th><th>Action</th></tr></thead>
                    <tbody>
                    <?php while ($t = $txns->fetch_assoc()): ?>
                        <tr>
                            <td><?= e($t['date']) ?></td>
                            <td><span class="badge bg-<?= $t['type'] === 'income' ? 'success' : 'danger' ?>"><?= e($t['type']) ?></span></td>
                            <td><?= e($t['category']) ?></td>
                            <td>৳<?= money((float) $t['amount']) ?></td>
                            <td><?= e($t['note']) ?></td>
                            <td>
                                <form method="post" onsubmit="return confirm('Delete this transaction?')">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= e($t['id']) ?>">
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
