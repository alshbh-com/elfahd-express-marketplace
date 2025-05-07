
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";

// Mock data for pharmacies
const mockPharmacies = [
  {
    id: "1",
    name: "صيدلية الفهد",
    image: "https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=صيدلية+الفهد",
    rating: 4.8,
    reviews: 156,
    deliveryTime: "20-35 دقيقة",
    isOpen: true,
  },
  {
    id: "2",
    name: "صيدلية الدواء",
    image: "https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=صيدلية+الدواء",
    rating: 4.6,
    reviews: 124,
    deliveryTime: "25-40 دقيقة",
    isOpen: true,
  },
  {
    id: "3",
    name: "صيدلية الشفاء",
    image: "https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=صيدلية+الشفاء",
    rating: 4.5,
    reviews: 98,
    deliveryTime: "30-45 دقيقة",
    isOpen: false,
  },
  {
    id: "4",
    name: "صيدلية الحياة",
    image: "https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=صيدلية+الحياة",
    rating: 4.7,
    reviews: 112,
    deliveryTime: "15-30 دقيقة",
    isOpen: true,
  }
];

export default function Pharmacies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filteredPharmacies = mockPharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrescriptionSubmit = () => {
    if (!selectedFile) {
      toast.error("الرجاء تحميل صورة الروشتة أولاً");
      return;
    }

    // Format message for WhatsApp
    const message = "مرحباً، أرغب في طلب أدوية حسب الروشتة المرفقة.";
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/201024713976?text=${encodedMessage}`, "_blank");
    
    // Reset the form
    setSelectedFile(null);
    setPreviewUrl(null);
    
    toast.success("تم إرسال طلبك بنجاح! سنتواصل معك قريباً.");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">الصيدليات</h1>

      {/* Prescription Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">تصوير الروشتة</h2>
            <p className="text-gray-700 mb-4">
              قم بتصوير الروشتة وإرسالها إلينا وسنقوم بتجهيز الأدوية المطلوبة لك
            </p>
            
            {previewUrl ? (
              <div className="mb-4">
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Prescription Preview" 
                    className="max-w-full h-auto rounded-lg border"
                  />
                  <button 
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-elfahd-primary transition">
                  <Camera size={48} className="mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-gray-600">انقر لاختيار صورة أو التقاط صورة</div>
                  <input 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    capture="environment"
                  />
                </label>
              </div>
            )}
            
            <Button 
              onClick={handlePrescriptionSubmit} 
              className="w-full md:w-auto bg-elfahd-primary hover:bg-blue-700"
              disabled={!selectedFile}
            >
              إرسال الروشتة
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <img 
              src="https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=ELFAHD+Pharmacy" 
              alt="Pharmacy Services"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="ابحث عن صيدلية..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Pharmacy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPharmacies.map((pharmacy) => (
          <Link key={pharmacy.id} to={`/pharmacies/${pharmacy.id}`} className="block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={pharmacy.image}
                alt={pharmacy.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{pharmacy.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${pharmacy.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {pharmacy.isOpen ? 'متاح' : 'مغلق'}
                  </span>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-sm ${i < Math.floor(pharmacy.rating) ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 mr-1">({pharmacy.reviews} تقييم)</span>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm bg-green-100 text-green-600 px-2 py-0.5 rounded">
                    توصيل سريع
                  </span>
                  <span className="text-sm text-gray-600">
                    {pharmacy.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
