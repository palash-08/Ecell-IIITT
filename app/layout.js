import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar.jsx";
import Footer from "@/components/footer/Footer";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Cell IIIT Trichy | Fostering Innovation & Entrepreneurship",
  description: "Entrepreneurship Cell (E-Cell) IIIT Trichy promotes leadership and innovation, providing resources, mentorship, and networking for aspiring entrepreneurs.",
  icons: {
    icon: "/Ecell-logo.png",
    apple: "/Ecell-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
