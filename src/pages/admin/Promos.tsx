
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { Label } from "@/components/ui/label";

interface Promo {
  id: string;
  title: string;
  description: string | null;
  image: string;
  active: boolean;
  created_at: string;
}

export default function AdminPromos() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    active: true
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  async function fetchPromos() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromos(data || []);
    } catch (error) {
      console.error("Error fetching promos:", error);
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrl = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing promo
        const { error } = await supabase
          .from("promos")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("تم تحديث العرض بنجاح");
      } else {
        // Create new promo
        const { error } = await supabase
          .from("promos")
          .insert([formData]);

        if (error) throw error;
        toast.success("تم إضافة العرض بنجاح");
      }
      
      // Reset form and refresh data
      setFormData({
        title: "",
        description: "",
        image: "",
        active: true
      });
      setFormOpen(false);
      setEditingId(null);
      fetchPromos();
    } catch (error) {
      console.error("Error saving promo:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleEdit = (promo: Promo) => {
    setEditingId(promo.id);
    setFormData({
      title: promo.title,
      description: promo.description || "",
      image: promo.image,
      active: promo.active
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;
    
    try {
      const { error } = await supabase
        .from("promos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف العرض بنجاح");
      fetchPromos();
    } catch (error) {
      console.error("Error deleting promo:", error);
      toast.error("حدث خطأ أثناء حذف العرض");
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("promos")
        .update({ active: !currentState })
        .eq("id", id);

      if (error) throw error;
      toast.success("تم تحديث حالة العرض");
      fetchPromos();
    } catch (error) {
      console.error("Error updating promo status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة العرض");
    }
  };

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة العروض</h1>
          <Button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "",
                description: "",
                image: "",
                active: true
              });
              setFormOpen(!formOpen);
            }}
            className="bg-elfahd-primary hover:bg-blue-600"
          >
            <Plus size={16} className="ml-1" />
            {formOpen ? "إلغاء" : "إضافة عرض جديد"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {formOpen && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? "تعديل العرض" : "إضافة عرض جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان العرض</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="عنوان العرض"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="وصف العرض"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">صورة العرض</label>
                <ImageUploader 
                  onImageUrl={handleImageUrl}
                  currentImageUrl={formData.image}
                  folder="promos"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active-switch"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active-switch" className="mr-2">العرض نشط</Label>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? "حفظ التغييرات" : "إضافة العرض"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Promos List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : promos.length === 0 ? (
            <div className="p-8 text-center">لا توجد عروض مضافة حتى الآن</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العرض</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promos.map((promo) => (
                    <tr key={promo.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{promo.title}</div>
                          {promo.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{promo.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={promo.image} alt={promo.title} className="w-16 h-10 rounded object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {promo.active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(promo)}
                            className="ml-2"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant={promo.active ? "outline" : "default"}
                            className={promo.active 
                              ? "text-amber-600 border-amber-600 hover:bg-amber-50"
                              : "bg-green-600 hover:bg-green-700 text-white"}
                            onClick={() => toggleActive(promo.id, promo.active)}
                          >
                            {promo.active ? 'تعطيل' : 'تفعيل'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(promo.id)}
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
