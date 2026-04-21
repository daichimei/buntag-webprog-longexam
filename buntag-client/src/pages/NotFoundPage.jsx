import notFound404 from '../assets/img/not-found-404.png';
import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="flex w-full flex-col gap-6 bg-[#ffd31c]">
      <section className="border-y-2 border-yellow-900 bg-[#35408e] px-4 py-10 sm:px-6 sm:py-8 lg:px-8 text-zinc-50">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
            Error
          </p>
          <img
            src={notFound404}
            alt="404"
            className="mx-auto mb-8 h-72 w-auto object-contain"
          />
          <h1 className="text-3xl font-bold text-yellow-400">Page Not Found</h1>
          <p className="mt-6 text-12 leading-7 text-zinc-200">
            The page you’re looking for doesn’t exist or has been moved.<br/>
            Explore BulldogEx Shop to find campus essentials.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button to="/" variant>Back Home</Button>
            <Button to="/products">View Products</Button>
          </div>
        </div>
      </section>

       <section className="border-y-2 border-yellow-900 bg-[#35408e] px-4 py-10 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
            Error
          </p>
          <h2 className="text-2xl font-semibold text-yellow-400">Quick Links</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border-2 border-zinc-900 bg-[#d1e7fc] p-4">
              <h3 className="font-semibold text-zinc-900">Home</h3>
              <p className="mt-1 text-sm text-zinc-600">Return to homepage</p>
              <Button to="/" className="mt-3">Go Home</Button>
            </div>
            <div className="rounded-3xl border-2 border-zinc-900 bg-[#d1e7fc] p-4">
              <h3 className="font-semibold text-zinc-900">Products</h3>
              <p className="mt-1 text-sm text-zinc-600">Browse all items</p>
              <Button to="/products" className="mt-3">View Products</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage
