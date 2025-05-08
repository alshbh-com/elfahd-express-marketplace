
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Phone, Settings } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-elfahd-primary">ELFAHD</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-2 bg-elfahd-primary text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              <Settings size={18} />
              <span>لوحة التحكم</span>
            </Link>
            <Link
              to="/add-store"
              className="relative group bg-gradient-to-r from-elfahd-primary to-elfahd-secondary text-white px-4 py-2 rounded-full font-medium transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer rounded-full opacity-75"></div>
              <div className="flex items-center justify-center space-x-2 relative z-10">
                <Store size={20} />
                <span>أضف متجرك</span>
              </div>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-elfahd-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-3">
            <Link
              to="/admin/dashboard"
              className="flex items-center justify-center space-x-2 bg-elfahd-primary text-white px-4 py-2 rounded-md font-medium mb-2"
            >
              <Settings size={18} />
              <span>لوحة التحكم</span>
            </Link>
            <Link
              to="/add-store"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-elfahd-primary to-elfahd-secondary text-white px-4 py-2 rounded-full font-medium"
            >
              <Store size={16} />
              <span>أضف متجرك</span>
            </div>
            </Link>
            <div className="flex justify-between items-center">
              <Link
                to="/cart"
                className="flex items-center space-x-2 text-gray-800 py-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>السلة{cartItems.length > 0 ? ` (${cartItems.length})` : ""}</span>
              </Link>
              <a
                href={`https://wa.me/201024713976`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-800 py-2"
              >
                <Phone className="h-5 w-5 text-green-600" />
                <span>تواصل معنا</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
