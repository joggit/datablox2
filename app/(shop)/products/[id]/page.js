"use client";

import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "../../../../lib/firebase";

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.error("No such product!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row">
        {/* Left Column */}
        <div className="lg:w-1/2">
          {/* Main Image */}
          <div className="aspect-w-1 aspect-h-1">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex space-x-2 overflow-x-auto">
            {product.images?.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover rounded-md cursor-pointer hover:ring-2 hover:ring-blue-500"
                onClick={() => setProduct((prev) => ({ ...prev, mainImage: thumb }))}
              />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-700 mt-4">
            {product.description || "No description available."}
          </p>
          <div className="mt-6">
            <span className="text-2xl font-bold">
              ZAR {product.price?.toFixed(2) || "0.00"}
            </span>
          </div>
          <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add to Cart
          </button>

          {/* Tabs */}
          <div className="mt-8">
            <nav className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-2 px-4 ${
                  activeTab === "details"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "reviews"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "additional"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("additional")}
              >
                Additional Info
              </button>
            </nav>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "details" && (
                <div>
                  <h2 className="text-2xl font-semibold">Product Details</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {product.details || "Details about this product will be displayed here."}
                  </p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div>
                  <h2 className="text-2xl font-semibold">Customer Reviews</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {product.reviews || "No reviews available for this product yet."}
                  </p>
                </div>
              )}
              {activeTab === "additional" && (
                <div>
                  <h2 className="text-2xl font-semibold">Additional Information</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {product.additionalInfo || "Additional product details will be displayed here."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
