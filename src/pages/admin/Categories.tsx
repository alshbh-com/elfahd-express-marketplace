
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  link: string;
  color: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    link: "",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  });

  // Predefined colors for easier selection
  const colorOptions = [
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-red-500 to-red-600",
    "bg-gradient-to-br from-gray-500 to-gray-600",
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("تم تحديث القسم بنجاح");
      } else {
        // Create new category
        const { error } = await supabase
          .from("categories")
          .insert([formData]);

        if (error) throw error;
        toast.success("تم إضافة القسم بنجاح");
      }
      
      // Reset form and refresh data
      setFormData({
        name: "",
        icon: "",
        link: "",
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
      });
      setFormOpen(false);
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      icon: category.icon,
      link: category.link,
      color: category.color,
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف القسم بنجاح");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("حدث خطأ أثناء حذف القسم");
    }
  };

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة الأقسام</h1>
          <Button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                icon: "",
                link: "",
                color: "bg-gradient-to-br from-blue-500 to-blue-600",
              });
              setFormOpen(!formOpen);
            }}
            className="bg-elfahd-primary hover:bg-blue-600"
          >
            <Plus size={16} className="ml-1" />
            {formOpen ? "إلغاء" : "إضافة قسم جديد"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {formOpen && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? "تعديل القسم" : "إضافة قسم جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم القسم</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="مثال: مطاعم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رابط الصورة</label>
                <Input
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  required
                  placeholder="رابط صورة القسم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الرابط</label>
                <Input
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  required
                  placeholder="مثال: /restaurants"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">لون القسم</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-8 h-8 rounded-full ${color} ${
                        formData.color === color ? "ring-2 ring-offset-2 ring-black" : ""
                      }`}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? "حفظ التغييرات" : "إضافة القسم"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">لا توجد أقسام مضافة حتى الآن</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القسم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرابط</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اللون</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={category.icon} alt={category.name} className="w-10 h-10 rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{category.link}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-full ${category.color}`}></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
                            className="ml-2"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(category.id)}
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
