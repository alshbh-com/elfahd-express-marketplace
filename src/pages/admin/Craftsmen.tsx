
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

// Define the Craftsman type to match our database schema
interface Craftsman {
  id: string;
  name: string;
  profession: string;
  description: string | null;
  hourly_rate: number;
  image: string;
  phone: string | null;
  area: string | null;
  created_at?: string | null;
}

export default function AdminCraftsmen() {
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Craftsman, 'id' | 'created_at'>>({
    name: "",
    profession: "",
    description: "",
    hourly_rate: 0,
    image: "",
    phone: "",
    area: "",
  });

  useEffect(() => {
    fetchCraftsmen();
  }, []);

  async function fetchCraftsmen() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("craftsmen")
        .select("*")
        .order("name") as { data: Craftsman[] | null, error: any };

      if (error) throw error;
      setCraftsmen(data || []);
    } catch (error) {
      console.error("Error fetching craftsmen:", error);
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
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
  
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing craftsman
        const { error } = await supabase
          .from("craftsmen")
          .update(formData)
          .eq("id", editingId) as { error: any };

        if (error) throw error;
        toast.success("تم تحديث بيانات الصنايعي بنجاح");
      } else {
        // Create new craftsman
        const { error } = await supabase
          .from("craftsmen")
          .insert([formData]) as { error: any };

        if (error) throw error;
        toast.success("تم إضافة الصنايعي بنجاح");
      }
      
      // Reset form and refresh data
      setFormData({
        name: "",
        profession: "",
        description: "",
        hourly_rate: 0,
        image: "",
        phone: "",
        area: "",
      });
      setFormOpen(false);
      setEditingId(null);
      fetchCraftsmen();
    } catch (error) {
      console.error("Error saving craftsman:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleEdit = (craftsman: Craftsman) => {
    setEditingId(craftsman.id);
    setFormData({
      name: craftsman.name,
      profession: craftsman.profession,
      description: craftsman.description || "",
      hourly_rate: craftsman.hourly_rate,
      image: craftsman.image,
      phone: craftsman.phone || "",
      area: craftsman.area || "",
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنايعي؟")) return;
    
    try {
      const { error } = await supabase
        .from("craftsmen")
        .delete()
        .eq("id", id) as { error: any };

      if (error) throw error;
      toast.success("تم حذف الصنايعي بنجاح");
      fetchCraftsmen();
    } catch (error) {
      console.error("Error deleting craftsman:", error);
      toast.error("حدث خطأ أثناء حذف الصنايعي");
    }
  };

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة الصنايعية</h1>
          <Button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                profession: "",
                description: "",
                hourly_rate: 0,
                image: "",
                phone: "",
                area: "",
              });
              setFormOpen(true);
            }}
            className="bg-elfahd-primary hover:bg-blue-600"
          >
            <Plus size={16} className="ml-1" />
            إضافة صنايعي جديد
          </Button>
        </div>

        {/* Craftsman Form Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-center">{editingId ? "تعديل بيانات الصنايعي" : "إضافة صنايعي جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="اسم الصنايعي"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">المهنة</label>
                <Input
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  required
                  placeholder="المهنة (سباك، كهربائي، نجار، الخ)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">المنطقة</label>
                <Input
                  name="area"
                  value={formData.area || ""}
                  onChange={handleInputChange}
                  placeholder="المنطقة التي يخدمها"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <Input
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  placeholder="رقم الهاتف"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <Textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  placeholder="وصف الخدمات المقدمة"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">صورة الصنايعي</label>
                <ImageUploader 
                  onImageUrl={handleImageUpload} 
                  currentImageUrl={formData.image}
                  folder="craftsmen" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">السعر بالساعة</label>
                <Input
                  type="number"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleNumberInputChange}
                  min={0}
                  step={0.01}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? "حفظ التغييرات" : "إضافة الصنايعي"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Craftsmen List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : craftsmen.length === 0 ? (
            <div className="p-8 text-center">لا يوجد صنايعية حتى الآن</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المهنة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنطقة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر بالساعة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {craftsmen.map((craftsman) => (
                    <tr key={craftsman.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{craftsman.name}</div>
                          {craftsman.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{craftsman.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={craftsman.image} alt={craftsman.name} className="w-16 h-16 rounded object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {craftsman.profession}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {craftsman.area || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {craftsman.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {craftsman.hourly_rate} ج.م
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(craftsman)}
                            className="ml-2"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(craftsman.id)}
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
