import banner from '../../assets/img/about-banner.jpg';
import aboutImage1 from '../../assets/img/about-image1.jpg';
import aboutImage2 from '../../assets/img/about-image2.jpg';
import aboutImage3 from '../../assets/img/about-image3.jpg';
import aboutImage4 from '../../assets/img/about-image4.jpg';
import Button from '../../components/Button';

const AboutPage = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      
      <section className="border-y-2 border-zinc-900 bg-[#ffd31c] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          
          <div className="rounded-3xl border-2 border-[#35408e] bg-white p-6">
            <div className="flex min-h-72 items-center justify-center bg-white">
              <img
                src={banner}
                alt="BulldogEx"
                className="object-cover h-full w-full rounded-[1.25rem] border-2 border-[#35408e] bg-white"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#35408e]">
              About Store
            </p>
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-[#35408e] sm:text-4xl">
              A campus shop focused on useful products and simple ordering.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-900 sm:text-base">
              BulldogEx Shop highlights clear product categories, quick actions, and straightforward store information — all styled with our signature campus colors.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/shop/home" variant="primary">
                Back Home
              </Button>
              <Button to="/shop/products">
                Open Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-[#35408e] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ffd31c]">
            Store Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Bulldog Stats
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-[#ffd31c] bg-[#35408e] p-5">
            <p className="text-2xl font-bold text-white">08</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffd31c]">
              Items
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#ffd31c] bg-[#35408e] p-5">
            <p className="text-2xl font-bold text-white">06</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffd31c]">
              Categories
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#ffd31c] bg-[#35408e] p-5">
            <p className="text-2xl font-bold text-white">03</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffd31c]">
              Pickup Slots
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#ffd31c] bg-[#35408e] p-5">
            <p className="text-2xl font-bold text-white">24</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffd31c]">
              Orders
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-[#ffd31c] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#35408e]">
              Store Flow
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#35408e]">
              How BulldogEx Works
            </h2>

            <div className="mt-6 space-y-4">
              <article className="rounded-3xl border-2 border-[#35408e] bg-white p-5">
                <h3 className="text-lg font-semibold text-[#35408e]">
                  Organized Catalog
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Products are grouped into clear categories like apparel, supplies, and accessories so students can browse quickly and find what they need.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-[#35408e] bg-white p-5">
                <h3 className="text-lg font-semibold text-[#35408e]">
                  Streamlined Checkout
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Each product page highlights price, stock, and action buttons, making the buying process simple and efficient.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-[#35408e] bg-white p-5">
                <h3 className="text-lg font-semibold text-[#35408e]">
                  Convenient Pickup
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Orders are prepared for pickup in designated slots, ensuring students can collect items without delays or confusion.
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-[#35408e] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#35408e]">
              High Selling Products
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-[#ffd31c]/40">
                <img
                  src={aboutImage1}
                  alt="NU Merch"
                  className="object-cover h-full w-full rounded-[1.25rem] border-2 border-[#35408e] bg-white"
                />
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-[#ffd31c]/40">
                <img
                  src={aboutImage2}
                  alt="NU Merch"
                  className="object-cover h-full w-full rounded-[1.25rem] border-2 border-[#35408e] bg-white"
                />
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-[#ffd31c]/40">
                <img
                  src={aboutImage3}
                  alt="NU Merch"
                  className="object-cover h-full w-full rounded-[1.25rem] border-2 border-[#35408e] bg-white"
                />
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-[#ffd31c]/40">
                <img
                  src={aboutImage4}
                  alt="NU Merch"
                  className="object-cover h-full w-full rounded-[1.25rem] border-2 border-[#35408e] bg-white"
                />
              </div>
            </div>
            <Button to="/shop/products" className="mt-5" variant="primary">
              View Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
