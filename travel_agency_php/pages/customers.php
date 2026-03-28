<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $stmt = $conn->prepare('INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('ssss', $_POST['name'], $_POST['phone'], $_POST['email'], $_POST['address']);
        $stmt->execute();
    }

    if ($action === 'delete') {
        $id = (int) $_POST['id'];
        $conn->query("DELETE FROM customers WHERE id=$id");
    }

    header('Location: dashboard.php?page=customers');
    exit();
}

$customers = $conn->query('SELECT * FROM customers ORDER BY id DESC');
?>
<div class="row g-3">
    <div class="col-lg-4">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">Add Customer</div>
            <div class="card-body">
                <form method="post">
                    <input type="hidden" name="action" value="create">
                    <input class="form-control mb-2" name="name" placeholder="Customer Name" required>
                    <input class="form-control mb-2" name="phone" placeholder="Phone" required>
                    <input class="form-control mb-2" name="email" placeholder="Email">
                    <textarea class="form-control mb-2" name="address" placeholder="Address"></textarea>
                    <button class="btn btn-primary w-100">Save Customer</button>
                </form>
            </div>
        </div>
    </div>
    <div class="col-lg-8">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">Customer List</div>
            <div class="table-responsive">
                <table class="table table-striped mb-0">
                    <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Action</th></tr></thead>
                    <tbody>
                    <?php while ($c = $customers->fetch_assoc()): ?>
                        <tr>
                            <td>#<?= e($c['id']) ?></td>
                            <td><?= e($c['name']) ?></td>
                            <td><?= e($c['phone']) ?></td>
                            <td><?= e($c['email']) ?></td>
                            <td>
                                <form method="post" onsubmit="return confirm('Delete this customer?')">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= e($c['id']) ?>">
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
