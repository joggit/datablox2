import admin from "firebase-admin";
import { readFileSync } from "fs";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync(new URL("./service-account.json", import.meta.url))
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const products = [
  {
    name: "Android 10 inch Tablet",
    description:
      "Powerful and 6GB RAM 64GB storage display. FREE Bluetooth keyboard, Bluetooth Mouse, Leather case, Pen, Plastic film",
    price: 2299.99,
    category: "tablets",
    stock: 8,
    images: [
      "tablet/image-1.jpg",
      "tablet/image-3.jpg",
      "tablet/image-4.jpg",
    ],
    createdAt: new Date("2025-01-13T10:00:00Z"),
    updatedAt: new Date("2025-01-13T12:00:00Z"),
    ratings: 0,
    totalReviews: 0,
    attributes: {
      color: ["Black"],
      size: ["10-inch"],
    },
  },
  {
    name: "IP66 30X optical zoom HD CCTV camera",
    description:
      "IP66 30X optical zoom HD night vision network CCTV outdoors Security 4K 8MP PoE camera PTZ",
    price: 2999.99,
    category: "security",
    stock: 5,
    images: [
      "speed_camera/image-1.jpg",
      "security-camera/image-2.jpg",
      "security-camera/image-3.jpg",
    ],
    createdAt: new Date("2025-01-13T10:00:00Z"),
    updatedAt: new Date("2025-01-13T12:00:00Z"),
    ratings: 0,
    totalReviews: 0,
    attributes: {
      color: ["White"],
      size: ["1080P"],
    },
  },
  {
    name: "AI Smart IP Wired Camera",
    description:
      "8MP PoE Outdoor PTZ Camera AI Smart IP Wired 2-way audio 4K Network CCTV Dome Camera PoE",
    price: 1499.99,
    category: "security",
    stock: 10,
    images: [
      "poe_camera/image-1.jpg",
      "security-camera/image-2.jpg",
      "security-camera/image-3.jpg",
    ],
    createdAt: new Date("2025-01-13T10:00:00Z"),
    updatedAt: new Date("2025-01-13T12:00:00Z"),
    ratings: 0,
    totalReviews: 0,
    attributes: {
      color: ["White"],
      size: ["1080P"],
    },
  },
  {
    name: "Wireless Solar Security Camera",
    description:
      "8mp Outdoor Solar Cctv Camera 4g Sim Card 10x Optical Zoom Security System Ptz IP Motion Detection Solar Camera 4G",
    price: 1599.99,
    category: "security",
    stock: 12,
    images: [
      "solar_camera/image-1.jpg",
      "security-camera/image-2.jpg",
      "security-camera/image-3.jpg",
    ],
    createdAt: new Date("2025-01-13T10:00:00Z"),
    updatedAt: new Date("2025-01-13 12:00:00Z"),
  }
];

async function seedProducts() {
  try {
    const collectionRef = db.collection("products");

    for (const product of products) {
      const docRef = await collectionRef.add(product);
      console.log(`Product added with ID: ${docRef.id}`);
    }

    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}

seedProducts();
