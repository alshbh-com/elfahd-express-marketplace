
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Supermarkets() {
  const [groceryList, setGroceryList] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    if (!groceryList) {
      toast.error("الرجاء إدخال قائمة المشتريات");
      return;
    }

    if (!name || !phone || !address) {
      toast.error("الرجاء إدخال بياناتك الشخصية");
      return;
    }

    // Format message for WhatsApp
    let message = `*طلب جديد من سوبرماركت ELFAHD*\n\n`;
    message += `*معلومات العميل:*\n`;
    message += `الاسم: ${name}\n`;
    message += `رقم الهاتف: ${phone}\n`;
    message += `العنوان: ${address}\n\n`;
    message += `*قائمة المشتريات:*\n${groceryList}`;

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the formatted message
    window.open(`https://wa.me/201024713976?text=${encodedMessage}`, "_blank");
    
    // Reset the form
    setGroceryList("");
    setName("");
    setPhone("");
    setAddress("");
    
    toast.success("تم إرسال طلبك بنجاح!");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">سوبر ماركت</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Form */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">اطلب مشترياتك</h2>
            <p className="text-gray-700 mb-6">
              اكتب قائمة مشترياتك وسنقوم بتوصيلها إليك في أسرع وقت ممكن
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="grocery-list" className="block text-sm font-medium text-gray-700 mb-1">
                  قائمة المشتريات *
                </label>
                <Textarea
                  id="grocery-list"
                  placeholder="مثال: 1 كيلو أرز، 2 لتر حليب، خبز، علبة جبنة..."
                  value={groceryList}
                  onChange={(e) => setGroceryList(e.target.value)}
                  rows={6}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-elfahd-primary focus:border-elfahd-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="رقم الهاتف"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-elfahd-primary focus:border-elfahd-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان *
                </label>
                <Textarea
                  id="address"
                  placeholder="العنوان التفصيلي للتوصيل"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-elfahd-primary hover:bg-blue-700"
              >
                إرسال الطلب
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Information and Benefits */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">لماذا تختارنا؟</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-elfahd-light rounded-full flex items-center justify-center text-elfahd-primary">
                  ⏱️
                </div>
                <div>
                  <h3 className="font-bold">توصيل سريع</h3>
                  <p className="text-gray-600">نوصل طلبك في أسرع وقت ممكن</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-elfahd-light rounded-full flex items-center justify-center text-elfahd-primary">
                  🛒
                </div>
                <div>
                  <h3 className="font-bold">منتجات طازجة</h3>
                  <p className="text-gray-600">نختار أفضل المنتجات الطازجة من أفضل المصادر</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-elfahd-light rounded-full flex items-center justify-center text-elfahd-primary">
                  💰
                </div>
                <div>
                  <h3 className="font-bold">أسعار منافسة</h3>
                  <p className="text-gray-600">أسعارنا منافسة وشفافة بدون رسوم خفية</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-elfahd-light rounded-full flex items-center justify-center text-elfahd-primary">
                  🔄
                </div>
                <div>
                  <h3 className="font-bold">استبدال سهل</h3>
                  <p className="text-gray-600">إذا لم تكن راضياً عن أي منتج، نستبدله بدون مشاكل</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-elfahd-primary to-elfahd-secondary text-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-2">عرض خاص! 🎉</h2>
            <p className="mb-4">توصيل مجاني للطلبات فوق 100 جنيه</p>
            <p className="text-sm">العرض ساري حتى نهاية الشهر</p>
          </div>
        </div>
      </div>
    </div>
  );
}
