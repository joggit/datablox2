"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase"; // Firestore instance
import { useCart } from "../../../../lib/cart";

// ProductCard Component
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const productImage = product.images?.[0] || "https://via.placeholder.com/300";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm ">
      <div className="h-56 w-full">
        <img
          className="mx-auto h-full"
          src={productImage}
          alt={product.name || "Product"}
        />
      </div>
      <div className="pt-6">
        <h3 className="text-lg font-semibold text-gray-900 ">
          {product.name || "Unnamed Product"}
        </h3>
        <p className="mt-2 text-sm text-gray-500 ">
          {product.description || "No description available."}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900 ">
            ZAR {product.price?.toFixed(2) || "0.00"}
          </p>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-16 px-2 py-1 border rounded text-center "
          />
        </div>
        <button
          type="button"
          className="mt-4 w-full inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-light px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
          onClick={() => addToCart({ ...product, quantity })}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// HardwareSection Component
const HardwareSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartCount } = useCart(); // Consume cartCount from CartProvider

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
        console.log(productsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-gray-50 py-8 ">
      <div className="container mx-auto px-4">
        <h2 className="mt-4 text-2xl font-semibold text-gray-800 ">
          Products
        </h2>

        {loading ? (
          <p className="mt-6 text-gray-600 ">
            Loading products...
          </p>
        ) : error ? (
          <p className="mt-6 text-red-500 ">{error}</p>
        ) : (
          <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HardwareSection;
