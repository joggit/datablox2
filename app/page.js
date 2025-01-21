import Image from "next/image";

const HeroHeader = ({ title, description }) => (
  <div className="mr-auto place-self-center lg:col-span-7">
    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl ">
      {title}
    </h1>
    <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl ">
      {description}
    </p>
  </div>
);

const HeroButtons = ({ buttons }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-start lg:justify-start lg:gap-6">
    {buttons.map(({ href, label, variant, icon }, index) => (
      <a
        key={index}
        href={href}
        className={`inline-flex items-center justify-center px-6 py-4 text-base font-medium text-center rounded-lg sm:flex-1 lg:flex-none ${
          variant === "primary"
            ? "text-white bg-primary hover:bg-primary-800"
            : "text-gray-900 border border-gray-300 hover:bg-gray-100 "
        }`}
      >
        {label}
        {icon && (
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
      </a>
    ))}
  </div>
);

const HeroImage = ({ src, alt }) => (
  <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
    <img src={src} alt={alt} />
  </div>
);

const Home = () => {
  const heroData = {
    title: "ICT Products and Solutions",
    description:
      "We focus on technology and innovation that unlocks long-term value and business growth.",
    buttons: [
      {
        href: "/contact",
        label: "Get In Touch",
        variant: "secondary",
        icon: true,

      },

      {
        href: "/products/grid",
        label: "Shop Now",
        variant: "primary",
        icon: false,
      },
    ],
    image: {
      src: "datablox_splash.jpg",
      alt: "mockup",
    },
  };

  return (
    <section className="bg-white ">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <HeroHeader title={heroData.title} description={heroData.description} />
        <HeroImage src={heroData.image.src} alt={heroData.image.alt} />
        <HeroButtons buttons={heroData.buttons} />
      </div>
    </section>
  );
};

export default Home;
