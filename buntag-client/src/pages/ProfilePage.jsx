import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserById, updateUser } from '../services/UserService';

const inputClasses =
  'mt-2 w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-zinc-50';

const roleLabel = { customer: 'Customer', supplier: 'Supplier', admin: 'System Admin' };

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', address: '', profilePicture: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await fetchUserById(user.id);
        setForm({
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          profilePicture: data.profilePicture || '',
          password: '',
          confirmPassword: '',
        });
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load your profile.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    } else {
      // Session predates the `id` field being added to login — stop the spinner
      // and tell the person to refresh their session instead of hanging forever.
      setLoading(false);
      setError('Your session is out of date. Please log out and log back in to continue.');
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password && form.password.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        address: form.address,
        profilePicture: form.profilePicture,
      };
      if (form.password) payload.password = form.password;

      await updateUser(user.id, payload);
      refreshUser({ name: form.name, profilePicture: form.profilePicture });
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-8 text-sm text-zinc-500">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-zinc-900 bg-zinc-100">
          <img
            src={form.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'U')}&background=35408e&color=fff`}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{form.name}</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {roleLabel[user?.role] || user?.role}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mt-6 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-zinc-700">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputClasses} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClasses} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Address</label>
          <input name="address" value={form.address} onChange={handleChange} className={inputClasses} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Profile Picture URL</label>
          <input
            name="profilePicture"
            value={form.profilePicture}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClasses}
          />
        </div>

        <div className="border-t border-zinc-200 pt-5">
          <p className="text-sm font-semibold text-zinc-900">Change Password</p>
          <p className="text-xs text-zinc-500">Leave blank to keep your current password.</p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <input
              name="password"
              type="password"
              placeholder="New password"
              value={form.password}
              onChange={handleChange}
              className={inputClasses}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[#35408e] py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-50 transition hover:bg-[#2a306e] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
