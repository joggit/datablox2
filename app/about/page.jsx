import React from "react";
import { FaCheckCircle } from "react-icons/fa"; // Icons for visual enhancement

const HeroHeader = ({ title, description }) => {
  // Helper function to format description
  const formatDescription = (text) => {
    return text.split("\n").map((line, index) => {
      const [highlight, rest] = line.split(":");
      return (
        <p
          key={index}
          className="flex items-start mb-4 text-base md:text-lg text-gray-700 "
        >
          <FaCheckCircle className="mr-3 mt-1 text-blue-600 " />
          <span>
            <span className="font-semibold ">
              {highlight}:
            </span>{" "}
            {rest?.trim()}
          </span>
        </p>
      );
    });
  };

  return (
    <div className="text-center">
      <h2 className="mb-4 text-2xl md:text-3xl font-extrabold tracking-tight text-gray-800  relative inline-block">
        {title}
        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
      </h2>
      <div className="text-left">{formatDescription(description)}</div>
    </div>
  );
};

const About = () => {
  const heroData = [
    {
      title: "Our Mission",
      description:
        "Our mission is to harness the power of technology to transform businesses and enrich lives. We are committed to delivering high-quality ICT services and products that enable our clients to achieve their goals, enhance productivity, and stay ahead in a rapidly evolving digital landscape.",
    },
    {
      title: "What We Offer",
      description: `ICT Services: From IT consulting and system integration to network infrastructure and web development, we offer a comprehensive range of ICT services designed to optimize performance, minimize risk, and ensure seamless operations for our clients.
Web Development: We specialise in crafting custom e-commerce and web applications tailored to our clients' specific requirements. Whether it's developing bespoke applications, enterprise software, or mobile apps, we have the expertise to bring your vision to life.
Hardware Solutions: We provide a wide range of hardware solutions, including servers, networking equipment, storage solutions, and end-user devices, sourced from leading manufacturers to ensure reliability, performance, and scalability.
Cloud Services: Embrace the flexibility and scalability of cloud computing with our suite of cloud services. From cloud migration and infrastructure-as-a-service (IaaS) to software-as-a-service (SaaS) solutions, we help businesses leverage the full potential of the cloud to drive innovation and growth.`,
    },
    {
      title: "Why Choose Us",
      description: `Expertise: Datablox has extensive experience in the ICT industry, equipped with the skills and knowledge to deliver superior solutions that exceed expectations.
Innovation: We place a strong emphasis on technological innovation, continuously exploring emerging trends and technologies to deliver cutting-edge solutions that address the evolving needs of our clients.
Customer-Centric Approach: We prioritize customer satisfaction above all else, working closely with our clients to understand their challenges, goals, and aspirations, and delivering personalized solutions that drive tangible results.
Quality Assurance: We are committed to delivering high-quality services and products that meet business requirements, industry standards, and best practices.`,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-blue-50 via-gray-50 to-white   min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {heroData.map((item, index) => (
          <div
            key={index}
            className={`bg-white  shadow-lg rounded-lg p-6 sm:p-8 border border-gray-100  animate-slide-up`}
            style={{
              animationDelay: `${index * 0.2}s`, // Stagger animation
              animationFillMode: "forwards",
            }}
          >
            <HeroHeader title={item.title} description={item.description} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
