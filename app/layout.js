import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { CartProvider } from "../lib/cart";
import { AuthProvider } from "../lib/auth";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DataBlox",
  description: "A ICT company that provides services and products to businesses and individuals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <CartProvider>
        <AuthProvider>

            <Navbar />
            <main>{children}</main>
            <Footer />

        </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
