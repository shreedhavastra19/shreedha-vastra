// ================================================================
// Shreedha Vastra — User Profile Page (details + addresses + password)
// ================================================================
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { Helmet } from '../components/common/Helmet';
import Button from '../components/common/Button';
import userService from '../services/userService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const TABS = ['Profile Details', 'Addresses', 'Change Password'];

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [addresses, setAddresses] = useState([]);

  const profileForm = useForm({ defaultValues: { name: user?.name, phone: user?.phone } });
  const passwordForm = useForm();

  useEffect(() => {
    userService.getAddresses().then((res) => setAddresses(res.addresses));
  }, []);

  const onUpdateProfile = async (data) => {
    const { user: updatedUser } = await userService.updateProfile(data);
    setUser((prev) => ({ ...prev, ...updatedUser }));
    toast.success('Profile updated');
  };

  const onChangePassword = async (data) => {
    try {
      await authService.updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password updated');
      passwordForm.reset();
    } catch {
      // toasted globally
    }
  };

  const handleDeleteAddress = async (id) => {
    const { addresses } = await userService.deleteAddress(id);
    setAddresses(addresses);
    toast.success('Address removed');
  };

  return (
    <div className="container-custom py-10">
      <Helmet title="My Profile | Shreedha Vastra" />
      <h1 className="font-serif text-3xl mb-8">My Account</h1>

      <div className="flex gap-6 border-b border-beige mb-8 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`pb-3 whitespace-nowrap text-sm font-medium border-b-2 ${
              activeTab === i ? 'border-gold text-gold' : 'border-transparent text-charcoal/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="max-w-md space-y-4">
          <input className="input-field" placeholder="Full Name" {...profileForm.register('name')} />
          <input className="input-field bg-beige/40" value={user?.email} disabled />
          <input className="input-field" placeholder="Phone" {...profileForm.register('phone')} />
          <Button type="submit" isLoading={profileForm.formState.isSubmitting}>Save Changes</Button>
        </form>
      )}

      {activeTab === 1 && (
        <div className="max-w-lg space-y-3">
          {addresses.length === 0 && <p className="text-sm text-charcoal/50">No saved addresses yet.</p>}
          {addresses.map((addr) => (
            <div key={addr._id} className="card p-4 flex justify-between items-start">
              <div className="text-sm">
                <p className="font-medium">{addr.fullName} {addr.isDefault && <span className="text-xs text-gold ml-1">(Default)</span>}</p>
                <p className="text-charcoal/60">{addr.line1}, {addr.line2 && `${addr.line2}, `}{addr.city}, {addr.state} {addr.pincode}</p>
                <p className="text-charcoal/60">{addr.phone}</p>
              </div>
              <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-500" aria-label="Delete address">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          <p className="text-xs text-charcoal/50">Add new addresses during checkout — they'll show up here automatically.</p>
        </div>
      )}

      {activeTab === 2 && (
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="max-w-md space-y-4">
          <input type="password" className="input-field" placeholder="Current Password" {...passwordForm.register('currentPassword', { required: true })} />
          <input type="password" className="input-field" placeholder="New Password" {...passwordForm.register('newPassword', { required: true, minLength: 8 })} />
          <Button type="submit" isLoading={passwordForm.formState.isSubmitting}>Update Password</Button>
        </form>
      )}
    </div>
  );
};

export default Profile;
