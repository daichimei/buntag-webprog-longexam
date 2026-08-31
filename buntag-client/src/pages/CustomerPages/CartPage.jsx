import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { fetchMyCart, removeCartItem, updateCartItem } from '../../services/CartService';
import { checkout } from '../../services/OrderService';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const loadCart = async () => {
    try {
      setLoading(true);
      const { data } = await fetchMyCart();
      setCart(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (productId, nextQuantity) => {
    try {
      const { data } = await updateCartItem(productId, nextQuantity);
      setCart(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update item.');
    }
  };

  const handleRemove = async (productId) => {
    try {
      const { data } = await removeCartItem(productId);
      setCart(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to remove item.');
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    setError('');
    try {
      await checkout();
      navigate('/orders');
    } catch (err) {
      setError(err?.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Your Cart</h1>

      {error && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-zinc-500">Loading your cart...</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-zinc-300 p-10 text-center">
          <p className="text-sm text-zinc-500">Your cart is empty.</p>
          <Button to="/products" variant="primary" className="mt-4">
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-4">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <div
                  key={product._id}
                  className="flex items-center gap-4 rounded-2xl border-2 border-zinc-900 bg-white p-4"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                    {product.image && (
                      <img src={product.image} alt={product.productName} className="h-full w-full object-cover" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900">{product.productName}</p>
                    <p className="text-sm text-zinc-500">₱{product.price} each</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                      className="h-8 w-8 rounded-full border-2 border-zinc-900 text-lg font-bold text-zinc-900 transition hover:bg-zinc-900 hover:text-zinc-50"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                      className="h-8 w-8 rounded-full border-2 border-zinc-900 text-lg font-bold text-zinc-900 transition hover:bg-zinc-900 hover:text-zinc-50"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-20 text-right font-semibold text-zinc-900">
                    ₱{(product.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleRemove(product._id)}
                    className="text-xs font-semibold uppercase tracking-widest text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl border-2 border-zinc-900 bg-[#ffd31c] p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-700">Order Total</p>
              <p className="text-2xl font-bold text-zinc-900">₱{totalPrice.toFixed(2)}</p>
            </div>
            <Button variant="primary" onClick={handleCheckout} disabled={checkingOut}>
              {checkingOut ? 'Placing Order...' : 'Checkout'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
