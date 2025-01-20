"use client";

import React from "react";
import { FiArrowRightCircle, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

const HardwareScreen = () => {
  const hardwareServices = [
    {
      title: "Servers",
      features: [
        "End-point connectivity",
        "Pabx",
        "VoIP calling",
      ],
    },
    {
      title: "Storage",
      features: [
        "End-point connectivity",
        "Pabx",
        "VoIP calling",
      ],
    },
  ];

  return (
    <section className="bg-white ">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 ">
            Hardware Infrastructure
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {hardwareServices.map((service, index) => (
            <div
              key={index}
              className="flex flex-col p-6 mx-auto max-w-xl bg-white rounded-lg border shadow-md "
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 ">
                  {service.title}
                </h3>
              </div>
              <ul className="mb-6 space-y-2 text-gray-700 ">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <FiChevronRight className="text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  href="#"
                  className="flex items-center justify-center text-white bg-primary hover:bg-primary-light font-medium rounded-lg text-sm px-5 py-2.5 "
                >
                  Learn More
                  <FiArrowRightCircle className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HardwareScreen;
