import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import ProductList from '../../components/ProductList.jsx';
import { fetchCategories } from '../../services/CategoryService';
import { fetchProducts } from '../../services/ProductService';

const inputClasses =
  'w-full rounded-xl border-2 border-zinc-900 bg-white px-4 py-2 text-sm text-zinc-900 outline-none';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchCategories()
      .then(({ data }) => setCategories(data || []))
      .catch((err) => console.warn('Failed to load categories.', err));
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category !== 'all') params.category = category;
        const { data } = await fetchProducts(params);
        setProducts(data?.data || []);
      } catch (err) {
        console.warn('Failed to load products.', err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(loadProducts, 300); // light debounce for search typing
    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-[#35408e] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ffd31c]">
          Products
        </p>
        <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          Shop campus essentials in a simple product grid
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-100 sm:text-base">
          Browse practical items for class, study, commute, and everyday campus routines.
        </p>
        <div className="mt-6">
          <Button to="/">Back Home</Button>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-[#ffd31c] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#35408e]">
            Featured Products
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Product Card Grid</h2>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClasses + ' sm:max-w-xs'}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClasses + ' sm:max-w-xs'}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-700">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-zinc-700">No products found.</p>
        ) : (
          <ProductList products={products} />
        )}
      </section>
    </div>
  );
};

export default ProductListPage;
