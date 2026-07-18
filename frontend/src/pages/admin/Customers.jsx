import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { DataTable } from '../../components/admin/AdminUI';
import Loader from '../../components/common/Loader';
import userService from '../../services/userService';
import { formatDate } from '../../utils/helpers';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const res = await userService.getAllUsers({});
    setUsers(res.users);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer account? This cannot be undone.')) return;
    await userService.deleteUser(id);
    toast.success('Customer deleted');
    loadUsers();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Customers</h1>
      <DataTable
        columns={['Name', 'Email', 'Phone', 'Joined', 'Actions']}
        data={users}
        renderRow={(u) => (
          <tr key={u._id} className="border-t border-beige/50">
            <td className="px-4 py-3">{u.name}</td>
            <td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3">{u.phone || '—'}</td>
            <td className="px-4 py-3">{formatDate(u.createdAt)}</td>
            <td className="px-4 py-3">
              <button onClick={() => handleDelete(u._id)} className="text-red-500"><FiTrash2 size={16} /></button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default AdminCustomers;
