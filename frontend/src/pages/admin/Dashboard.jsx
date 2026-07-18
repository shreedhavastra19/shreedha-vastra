import { useEffect, useState } from 'react';
import { FiShoppingBag, FiBox, FiUsers, FiDollarSign } from 'react-icons/fi';
import { StatCard } from '../../components/admin/AdminUI';
import Loader from '../../components/common/Loader';
import adminService from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.getDashboardStats().then((res) => setStats(res.stats));
  }, []);

  if (!stats) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={FiDollarSign} />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={FiShoppingBag} />
        <StatCard label="Total Products" value={stats.totalProducts} icon={FiBox} />
        <StatCard label="Total Customers" value={stats.totalCustomers} icon={FiUsers} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-serif text-xl mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.map((o) => (
              <div key={o._id} className="flex justify-between text-sm border-b border-beige pb-2">
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-charcoal/50">{o.user?.name} · {formatDate(o.createdAt)}</p>
                </div>
                <p className="font-medium">{formatCurrency(o.totalPrice)}</p>
              </div>
            ))}
            {stats.recentOrders.length === 0 && <p className="text-sm text-charcoal/50">No orders yet.</p>}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-serif text-xl mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {stats.lowStockProducts.map((p) => (
              <div key={p._id} className="flex justify-between text-sm border-b border-beige pb-2">
                <p>{p.name}</p>
                <p className="text-red-500 font-medium">{p.totalStock} left</p>
              </div>
            ))}
            {stats.lowStockProducts.length === 0 && <p className="text-sm text-charcoal/50">All products are well stocked.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
