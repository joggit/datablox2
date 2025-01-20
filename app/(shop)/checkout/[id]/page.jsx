"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useAuth } from "../../../../lib/auth";
import ProtectedRoute from "../../../../components/ProtectedRoute";

const PAYFAST_SCRIPT_URL = "https://www.payfast.co.za/onsite/engine.js";

const FormGenerator = ({ fields, formValues, onChange }) => (
  <form className="space-y-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </label>
          <input
            id={field.name}
            type={field.type}
            value={formValues[field.name] || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            required={field.required}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      ))}
    </div>
  </form>
);

const OrderSummary = ({ items, taxRate = 0.15, onPayNow }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order Summary</h3>
      <div className="divide-y">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between py-3">
            <span className="text-sm">
              {item.name} x {item.quantity}
            </span>
            <span className="text-sm font-medium">
              ZAR {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-3">
        <span className="text-sm font-medium">Subtotal</span>
        <span className="text-sm font-medium">ZAR {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-3">
        <span className="text-sm font-medium">Tax ({(taxRate * 100).toFixed(0)}%)</span>
        <span className="text-sm font-medium">ZAR {tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between border-t pt-3">
        <span className="text-base font-bold">Total</span>
        <span className="text-base font-bold">ZAR {total.toFixed(2)}</span>
      </div>
      <button
        onClick={() => onPayNow(total)}
        className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-light"
      >
        Pay Now
      </button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, onSave }) => {
  const [newAddress, setNewAddress] = useState({
    address1: "",
    city: "",
    suburb: "",
    phone: "",
    email: "",
  });

  const handleChange = (name, value) => {
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(newAddress);
    setNewAddress({ address1: "", city: "", suburb: "", phone: "", email: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Add New Address
        </h3>
        <FormGenerator
          fields={[
            { name: "address1", label: "Address Line 1", type: "text", required: true },
            { name: "city", label: "City", type: "text", required: true },
            { name: "suburb", label: "Suburb", type: "text", required: true },
            { name: "phone", label: "Phone", type: "tel", required: true },
            { name: "email", label: "Email", type: "email", required: true },
          ]}
          formValues={newAddress}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-light"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = ({ params }) => {
  const [order, setOrder] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setAddresses(userData.addresses || []);
          if (userData.addresses?.[0]) {
            setSelectedAddressIndex(0);
            setFormValues(userData.addresses[0]);
          }
        }

        const orderRef = doc(db, "orders", params.id);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder(orderSnap.data());
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }


    };

    fetchData();
  }, [params, user]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = PAYFAST_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      console.log("PayFast script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load PayFast script");
      alert("Payment functionality is unavailable. Please try again later.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handleAddressSelection = (index) => {
    setSelectedAddressIndex(index);
    setFormValues(addresses[index]);
  };

  const handleAddAddress = (newAddress) => {
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    setSelectedAddressIndex(updatedAddresses.length - 1);
    setFormValues(newAddress);

    const userRef = doc(db, "users", user.uid);
    setDoc(userRef, { addresses: updatedAddresses }, { merge: true });
  };

  const handlePayNow = async (totalAmount) => {
    if (!formValues.address1 || selectedAddressIndex === null) {
      alert("Please complete the address form.");
      return;
    }

    try {
      const orderRef = doc(db, "orders", params.id);
      await updateDoc(orderRef, {
        deliveryInfo: formValues,
        updatedAt: new Date(),
      });

      const response = await fetch("/api/payfast/uuid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: params.id,
          amount: totalAmount,
          user: { email: user.email },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch UUID");

      if (typeof window.payfast_do_onsite_payment === "function") {
        window.payfast_do_onsite_payment({
          uuid: data.uuid,
        });
      } else {
        console.error("PayFast onsite payment function is unavailable");
        alert("Payment functionality is currently unavailable.");
      }
    } catch (err) {
      console.error("Error during payment process:", err);
      alert("Failed to proceed to payment.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ProtectedRoute>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <div className="min-w-0 flex-1 space-y-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select Address
              </h2>
              <div className="space-y-4">
                {addresses.map((address, index) => (
                  <label key={index} className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressIndex === index}
                      onChange={() => handleAddressSelection(index)}
                      className="h-4 w-4"
                    />
                    <span>
                      {address.address1}, {address.city}, {address.suburb}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-light"
              >
                Add New Address
              </button>
              <h3 className="text-lg font-medium mt-8">Edit Selected Address</h3>
              <FormGenerator
                fields={[
                  { name: "address1", label: "Address Line 1", type: "text", required: true },
                  { name: "city", label: "City", type: "text", required: true },
                  { name: "suburb", label: "Suburb", type: "text", required: true },
                  { name: "phone", label: "Phone", type: "tel", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                ]}
                formValues={formValues}
                onChange={(name, value) => setFormValues((prev) => ({ ...prev, [name]: value }))}
              />
            </div>
            {order && (
              <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                <OrderSummary items={order.items || []} onPayNow={handlePayNow} />
              </div>
            )}
          </div>
        </div>
      </section>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAddress}
      />
    </ProtectedRoute>
  );
};

export default CheckoutForm;
