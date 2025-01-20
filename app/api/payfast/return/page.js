"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router

const PayFastReturn = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push("/products/grid"); // Adjust this route to your shop's main page
  };

  return (
    <section className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Thank You for Your Purchase!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Your payment was successful. We appreciate your business and hope you
          enjoy your purchase.
        </p>
        <button
          onClick={handleContinueShopping}
          className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    </section>
  );
};

export default PayFastReturn;
