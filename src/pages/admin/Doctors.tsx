
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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string | null;
  price: number;
  image: string;
  phone: string | null;
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    description: "",
    price: 0,
    image: "",
    phone: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    setLoading(true);
    try {
      // Check if table exists
      const { error: checkError } = await supabase
        .from("doctors")
        .select("id", { count: "exact" })
        .limit(1);
      
      if (checkError) {
        // If table doesn't exist, show a message and return
        if (checkError.code === "42P01") { // PostgreSQL code for undefined_table
          console.log("Doctors table doesn't exist yet");
          setDoctors([]);
          setLoading(false);
          return;
        }
        throw checkError;
      }

      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("name");

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
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
        // Update existing doctor
        const { error } = await supabase
          .from("doctors")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("تم تحديث بيانات الطبيب بنجاح");
      } else {
        // Create new doctor
        const { error } = await supabase
          .from("doctors")
          .insert([formData]);

        if (error) throw error;
        toast.success("تم إضافة الطبيب بنجاح");
      }
      
      // Reset form and refresh data
      setFormData({
        name: "",
        specialty: "",
        description: "",
        price: 0,
        image: "",
        phone: "",
      });
      setFormOpen(false);
      setEditingId(null);
      fetchDoctors();
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      description: doctor.description || "",
      price: doctor.price,
      image: doctor.image,
      phone: doctor.phone || "",
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطبيب؟")) return;
    
    try {
      const { error } = await supabase
        .from("doctors")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف الطبيب بنجاح");
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("حدث خطأ أثناء حذف الطبيب");
    }
  };

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة الأطباء</h1>
          <Button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                specialty: "",
                description: "",
                price: 0,
                image: "",
                phone: "",
              });
              setFormOpen(true);
            }}
            className="bg-elfahd-primary hover:bg-blue-600"
          >
            <Plus size={16} className="ml-1" />
            إضافة طبيب جديد
          </Button>
        </div>

        {/* Doctor Form Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-center">{editingId ? "تعديل بيانات الطبيب" : "إضافة طبيب جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم الطبيب</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="اسم الطبيب"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">التخصص</label>
                <Input
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  required
                  placeholder="التخصص"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="رقم الهاتف"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="وصف الخدمات المقدمة"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">صورة الطبيب</label>
                <ImageUploader 
                  onImageUrl={handleImageUpload} 
                  currentImageUrl={formData.image}
                  folder="doctors" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">سعر الكشف</label>
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? "حفظ التغييرات" : "إضافة الطبيب"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Doctors List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : doctors.length === 0 ? (
            <div className="p-8 text-center">لا يوجد أطباء حتى الآن</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطبيب</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التخصص</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر الكشف</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          {doctor.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{doctor.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.specialty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.price} ج.م
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(doctor)}
                            className="ml-2"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(doctor.id)}
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
