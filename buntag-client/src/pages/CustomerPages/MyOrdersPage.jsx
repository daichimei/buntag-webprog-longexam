import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { cancelMyOrder, fetchMyOrders } from '../../services/OrderService';

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  'Ready for Claiming': 'bg-purple-100 text-purple-800 border-purple-300',
  Completed: 'bg-green-100 text-green-800 border-green-300',
  Cancelled: 'bg-zinc-200 text-zinc-600 border-zinc-300',
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await fetchMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelMyOrder(id);
      loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to cancel order.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Your Orders</h1>

      {error && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-zinc-500">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-zinc-300 p-10 text-center">
          <p className="text-sm text-zinc-500">You haven't placed any orders yet.</p>
          <Button to="/products" variant="primary" className="mt-4">
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-2xl border-2 border-zinc-900 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    statusStyles[order.status] || statusStyles.Pending
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="mt-4 space-y-1 border-t border-zinc-200 pt-3 text-sm text-zinc-700">
                {order.products.map((line) => (
                  <li key={line.product?._id || line.product} className="flex justify-between">
                    <span>
                      {line.product?.productName || 'Product'} × {line.quantity}
                    </span>
                    {line.product?.price && (
                      <span>₱{(line.product.price * line.quantity).toFixed(2)}</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3">
                <p className="font-semibold text-zinc-900">Total: ₱{order.totalAmount.toFixed(2)}</p>
                {order.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => handleCancel(order._id)}
                    className="text-xs font-semibold uppercase tracking-widest text-red-600 hover:text-red-800"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
