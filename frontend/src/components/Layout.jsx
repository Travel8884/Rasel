import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menu = [
  ['/', 'Dashboard'],
  ['/customers', 'Customers'],
  ['/bookings', 'Bookings'],
  ['/accounting', 'Accounting'],
  ['/employees', 'Employees'],
  ['/reports', 'Reports'],
  ['/settings', 'Settings']
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>TravelPro</h2>
        {menu.map(([path, label]) => (
          <Link key={path} className={location.pathname === path ? 'active' : ''} to={path}>{label}</Link>
        ))}
      </aside>
      <main>
        <header className="topbar">
          <div>{user?.name} ({user?.role})</div>
          <button onClick={logout}>Logout</button>
        </header>
        <section className="content"><Outlet /></section>
      </main>
    </div>
  );
}
