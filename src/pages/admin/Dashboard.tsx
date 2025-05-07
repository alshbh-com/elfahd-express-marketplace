
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminAuth from "@/components/admin/AdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Building2, ShoppingBag } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    restaurants: 0,
    products: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get categories count
        const { count: categoriesCount } = await supabase
          .from("categories")
          .select("*", { count: 'exact', head: true });

        // Get restaurants count
        const { count: restaurantsCount } = await supabase
          .from("restaurants")
          .select("*", { count: 'exact', head: true });

        // Get products count
        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: 'exact', head: true });

        setStats({
          categories: categoriesCount || 0,
          restaurants: restaurantsCount || 0,
          products: productsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">الأقسام</CardTitle>
              <Building2 className="h-5 w-5 text-elfahd-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.categories}</p>
              <Link to="/admin/categories" className="text-sm text-elfahd-primary hover:underline mt-2 block">
                إدارة الأقسام
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">المطاعم</CardTitle>
              <Utensils className="h-5 w-5 text-elfahd-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.restaurants}</p>
              <Link to="/admin/restaurants" className="text-sm text-elfahd-primary hover:underline mt-2 block">
                إدارة المطاعم
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">المنتجات</CardTitle>
              <ShoppingBag className="h-5 w-5 text-elfahd-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.products}</p>
              <Link to="/admin/products" className="text-sm text-elfahd-primary hover:underline mt-2 block">
                إدارة المنتجات
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/categories" className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">إدارة الأقسام</h3>
            <p className="text-gray-600">إضافة، تعديل وحذف الأقسام</p>
          </Link>
          
          <Link to="/admin/restaurants" className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">إدارة المطاعم</h3>
            <p className="text-gray-600">إضافة، تعديل وحذف المطاعم</p>
          </Link>
          
          <Link to="/admin/products" className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">إدارة المنتجات</h3>
            <p className="text-gray-600">إضافة، تعديل وحذف المنتجات</p>
          </Link>
        </div>
      </div>
    </AdminAuth>
  );
}
