import Button from './Button';

const placeholderImage = 'https://placehold.co/600x450/35408e/ffd31c?text=NU+Bulldogs';

const ProductCard = ({ product }) => {
  return (
    <article className="rounded-3xl border-2 border-zinc-900 bg-white p-4">
      <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-200">
        <img
          src={product.image || placeholderImage}
          alt={product.productName}
          className="h-full w-full object-cover rounded-[1.25rem]"
        />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {product.category?.categoryName || 'Merchandise'}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-zinc-900">{product.productName}</h3>
      <p className="mt-2 text-base font-bold text-zinc-900">₱{product.price}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        {(product.description || '').substring(0, 100)}
        {product.description && product.description.length > 100 ? '...' : ''}
      </p>
      <Button to={`/products/${product._id}`} className="mt-4" variant="primary">
        View Product
      </Button>
    </article>
  );
};

export default ProductCard;
