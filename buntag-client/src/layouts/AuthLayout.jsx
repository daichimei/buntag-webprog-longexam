import { Outlet } from "react-router-dom";
import signInImage from "../assets/img/sign-in.jpg"; // adjust path if needed

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">
        
        {/* Image Section */}
        <div className="flex items-center justify-center border-b-2 border-zinc-300 bg-[#35408e] p-8 sm:p-10 lg:border-b-0 lg:border-r-2 lg:border-zinc-300 lg:p-16">
          <div className="flex w-full max-w-md items-center justify-center rounded-3xl overflow-hidden border-2 border-[#ffd31c] bg-white">
            <img
              src={signInImage}
              alt="BulldogEx Auth"
              className="h-150 w-full object-cover"
            />
          </div>
        </div>

        {/* Form Section */}
        <main className="flex items-center bg-[#ffd31c]/10 px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;
