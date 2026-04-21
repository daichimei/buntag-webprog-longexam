import homeImage1 from '../../assets/img/home-1.png';
import homeImage2 from '../../assets/img/home-2.png';
import homeImage3 from '../../assets/img/home-3.png';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';
import Button from '../../components/Button';
const HomePage = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <section className="relative min-h-[28rem] overflow-hidden border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
                <img
                    src={banner}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-900/45" />

                <div className="relative z-10 flex min-h-[22rem] items-start justify-end text-right sm:min-h-[24rem]">
                    <div className="max-w-xl">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-200">
                            Campus Marketplace
                        </p>
                        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
                            Welcome to BulldogEx Shop
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-zinc-100 sm:text-base">
                            Explore campus uniforms, student essentials, and school merch in one
                            quick storefront.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <Button to="/shop/products">
                                Shop Now
                            </Button>
                            <Button to="/shop/about" variant="primary">
                                About Store
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-[#ffd31c] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#35408e]">
                        Store Overview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Bulldog Stats</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl border-2 border-zinc-900 bg-[#35408e] p-5">
                        <p className="text-2xl font-bold text-white">08</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9eabff]">
                            Products
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-[#35408e] p-5">
                        <p className="text-2xl font-bold text-white">06</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9eabff]">
                            Categories
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-[#35408e] p-5">
                        <p className="text-2xl font-bold text-white">24</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9eabff]">
                            Orders
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-[#35408e] p-5">
                        <p className="text-2xl font-bold text-white">03</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9eabff]">
                            Pickup Slots
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-[#ffd31c] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#35408e]">
                        Shop Sections
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">High-Quality Products</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-3xl border-2 border-zinc-900 bg-white p-4">
                        <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-200">
                            <img
                                src={homeImage1}
                                alt="Daily Essentials"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Daily Essentials</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Bags, tumblers, lanyards, and items used every school day.
                        </p>
                        <Button to="/shop/products" className="mt-4" variant="primary">View Products</Button>
                    </article>

                    <article className="rounded-3xl border-2 border-zinc-900 bg-white p-4">
                        <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-200">
                            <img
                                src={homeImage2}
                                alt="Study Supplies"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Study Supplies</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Notes, desk tools, and study kits for class and review weeks.
                        </p>
                        <Button to="/shop/products" className="mt-4" variant="primary">Shop Supplies</Button>
                    </article>

                    <article className="rounded-3xl border-2 border-zinc-900 bg-white p-4">
                        <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-200">
                            <img
                                src={homeImage3}
                                alt="Campus Apparel"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Campus Apparel</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Comfortable pieces for class days, commute days, and weekends.
                        </p>
                        <Button to="/shop/products" className="mt-4" variant="primary">
                            View Apparel
                        </Button>
                    </article>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
