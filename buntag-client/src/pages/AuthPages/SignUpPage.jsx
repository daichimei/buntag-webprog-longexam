import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

const inputClasses = 'mt-2 w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-zinc-50';
const errorInputClasses = 'mt-2 w-full rounded-xl border border-red-400 bg-red-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500';
const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const blankForm = { name: '', email: '', password: '', confirmPassword: '', address: '' };

const SignUpPage = () => {
  const { register, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(blankForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id]) setFieldErrors((prev) => ({ ...prev, [id]: '' }));
    if (authError) setAuthError(null);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
    if (!form.address.trim()) errors.address = 'Address is required.';
    if (!form.password) errors.password = 'Password is required.';
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    const { confirmPassword, ...payload } = form;
    const result = await register(payload);
    setSubmitting(false);

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Sign Up</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Create a store account for faster checkout, order updates, and pickup details.
      </p>

      {authError && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {authError}
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name" className="text-sm font-medium text-zinc-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Full name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            className={fieldErrors.name ? errorInputClasses : inputClasses}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={fieldErrors.email ? errorInputClasses : inputClasses}
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="address" className="text-sm font-medium text-zinc-700">
            Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Delivery / pickup address"
            autoComplete="street-address"
            value={form.address}
            onChange={handleChange}
            className={fieldErrors.address ? errorInputClasses : inputClasses}
          />
          {fieldErrors.address && <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className={fieldErrors.password ? errorInputClasses : inputClasses}
          />
          {fieldErrors.password ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
          ) : (
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Use a secure password with letters, numbers, and symbols (min. 8 characters).
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={fieldErrors.confirmPassword ? errorInputClasses : inputClasses}
          />
          {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
        </div>

        <Button type="submit" variant="primary" className={actionButtonClassName} disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <nav className="mt-8 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
        <p>
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-semibold text-zinc-900 transition hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Log In
          </Link>
        </p>
      </nav>
    </>
  );
};

export default SignUpPage;