
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Store } from "lucide-react";
import { toast } from "sonner";

export default function AddStore() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name || !category || !ownerName || !phone) {
      toast.error("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }

    // Format message for WhatsApp
    let message = `*طلب إضافة متجر جديد*\n\n`;
    message += `اسم المتجر: ${name}\n`;
    message += `نوع المتجر: ${category}\n`;
    message += `اسم المالك: ${ownerName}\n`;
    message += `رقم الهاتف: ${phone}\n`;
    message += `العنوان: ${address}\n`;
    message += `نبذة عن المتجر: ${description}`;

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the formatted message
    window.open(`https://wa.me/201024713976?text=${encodedMessage}`, "_blank");
    
    // Reset the form
    setName("");
    setCategory("");
    setOwnerName("");
    setPhone("");
    setAddress("");
    setDescription("");
    
    toast.success("تم إرسال طلبك بنجاح! سنتواصل معك قريباً.");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-elfahd-primary text-white rounded-full mb-4">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">أضف متجرك</h1>
          <p className="text-lg text-gray-700">
            انضم إلى منصة ELFAHD واستفد من آلاف العملاء المحتملين
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المتجر *
                </label>
                <Input
                  id="store-name"
                  placeholder="اسم المتجر"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="store-category" className="block text-sm font-medium text-gray-700 mb-1">
                  نوع المتجر *
                </label>
                <select
                  id="store-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-elfahd-primary focus:border-elfahd-primary"
                  required
                >
                  <option value="">اختر نوع المتجر</option>
                  <option value="مطعم">مطعم</option>
                  <option value="صيدلية">صيدلية</option>
                  <option value="سوبر ماركت">سوبر ماركت</option>
                  <option value="طبيب">طبيب</option>
                  <option value="صنايعي">صنايعي</option>
                  <option value="آخر">آخر</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="owner-name" className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المالك *
                </label>
                <Input
                  id="owner-name"
                  placeholder="اسم المالك"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                عنوان المتجر
              </label>
              <Input
                id="address"
                placeholder="عنوان المتجر"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                نبذة عن المتجر
              </label>
              <Textarea
                id="description"
                placeholder="اكتب نبذة مختصرة عن متجرك ومميزاته"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-elfahd-primary hover:bg-blue-700"
              >
                إرسال الطلب
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="font-bold mb-2">ظهور أكبر</h3>
            <p className="text-sm text-gray-700">
              اعرض منتجاتك لآلاف العملاء المحتملين
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="font-bold mb-2">زيادة المبيعات</h3>
            <p className="text-sm text-gray-700">
              استفد من منصتنا لزيادة مبيعاتك وأرباحك
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-4xl mb-2">📱</div>
            <h3 className="font-bold mb-2">إدارة سهلة</h3>
            <p className="text-sm text-gray-700">
              سهولة في إدارة منتجاتك وطلباتك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
