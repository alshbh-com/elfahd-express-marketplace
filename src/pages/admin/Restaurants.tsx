
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  delivery_time: string;
  min_order: number;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    rating: 0,
    reviews: 0,
    delivery_time: "30-45 دقيقة",
    min_order: 50,
  });

  useEffect(() => {
    fetchRestaurants();
    fetchCategories();
  }, []);

  async function fetchRestaurants() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("name");

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchRestaurantCategories(restaurantId: string) {
    try {
      const { data, error } = await supabase
        .from("restaurant_categories")
        .select("category_name")
        .eq("restaurant_id", restaurantId);

      if (error) throw error;
      setSelectedCategories(data?.map(c => c.category_name) || []);
    } catch (error) {
      console.error("Error fetching restaurant categories:", error);
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

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let restaurantId = editingId;
      
      if (editingId) {
        // Update existing restaurant
        const { error } = await supabase
          .from("restaurants")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        // Create new restaurant
        const { data, error } = await supabase
          .from("restaurants")
          .insert([formData])
          .select();

        if (error) throw error;
        restaurantId = data[0].id;
      }
      
      if (restaurantId) {
        // First delete existing categories
        await supabase
          .from("restaurant_categories")
          .delete()
          .eq("restaurant_id", restaurantId);
        
        // Then insert new categories
        if (selectedCategories.length > 0) {
          const categoryInserts = selectedCategories.map(category_name => ({
            restaurant_id: restaurantId,
            category_name
          }));
          
          const { error } = await supabase
            .from("restaurant_categories")
            .insert(categoryInserts);
            
          if (error) throw error;
        }
      }
      
      toast.success(editingId ? "تم تحديث المطعم بنجاح" : "تم إضافة المطعم بنجاح");
      
      // Reset form and refresh data
      setFormData({
        name: "",
        description: "",
        image: "",
        rating: 0,
        reviews: 0,
        delivery_time: "30-45 دقيقة",
        min_order: 50,
      });
      setSelectedCategories([]);
      setFormOpen(false);
      setEditingId(null);
      fetchRestaurants();
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleEdit = async (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setFormData({
      name: restaurant.name,
      description: restaurant.description || "",
      image: restaurant.image,
      rating: restaurant.rating,
      reviews: restaurant.reviews,
      delivery_time: restaurant.delivery_time || "30-45 دقيقة",
      min_order: restaurant.min_order,
    });
    await fetchRestaurantCategories(restaurant.id);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المطعم؟")) return;
    
    try {
      // Delete the restaurant (cascade will handle related records)
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف المطعم بنجاح");
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("حدث خطأ أثناء حذف المطعم");
    }
  };

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة المطاعم</h1>
          <Button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                description: "",
                image: "",
                rating: 0,
                reviews: 0,
                delivery_time: "30-45 دقيقة",
                min_order: 50,
              });
              setSelectedCategories([]);
              setFormOpen(!formOpen);
            }}
            className="bg-elfahd-primary hover:bg-blue-600"
          >
            <Plus size={16} className="ml-1" />
            {formOpen ? "إلغاء" : "إضافة مطعم جديد"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {formOpen && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? "تعديل المطعم" : "إضافة مطعم جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المطعم</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="اسم المطعم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="وصف المطعم"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رابط الصورة</label>
                <Input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="رابط صورة المطعم"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">التقييم</label>
                  <Input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleNumberInputChange}
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">عدد التقييمات</label>
                  <Input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleNumberInputChange}
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">وقت التوصيل</label>
                  <Input
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleInputChange}
                    placeholder="مثال: 30-45 دقيقة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الحد الأدنى للطلب</label>
                  <Input
                    type="number"
                    name="min_order"
                    value={formData.min_order}
                    onChange={handleNumberInputChange}
                    min={0}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الأقسام</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCategories.includes(category.name) 
                          ? "bg-elfahd-primary text-white" 
                          : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => toggleCategory(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? "حفظ التغييرات" : "إضافة المطعم"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Restaurants List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : restaurants.length === 0 ? (
            <div className="p-8 text-center">لا توجد مطاعم مضافة حتى الآن</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المطعم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقييم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{restaurant.name}</div>
                          {restaurant.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{restaurant.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={restaurant.image} alt={restaurant.name} className="w-16 h-12 rounded object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-500 ml-1">★</span>
                          <span>{restaurant.rating}</span>
                          <span className="text-gray-500 text-sm mr-1">({restaurant.reviews})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(restaurant)}
                            className="ml-2"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(restaurant.id)}
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
