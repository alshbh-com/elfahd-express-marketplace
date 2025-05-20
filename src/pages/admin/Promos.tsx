
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { 
  Sheet,
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import ImageUploader from "@/components/admin/ImageUploader";

interface Promo {
  id: string;
  title: string;
  description: string | null;
  image: string;
  active: boolean;
  created_at: string;
}

export default function Promos() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<Partial<Promo> | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  
  const fetchPromos = async () => {
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
      toast.error("حدث خطأ أثناء تحميل العروض");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPromos();
  }, []);
  
  const handleAddEditClick = (promo?: Promo) => {
    if (promo) {
      setCurrentPromo(promo);
      setImageUrl(promo.image);
    } else {
      setCurrentPromo({ active: true });
      setImageUrl("");
    }
    setIsSheetOpen(true);
  };
  
  const handleSave = async () => {
    if (!currentPromo?.title) {
      toast.error("الرجاء إدخال عنوان العرض");
      return;
    }
    
    if (!imageUrl) {
      toast.error("الرجاء إضافة صورة للعرض");
      return;
    }
    
    try {
      const isUpdate = !!currentPromo.id;
      
      const promoData = {
        ...currentPromo,
        image: imageUrl
      };
      
      let response;
      
      if (isUpdate) {
        response = await supabase
          .from("promos")
          .update(promoData)
          .eq("id", currentPromo.id);
      } else {
        response = await supabase
          .from("promos")
          .insert([promoData]);
      }
      
      if (response.error) throw response.error;
      
      toast.success(isUpdate ? "تم تحديث العرض بنجاح" : "تم إضافة العرض بنجاح");
      setIsSheetOpen(false);
      fetchPromos();
    } catch (error) {
      console.error("Error saving promo:", error);
      toast.error("حدث خطأ أثناء حفظ العرض");
    }
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
  
  const handleToggleActive = async (promo: Promo) => {
    try {
      const { error } = await supabase
        .from("promos")
        .update({ active: !promo.active })
        .eq("id", promo.id);
        
      if (error) throw error;
      
      toast.success(`تم ${promo.active ? "إلغاء تفعيل" : "تفعيل"} العرض بنجاح`);
      fetchPromos();
    } catch (error) {
      console.error("Error toggling promo status:", error);
      toast.error("حدث خطأ أثناء تغيير حالة العرض");
    }
  };

  return (
    <AdminAuth>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">إدارة العروض</CardTitle>
            <Button 
              onClick={() => handleAddEditClick()}
              className="bg-elfahd-primary hover:bg-blue-700"
            >
              <Plus className="ml-2 h-4 w-4" /> إضافة عرض جديد
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : promos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد عروض حتى الآن. قم بإضافة عرض جديد.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الصورة</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promos.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>
                        <img 
                          src={promo.image} 
                          alt={promo.title} 
                          className="h-12 w-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{promo.title}</TableCell>
                      <TableCell>
                        {promo.description ? (
                          promo.description.length > 50 
                            ? `${promo.description.substring(0, 50)}...` 
                            : promo.description
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            promo.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {promo.active ? "نشط" : "غير نشط"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2 items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(promo)}
                          >
                            {promo.active ? "إلغاء التفعيل" : "تفعيل"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAddEditClick(promo)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(promo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full md:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {currentPromo?.id ? "تعديل عرض" : "إضافة عرض جديد"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان العرض</Label>
              <Input
                id="title"
                value={currentPromo?.title || ""}
                onChange={(e) =>
                  setCurrentPromo({
                    ...currentPromo,
                    title: e.target.value,
                  })
                }
                placeholder="أدخل عنوان العرض"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">وصف العرض</Label>
              <Textarea
                id="description"
                value={currentPromo?.description || ""}
                onChange={(e) =>
                  setCurrentPromo({
                    ...currentPromo,
                    description: e.target.value,
                  })
                }
                placeholder="أدخل وصف العرض"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>صورة العرض</Label>
              <ImageUploader
                onImageUrl={setImageUrl}
                currentImageUrl={imageUrl}
                folder="promos"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="active" className="flex-grow">حالة العرض</Label>
              <input
                id="active"
                type="checkbox"
                checked={currentPromo?.active ?? true}
                onChange={(e) =>
                  setCurrentPromo({
                    ...currentPromo,
                    active: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm">
                {currentPromo?.active ?? true ? "نشط" : "غير نشط"}
              </span>
            </div>
          </div>
          
          <SheetFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-elfahd-primary hover:bg-blue-700"
            >
              حفظ
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AdminAuth>
  );
}
