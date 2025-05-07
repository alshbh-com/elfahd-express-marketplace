
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ADMIN_PASSWORD = "01278006248"; // Hardcoded password as specified

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Store authentication in session storage
      sessionStorage.setItem("admin-authenticated", "true");
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/admin/dashboard");
    } else {
      toast.error("كلمة المرور غير صحيحة");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">لوحة التحكم</h1>
        <p className="text-gray-600 mb-6 text-center">
          الرجاء إدخال كلمة المرور للدخول إلى لوحة التحكم
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-elfahd-primary hover:bg-blue-600" 
            disabled={isLoading}
          >
            {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
