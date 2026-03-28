<?php
require_once __DIR__ . '/config/auth.php';
require_once __DIR__ . '/config/db.php';

$page = $_GET['page'] ?? 'dashboard';
$allowed = ['dashboard', 'customers', 'packages', 'bookings', 'transactions', 'reports'];
if (!in_array($page, $allowed, true)) {
    $page = 'dashboard';
}

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>
<div id="page-content-wrapper" class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-capitalize"><?= htmlspecialchars($page) ?></h4>
        <span class="badge bg-primary">Welcome, <?= htmlspecialchars($_SESSION['admin_name']) ?></span>
    </div>

    <?php require __DIR__ . '/pages/' . $page . '.php'; ?>
</div>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
