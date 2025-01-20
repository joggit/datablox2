"use client";

import React, { useState } from "react";
import { FiGift } from "react-icons/fi";

const WebDevelopment = () => {
  const [isOnceOff, setIsOnceOff] = useState(false);

  const pricingPlans = [
    {
      title: "Starter",
      monthlyPrice: "R29",
      onceOffPrice: "R2999",
      description: "R19 per month, paid once-off",
      free_features: [
        "Free hosting",
        "Free domain registration",
        "Free SSL certificate",
      ],
      features: [
        "Responsive design",
        "SEO",
        "10 pages",
      ],
    },
    {
      title: "Standard",
      monthlyPrice: "R199",
      onceOffPrice: "R5999",
      description: "R159 per month, paid once-off",
      badge: "Most popular",
      free_features: [
        "All in Starter plus",
        "5 hours free support",
        "e-Shop",
      ],
      features: [
        "e-Commerce",
        "20 pages",
        "Payment and Shipping Integration",
        "Admin Dashboard",
        "User and Product Management",
      ],
    },
    {
      title: "Premium",
      monthlyPrice: "R599",
      onceOffPrice: "R9999",
      description: "R499 per month, paid once-off",
      free_features: [
        "All in Standard plus",
        "10 hours free support",
      ],
      features: [
        "Custom design",
        "50 pages",
        "Custom features",
        "Custom integrations",
        "Custom admin dashboard",
        "10 pages",
      ],
    },
  ];

  return (
    <section className="bg-white ">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 ">
            Pricing Plans
          </h2>

          <div className="flex justify-center items-center">
            <span className="text-base font-medium text-gray-900 ">
              Monthly
            </span>
            <div>
              <label
                htmlFor="toggle-example"
                className="flex relative items-center mx-4 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="toggle-example"
                  checked={isOnceOff}
                  onChange={() => setIsOnceOff(!isOnceOff)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors"></div>
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
              </label>
            </div>
            <span className="text-base font-medium text-gray-500 ">
              Once-off
            </span>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-3 xl:gap-10">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={isOnceOff ? plan.onceOffPrice : plan.monthlyPrice}
              description={isOnceOff ? "" : plan.description}
              badge={plan.badge}
              free_features={plan.free_features}
              features={plan.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ title, price, description, badge, free_features, features }) => (
  <div
    className={`flex flex-col p-6 mx-auto max-w-xl text-center bg-white rounded-lg border shadow xl:max-w-lg ${
      badge ? "border-primary " : "border-gray-200 "
    } `}
  >
    {badge && (
      <div className="mb-2">
        <span className="py-1 px-3 text-sm  bg-primary-light rounded">
          {badge}
        </span>
      </div>
    )}
    <h3 className="mb-4 text-2xl font-medium text-gray-900 ">{title}</h3>
    <span className="text-5xl font-extrabold text-gray-900 ">{price}</span>
    {description && (
      <p className="mt-4 mb-1 text-gray-500 text-light ">
        {description}
      </p>
    )}
    <a
      href="#"
      className="text-white bg-primary hover:bg-primary-light font-medium rounded-lg text-sm px-5 py-2.5 text-center my-8"
    >
      Get started
    </a>
    <ul role="list" className="space-y-4 text-left text-gray-900 ">
      {free_features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          <FiGift className="text-black w-5 h-5" />
          <span>{feature}</span>
        </li>
      ))}
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          <svg
            className="flex-shrink-0 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default WebDevelopment;
