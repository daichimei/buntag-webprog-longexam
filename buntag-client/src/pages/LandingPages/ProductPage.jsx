import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import { useAuth } from '../../context/AuthContext';
import { addToCart } from '../../services/CartService';
import { fetchProductById } from '../../services/ProductService';
import { createReview, fetchReviewsByProduct } from '../../services/ReviewService';

const placeholderImage = 'https://placehold.co/600x450/35408e/ffd31c?text=NU+Bulldogs';

function ProductPage() {
  const { name: productId } = useParams();
  const navigate = useNavigate();
  const location = { pathname: `/products/${productId}` };
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProductById(productId);
        setProduct(data?.data || null);
        if (!data?.data) setNotFound(true);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const { data } = await fetchReviewsByProduct(productId);
      setReviews(data || []);
    } catch (err) {
      console.warn('Failed to load reviews.', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      // Not signed in — bounce to sign in, then return here after login
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }
    if (user.role !== 'customer') {
      setCartMessage('Only customer accounts can add items to a cart.');
      return;
    }
    try {
      await addToCart(product._id, 1);
      setCartMessage('Added to cart!');
    } catch (err) {
      setCartMessage(err?.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');

    if (!user) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }
    if (user.role !== 'customer') {
      setReviewError('Only customer accounts can leave reviews.');
      return;
    }

    setSubmittingReview(true);
    try {
      await createReview(product._id, reviewForm.rating, reviewForm.comment);
      setReviewForm({ rating: 5, comment: '' });
      loadReviews();
    } catch (err) {
      setReviewError(err?.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6 px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-500">Loading product...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-zinc-900 bg-[#35408e] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-white">Product Not Found</h1>
            <Button to="/products" className="mt-6" variant="primary">
              Back to Products
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 bg-[#ffd31c]">
      <section className="border-y-2 border-zinc-900 bg-[#35408e] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4">
            <Button to="/products">Back to Products</Button>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ffd31c]">
            {product.category?.categoryName || 'Merchandise'}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {product.productName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-100">
            <span className="font-bold text-[#ffd31c]">₱{product.price}</span>
            <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex aspect-4/3 items-center justify-center rounded-[1.25rem] border-2 border-[#35408e] bg-white">
            <img
              src={product.image || placeholderImage}
              alt={product.productName}
              className="h-full w-full object-cover rounded-[1rem]"
            />
          </div>

          <div className="prose prose-sm max-w-none space-y-4 text-zinc-900">
            <p className="text-base leading-7 whitespace-pre-wrap">
              {product.description || 'No description available yet.'}
            </p>
          </div>

          <div className="mt-8 border-t-2 border-[#35408e] pt-6">
            <Button
              variant="primary"
              className="mr-3"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button to="/products">Back to Products</Button>
            {cartMessage && <p className="mt-3 text-sm font-semibold text-[#35408e]">{cartMessage}</p>}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-y-2 border-zinc-900 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-zinc-900">Reviews</h2>

          <form onSubmit={handleReviewSubmit} className="mt-4 rounded-2xl border-2 border-zinc-900 p-4">
            <p className="text-sm font-semibold text-zinc-700">Leave a review</p>
            {reviewError && <p className="mt-2 text-sm text-red-600">{reviewError}</p>}

            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                  className={`text-2xl ${star <= reviewForm.rating ? 'text-[#ffd31c]' : 'text-zinc-300'}`}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your thoughts about this product..."
              rows={3}
              className="mt-3 w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="mt-3 rounded-full border-2 border-zinc-900 bg-[#35408e] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#2a306e] disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {reviewsLoading ? (
              <p className="text-sm text-zinc-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-zinc-500">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="flex gap-3 border-b border-zinc-200 pb-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'U')}&background=35408e&color=fff`}
                    alt={review.user?.name}
                    className="h-10 w-10 flex-shrink-0 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-900">{review.user?.name || 'Anonymous'}</p>
                      <span className="text-xs text-zinc-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-[#ffd31c]">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                    {review.comment && <p className="mt-1 text-sm text-zinc-700">{review.comment}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
