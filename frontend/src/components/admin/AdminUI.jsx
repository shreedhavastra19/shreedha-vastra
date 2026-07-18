// ================================================================
// Shreedha Vastra — Shared Admin UI: StatCard + DataTable + Modal
// ================================================================
import { FiX } from 'react-icons/fi';

// Tailwind's JIT compiler only detects complete, literal class strings in
// source code — it cannot resolve template-literal interpolations like
// `bg-${accent}/10` at build time. This static map ensures every class
// Tailwind needs to generate appears as a full literal somewhere in the file.
const ACCENT_STYLES = {
  gold: 'bg-gold/10 text-gold',
  blush: 'bg-blush/30 text-blush-dark',
  peach: 'bg-peach/30 text-peach-dark',
};

export const StatCard = ({ label, value, icon: Icon, accent = 'gold' }) => (
  <div className="card p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${ACCENT_STYLES[accent] || ACCENT_STYLES.gold}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs text-charcoal/50 dark:text-ivory/50">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

export const DataTable = ({ columns, data, renderRow, emptyMessage = 'No records found' }) => (
  <div className="card overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-beige/50 dark:bg-white/5 text-left">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-10 text-charcoal/50">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row, i) => renderRow(row, i))
        )}
      </tbody>
    </table>
  </div>
);

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 animate-fadeIn">
      <div className={`bg-white dark:bg-charcoal rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6 relative`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal" aria-label="Close">
          <FiX size={20} />
        </button>
        <h3 className="font-serif text-xl mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};
