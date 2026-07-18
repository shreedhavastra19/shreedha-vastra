import { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';

const Analytics = () => {
  const [report, setReport] = useState(null);
  const [groupBy, setGroupBy] = useState('day');

  const loadReport = async (group) => {
    const res = await adminService.getSalesReport({ groupBy: group });
    setReport(res);
  };

  useEffect(() => {
    loadReport(groupBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  if (!report) return <Loader fullScreen />;

  const maxSales = Math.max(...report.report.map((r) => r.totalSales), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Sales Analytics</h1>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="input-field py-2 text-sm w-fit">
          <option value="day">Group by Day</option>
          <option value="month">Group by Month</option>
        </select>
      </div>

      <div className="card p-6 mb-8">
        <h3 className="font-serif text-xl mb-6">Sales Over Time</h3>
        <div className="flex items-end gap-2 h-56 overflow-x-auto">
          {report.report.map((r) => (
            <div key={r._id} className="flex flex-col items-center justify-end h-full min-w-[36px]" title={`${r._id}: ${formatCurrency(r.totalSales)}`}>
              <div
                className="w-6 bg-gold rounded-t-md transition-all"
                style={{ height: `${(r.totalSales / maxSales) * 100}%`, minHeight: '4px' }}
              />
              <span className="text-[10px] mt-2 text-charcoal/50 whitespace-nowrap rotate-0">{r._id.slice(5)}</span>
            </div>
          ))}
          {report.report.length === 0 && <p className="text-sm text-charcoal/50">No sales data yet.</p>}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-serif text-xl mb-4">Top Selling Products</h3>
        <table className="w-full text-sm">
          <thead className="text-left border-b border-beige">
            <tr><th className="py-2">Product</th><th className="py-2">Units Sold</th><th className="py-2">Revenue</th></tr>
          </thead>
          <tbody>
            {report.topProducts.map((p) => (
              <tr key={p._id} className="border-b border-beige/50">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.unitsSold}</td>
                <td className="py-2">{formatCurrency(p.revenue)}</td>
              </tr>
            ))}
            {report.topProducts.length === 0 && (
              <tr><td colSpan={3} className="text-center py-6 text-charcoal/50">No sales data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
