
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

// Define the Doctor type to match our database schema
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  education: string | null;
  rating: number | null;
  reviews: number | null;
  price: number;
  image: string;
  created_at?: string | null;
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Doctor, 'id' | 'created_at'>>({
    name: "",
    specialty: "",
    education: "",
    rating: 0,
    reviews: 0,
    price: 0,
    image: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("name") as { data: Doctor[] | null, error: any };

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("حدث خطأ أثناء جلب بيانات الأطباء");
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
          .eq("id", editingId) as { error: any };

        if (error) throw error;
        toast.success("تم تحديث بيانات الطبيب بنجاح");
      } else {
        // Create new doctor
        const { error } = await supabase
          .from("doctors")
          .insert([formData]) as { error: any };

        if (error) throw error;
        toast.success("تم إضافة الطبيب بنجاح");
      }
      
      // Reset form and refresh data
      setFormData({
        name: "",
        specialty: "",
        education: "",
        rating: 0,
        reviews: 0,
        price: 0,
        image: ""
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
      education: doctor.education || "",
      rating: doctor.rating || 0,
      reviews: doctor.reviews || 0,
      price: doctor.price,
      image: doctor.image
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطبيب؟")) return;
    
    try {
      const { error } = await supabase
        .from("doctors")
        .delete()
        .eq("id", id) as { error: any };

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
                education: "",
                rating: 0,
                reviews: 0,
                price: 0,
                image: ""
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
                <label className="block text-sm font-medium mb-1">الاسم</label>
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
                  placeholder="التخصص (باطنة، أطفال، الخ)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">المؤهل العلمي</label>
                <Input
                  name="education"
                  value={formData.education || ""}
                  onChange={handleInputChange}
                  placeholder="المؤهل العلمي أو الدرجة العلمية"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">التقييم</label>
                  <Input
                    type="number"
                    name="rating"
                    value={formData.rating || 0}
                    onChange={handleNumberInputChange}
                    min={0}
                    max={5}
                    step={0.1}
                    placeholder="من 0 إلى 5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">عدد التقييمات</label>
                  <Input
                    type="number"
                    name="reviews"
                    value={formData.reviews || 0}
                    onChange={handleNumberInputChange}
                    min={0}
                    placeholder="عدد التقييمات"
                  />
                </div>
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
                  placeholder="سعر الكشف بالجنيه"
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التخصص</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المؤهل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقييم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر الكشف</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium">{doctor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.specialty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.education || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span>{doctor.rating || 0}</span>
                          <span className="text-gray-500 text-xs ml-1">({doctor.reviews || 0})</span>
                        </div>
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
