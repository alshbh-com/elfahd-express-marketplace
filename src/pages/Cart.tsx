
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const handleCheckout = () => {
    if (!name || !phone || !address) {
      toast.error("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }

    // Format order details for WhatsApp
    const totalPrice = getTotalPrice();
    
    let orderDetails = `*طلب جديد من تطبيق ELFAHD*\n\n`;
    orderDetails += `*معلومات العميل:*\n`;
    orderDetails += `الاسم: ${name}\n`;
    orderDetails += `رقم الهاتف: ${phone}\n`;
    orderDetails += `العنوان: ${address}\n\n`;
    
    if (notes) {
      orderDetails += `*ملاحظات:* ${notes}\n\n`;
    }
    
    orderDetails += `*الطلبات:*\n`;
    
    cartItems.forEach((item, index) => {
      orderDetails += `${index + 1}. ${item.name} - ${item.quantity}× - ${item.price * item.quantity} ج.م\n`;
    });
    
    orderDetails += `\n*إجمالي الطلب:* ${totalPrice} ج.م`;
    
    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(orderDetails);
    
    // Open WhatsApp with the order details
    window.open(`https://wa.me/201024713976?text=${encodedMessage}`, "_blank");
    
    // Clear cart after successful order
    clearCart();
    
    // Show success message and navigate to home
    toast.success("تم إرسال طلبك بنجاح!");
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">عربة التسوق</h1>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold mb-2">عربة التسوق فارغة</h2>
          <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات إلى عربة التسوق حتى الآن</p>
          <Button onClick={() => navigate("/")} className="bg-elfahd-primary">
            استمر في التسوق
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">عربة التسوق</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">المنتجات ({cartItems.length})</h2>
            </div>
            
            {cartItems.map((item) => (
              <div key={item.id} className="border-b last:border-0 p-4">
                <div className="flex">
                  {item.image && (
                    <div className="w-20 h-20 rounded overflow-hidden mr-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold">{item.name}</h3>
                      <span className="font-bold text-elfahd-primary">
                        {item.price * item.quantity} ج.م
                      </span>
                    </div>
                    
                    {item.restaurantName && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.restaurantName}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                        >
                          -
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary and Checkout */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span>إجمالي المنتجات</span>
                <span>{getTotalPrice()} ج.م</span>
              </div>
              <div className="flex justify-between items-center">
                <span>رسوم التوصيل</span>
                <span>مجاناً</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>الإجمالي</span>
                  <span>{getTotalPrice()} ج.م</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <Input
                placeholder="الاسم الكامل*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder="رقم الهاتف*"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Textarea
                placeholder="العنوان التفصيلي*"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Textarea
                placeholder="ملاحظات إضافية"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <Button
              onClick={handleCheckout}
              className="w-full bg-elfahd-primary hover:bg-blue-700"
            >
              إتمام الطلب
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
