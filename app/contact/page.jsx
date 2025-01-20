"use client";

import React, { useState } from "react";
import { db } from "../../lib/firebase"; // Firestore instance
import { collection, addDoc } from "firebase/firestore";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const enquiry = {
        ...formData,
        timestamp: new Date().toISOString(),
      };

      // Add enquiry to Firestore
      await addDoc(collection(db, "enquiries"), enquiry);

      alert("Thank you for contacting us. Your enquiry has been submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("There was an error submitting your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-white ">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900  mb-6 text-center">
          Contact Us
        </h2>
        <p className="text-lg text-gray-600  mb-8 text-center">
          Have questions or feedback? Fill out the form below, and we'll get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 " htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50  "
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 " htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50  "
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 " htmlFor="subject">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50  "
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 " htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 "
              rows="5"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-primary hover:bg-primary-light text-white font-medium rounded-lg text-sm px-5 py-2.5 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
