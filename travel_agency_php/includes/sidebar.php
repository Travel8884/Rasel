<div id="sidebar-wrapper" class="bg-dark border-end">
    <div class="sidebar-heading text-white fw-bold py-3 px-3">Travel ERP</div>
    <div class="list-group list-group-flush">
        <a href="dashboard.php?page=dashboard" class="list-group-item list-group-item-action bg-dark text-white <?= current_page('dashboard') ?>">
            <i class="bi bi-speedometer2 me-2"></i>Dashboard
        </a>
        <a href="dashboard.php?page=customers" class="list-group-item list-group-item-action bg-dark text-white <?= current_page('customers') ?>">
            <i class="bi bi-people me-2"></i>Customers
        </a>
        <a href="dashboard.php?page=packages" class="list-group-item list-group-item-action bg-dark text-white <?= current_page('packages') ?>">
            <i class="bi bi-geo-alt me-2"></i>Packages
        </a>
        <a href="dashboard.php?page=bookings" class="list-group-item list-group-item-action bg-dark text-white <?= current_page('bookings') ?>">
            <i class="bi bi-journal-check me-2"></i>Bookings
        </a>
        <a href="dashboard.php?page=transactions" class="list-group-item list-group-item-action bg-dark text-white <?= current_page('transactions') ?>">
            <i class="bi bi-cash-stack me-2"></i>Income/Expense
        </a>
        <a href="dashboard.php?page=reports" class="list-group-item list-group-item-action bg-dark text-white <?= current_page('reports') ?>">
            <i class="bi bi-bar-chart-line me-2"></i>Reports
        </a>
        <a href="logout.php" class="list-group-item list-group-item-action bg-danger text-white">
            <i class="bi bi-box-arrow-right me-2"></i>Logout
        </a>
    </div>
</div>
