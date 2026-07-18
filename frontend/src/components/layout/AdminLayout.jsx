// ================================================================
// Shreedha Vastra — Admin Layout (Sidebar + Header)
// ================================================================
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiBox, FiShoppingBag, FiUsers, FiTag, FiLayers,FiImage, FiBarChart2, FiLogOut, FiExternalLink,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/categories', label: 'categories', icon: FiLayers },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/coupons', label: 'Coupons', icon: FiTag },
  { to: '/admin/banners', label: 'Banners', icon: FiImage },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-beige/40 dark:bg-charcoal">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-ivory hidden md:flex flex-col shrink-0">
        <div className="p-6 font-serif text-xl text-gold border-b border-ivory/10">
          Shreedha Vastra <span className="block text-xs text-ivory/50 font-sans">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-gold text-ivory' : 'hover:bg-white/10'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-ivory/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-white/10"
          >
            <FiExternalLink size={18} /> View Store
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-white/10"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="md:hidden bg-charcoal text-ivory p-4 font-serif">Shreedha Vastra Admin</header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
