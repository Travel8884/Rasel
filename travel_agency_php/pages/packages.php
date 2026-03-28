<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $stmt = $conn->prepare('INSERT INTO packages (title, destination, days, base_price, description) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('ssids', $_POST['title'], $_POST['destination'], $_POST['days'], $_POST['base_price'], $_POST['description']);
        $stmt->execute();
    }

    if ($action === 'delete') {
        $id = (int) $_POST['id'];
        $conn->query("DELETE FROM packages WHERE id=$id");
    }

    header('Location: dashboard.php?page=packages');
    exit();
}

$packages = $conn->query('SELECT * FROM packages ORDER BY id DESC');
?>
<div class="row g-3">
    <div class="col-lg-4">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">Add Package</div>
            <div class="card-body">
                <form method="post">
                    <input type="hidden" name="action" value="create">
                    <input class="form-control mb-2" name="title" placeholder="Package Title" required>
                    <input class="form-control mb-2" name="destination" placeholder="Destination" required>
                    <input class="form-control mb-2" type="number" name="days" placeholder="Days" required>
                    <input class="form-control mb-2" type="number" step="0.01" name="base_price" placeholder="Base Price" required>
                    <textarea class="form-control mb-2" name="description" placeholder="Description"></textarea>
                    <button class="btn btn-primary w-100">Save Package</button>
                </form>
            </div>
        </div>
    </div>
    <div class="col-lg-8">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">Package List</div>
            <div class="table-responsive">
                <table class="table table-striped mb-0">
                    <thead><tr><th>ID</th><th>Title</th><th>Destination</th><th>Days</th><th>Price</th><th>Action</th></tr></thead>
                    <tbody>
                    <?php while ($p = $packages->fetch_assoc()): ?>
                        <tr>
                            <td>#<?= e($p['id']) ?></td>
                            <td><?= e($p['title']) ?></td>
                            <td><?= e($p['destination']) ?></td>
                            <td><?= e($p['days']) ?></td>
                            <td>৳<?= money((float) $p['base_price']) ?></td>
                            <td>
                                <form method="post" onsubmit="return confirm('Delete this package?')">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= e($p['id']) ?>">
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
