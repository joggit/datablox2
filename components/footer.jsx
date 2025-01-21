import Image from "next/image";
import Logo from "../public/datablox_logo.png";

export default function Footer() {
  return (
    <footer className="p-6 bg-black ">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start text-center lg:text-left">
          {/* Logo and Tagline */}
          <div className="mb-6 lg:mb-0">
            {/* <a href="#" className="flex items-center justify-center lg:justify-start">
              <Image
                src={Logo}
                className="h-12"
                layout="intrinsic"
                width={150}
                alt="Datablox Logo"
              />
            </a> */}
            <p className="mt-4 text-sm text-gray-300">
              Empowering businesses with cutting-edge solutions and reliable technology services.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="mb-6 lg:mb-0">
            <ul className="flex flex-col lg:flex-row justify-center lg:justify-end items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6 text-sm">
              <li>
                <a href="/" className=" text-white hover:text-gray-300 transition">Home</a>
              </li>
              <li>
                <a href="/about" className=" text-white hover:text-gray-300 transition">About</a>
              </li>
              <li>
                <a href="#" className=" text-white hover:text-gray-300 transition">Services</a>
              </li>
              <li>
                <a href="/products/grid" className=" text-white hover:text-gray-300 transition">Shop</a>
              </li>
              <li>
                <a href="/contact" className=" text-white hover:text-gray-300 transition">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Rights */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <span className="text-sm text-gray-400">
              © 2024 <a href="#" className="hover:underline text-gray-200">Datablox™</a>. All
              Rights Reserved.
            </span>
            <div className="mt-4 sm:mt-0">
              <ul className="flex justify-center space-x-6 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-gray-200 transition">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-200 transition">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
