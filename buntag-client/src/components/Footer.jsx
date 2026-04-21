import logo from '../assets/img/nubdexchange_logo.png';

const Footer = () => {
  return (
    <footer className="border-t-2 border-yellow-900 bg-[#35408e] px-4 py-10 sm:px-6 lg:px-8 text-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        
        {/* Left: Logo */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src={logo}
            alt="BulldogEx Shop"
            className="h-16 w-16 rounded-full border-2 border-yellow-500 bg-white object-contain"
          />
          <p className="mt-2 text-lg font-bold">BULLDOGEX SHOP</p>
          <p className="text-sm text-zinc-300">Campus Essentials</p>
        </div>

        {/* Middle: About */}
        <div>
          <h2 className="text-lg font-semibold text-yellow-400">ABOUT BULLDOGEX</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-200">
            BulldogEx Shop is your campus marketplace for uniforms, study supplies, and everyday essentials. 
            We keep ordering simple and pickup convenient for students and staff.
          </p>
        </div>

        {/* Right: Contact */}
        <div>
          <h2 className="text-lg font-semibold text-yellow-400">CONTACT US</h2>
          <ul className="mt-2 space-y-2 text-sm text-zinc-200">
            <li>NU Campus, Sampaloc, Manila</li>
            <li>Phone: (02) 712 1900</li>
            <li>Email: bulldogex@nu.edu.ph</li>
            <li>Mon–Fri: 8:30AM–5:30PM; Sat: 8:30AM–12:30PM</li>
          </ul>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-zinc-400">
        © All Rights Reserved. BulldogEx Shop
      </p>
    </footer>
  );
};

export default Footer;
