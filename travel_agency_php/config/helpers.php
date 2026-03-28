<?php
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function money(float $value): string
{
    return number_format($value, 2);
}

function current_page(string $name): string
{
    return (isset($_GET['page']) && $_GET['page'] === $name) ? 'active' : '';
}
