"use client";

import React, { useState, useEffect } from "react";
import {
  HiShoppingBag,
  HiChevronDown,
  HiMenuAlt1,
  HiX,
} from "react-icons/hi";
import Image from "next/image";
import { auth } from "../lib/firebase";
import { useCart } from "../lib/cart";
import Logo from "../public/datablox_logo.png";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const Navbar = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("signin");
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const { cartCount } = useCart();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error("Sign Out Error:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      if (!auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
        alert("A verification email has been sent to your email address.");
      }
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("Google Sign In Error:", error.message);
    }
  };

  const handleEmailSignIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (!auth.currentUser.emailVerified) {
        alert("Please verify your email address to log in.");
        await signOut(auth);
      } else {
        setIsAuthModalOpen(false);
      }
    } catch (error) {
      console.error("Email Sign In Error:", error.message);
      setAuthError(error.message);
    }
  };

  const handleSignUp = async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser);
      alert("A verification email has been sent. Please verify your email to complete sign-up.");
      setAuthType("signin"); // Switch to sign-in after sending the verification email
    } catch (error) {
      console.error("Sign Up Error:", error.message);
      setAuthError(error.message);
    }
  };

  const handlePasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email has been sent.");
    } catch (error) {
      console.error("Password Reset Error:", error.message);
      setAuthError(error.message);
    }
  };

  const AuthModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white  p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 ">
          {authType === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password?.value;
            const confirmPassword = e.target.confirmPassword?.value;

            if (authType === "signin") {
              handleEmailSignIn(email, password);
            } else {
              handleSignUp(email, password, confirmPassword);
            }
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-2 mb-4 border rounded "
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-2 mb-4 border rounded "
          />
          {authType === "signup" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full p-2 mb-4 border rounded "
            />
          )}
          {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light"
          >
            {authType === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        {authType === "signin" && (
          <button
            onClick={() => {
              const email = prompt("Enter your email address:");
              if (email) handlePasswordReset(email);
            }}
            className="text-blue-600 underline mt-4 block text-center"
          >
            Forgot Password?
          </button>
        )}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600"
        >
          Sign In with Google
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          {authType === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setAuthType("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              className="text-blue-600 underline"
              onClick={() => setAuthType("signin")}
            >
              Back to Sign In
            </button>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <header>
      <nav className="bg-gradient-to-r from-white to-gray-200 px-4 lg:px-6 py-3 shadow-lg">
        <div className="flex justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Image
              src={Logo}
              className="mr-3 h-8 sm:h-10"
              layout="intrinsic"
              width={130}
              alt="Datablox Logo"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:justify-center lg:flex-1">
            <ul className="flex space-x-8 font-medium text-black">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/products/grid" className="hover:underline">
                  Shop
                </a>
              </li>
              <li className="relative">
                <button
                  onClick={() =>
                    setIsServicesDropdownOpen(!isServicesDropdownOpen)
                  }
                  className="hover:underline flex items-center"
                >
                  Services <HiChevronDown className="ml-1 w-4 h-4" />
                </button>
                {isServicesDropdownOpen && (
                  <ul className="absolute mt-2 bg-white text-gray-800 border rounded shadow-lg ">
                    <li>
                      <a
                        href="/services/web-development"
                        className="block px-4 py-2 hover:bg-gray-100 "
                      >
                        Web Development
                      </a>
                    </li>
                    <li>
                      <a
                        href="/services/cloud-services"
                        className="block px-4 py-2 hover:bg-gray-100 "
                      >
                        Cloud Services
                      </a>
                    </li>
                    <li>
                      <a
                        href="/services/networking"
                        className="block px-4 py-2 hover:bg-gray-100 "
                      >
                        Networking
                      </a>
                    </li>
                    <li>
                      <a
                        href="/services/hardware"
                        className="block px-4 py-2 hover:bg-gray-100 "
                      >
                        Hardware
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                window.location.href = "/cart";
              }}
            >
              <div className="relative">
                <HiShoppingBag className="w-6 h-6 text-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center text-black hover:underline"
                >
                  {user.email.split("@")[0]} <HiChevronDown className="ml-1 w-4 h-4" />
                </button>
                {isUserDropdownOpen && (
                  <ul className="absolute right-0 mt-2 bg-white text-gray-800 border rounded shadow-lg ">
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="block px-4 py-2 hover:bg-gray-100 "
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthType("signin");
                  setIsAuthModalOpen(true);
                }}
                className="text-white bg-primary px-4 py-2 rounded hover:bg-primary-light"
              >
                Sign In
              </button>
            )}
            <button
              className="lg:hidden text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt1 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <ul className="lg:hidden flex flex-col space-y-4 mt-4 text-black">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/products/grid" className="hover:underline">
                Shop
              </a>
            </li>
            <li className="relative">
              <button
                onClick={() =>
                  setIsServicesDropdownOpen(!isServicesDropdownOpen)
                }
                className="hover:underline flex items-center"
              >
                Services <HiChevronDown className="ml-1 w-4 h-4" />
              </button>
              {isServicesDropdownOpen && (
                <ul className="mt-2 bg-white text-gray-800 border rounded shadow-lg ">
                  <li>
                    <a
                      href="/services/web-development"
                      className="block px-4 py-2 hover:bg-gray-100 "
                    >
                      Web Development
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services/cloud-services"
                      className="block px-4 py-2 hover:bg-gray-100 "
                    >
                      Cloud Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services/networking"
                      className="block px-4 py-2 hover:bg-gray-100 "
                    >
                      Networking
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services/hardware"
                      className="block px-4 py-2 hover:bg-gray-100 "
                    >
                      Hardware
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        )}
      </nav>
      {isAuthModalOpen && <AuthModal />}
    </header>
  );
};


export default Navbar;
