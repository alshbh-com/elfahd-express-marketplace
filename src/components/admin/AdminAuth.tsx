
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin-authenticated") === "true";
    
    if (!isAuthenticated) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Function to handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("admin-authenticated");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/admin/login");
  };

  return (
    <div className="admin-authenticated">
      <div className="bg-white shadow-sm border-b mb-4">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-bold text-lg text-elfahd-primary">لوحة التحكم ELFAHD</h1>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
