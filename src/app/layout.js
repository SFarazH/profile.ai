import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/authContext";
import { CartProvider } from "@/components/cartCountContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "profile.ai",
  description: "Assignment for Profile.ai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
