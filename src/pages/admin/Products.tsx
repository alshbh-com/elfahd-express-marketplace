
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string;
  restaurant_id: string;
  restaurant_name?: string;
}

interface Restaurant {
  id: string;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    restaurant_id: "",
  });

  useEffect(() => {
    fetchProductsWithRestaurants();
    fetchRestaurants();
  }, []);

  async function fetchProductsWithRestaurants() {
    setLoading(true);
    try {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (productsError) throw productsError;
      
      // Get restaurant names for each product
      if (products && products.length > 0) {
        const restaurantIds = [...new Set(products.map(p => p.restaurant_id))];
        const { data: restaurantsData, error: restaurantsError } = await supabase
          .from("restaurants")
          .select("id, name")
          .in("id", restaurantIds);
          
        if (restaurantsError) throw restaurantsError;
        
        // Map restaurant names to products
        const productsWithRestaurants = products.map(product => {
          const restaurant = restaurantsData?.find(r => r.id === product.restaurant_id);
          return {
            ...product,
            restaurant_name: restaurant?.name
          };
        });
        
        setProducts(productsWithRestaurants);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRestaurants() {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("حدث خطأ أثناء جلب قائمة المطاعم");
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleRestaurantChange = (value: string) => {
    setFormData(prev => ({ ...prev, restaurant_id: value }));
  };
  
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.restaurant_id) {
      toast.error("يجب اختيار مطعم");
      return;
    }
    
    try {
      if (editingId) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        // Create new product
        const { error } = await supabase
          .from("products")
          .insert([formData]);

        if (error) throw error;
        toast.success("تم إضافة المنتج بنجاح");
      }
      
      // Reset form and refresh data
      setFormData({
        name: "",
        description: "",
        price: 0,
        image: "",
        restaurant_id: "",
      });
      setFormOpen(false);
      setEditingId(null);
      fetchProductsWithRestaurants();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image: product.image,
      restaurant_id: product.restaurant_id,
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف المنتج بنجاح");
      fetchProductsWithRestaurants();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ أثناء حذف المنتج");
    }
  };

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <Button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                description: "",
                price: 0,
                image: "",
                restaurant_id: "",
              });
              setFormOpen(!formOpen);
            }}
            className="bg-elfahd-primary hover:bg-blue-600"
          >
            <Plus size={16} className="ml-1" />
            {formOpen ? "إلغاء" : "إضافة منتج جديد"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {formOpen && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المنتج</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="اسم المنتج"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="وصف المنتج"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">صورة المنتج</label>
                <ImageUploader 
                  onImageUrl={handleImageUpload} 
                  currentImageUrl={formData.image} 
                  folder="products"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">السعر</label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleNumberInputChange}
                    min={0}
                    step={0.01}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المطعم</label>
                  <Select value={formData.restaurant_id} onValueChange={handleRestaurantChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المطعم" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? "حفظ التغييرات" : "إضافة المنتج"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">لا توجد منتجات مضافة حتى الآن</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المطعم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={product.image} alt={product.name} className="w-16 h-12 rounded object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.price} ج.م
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.restaurant_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="ml-2"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminAuth>
  );
}
