
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-right" dir="rtl">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-center" />
    </div>
  );
}
