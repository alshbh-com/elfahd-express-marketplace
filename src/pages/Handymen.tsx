
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for handymen categories
const categories = [
  "جميع الفئات", "سباكة", "كهرباء", "نجارة", "دهان", "تكييف", "أجهزة منزلية", "نظافة", "حدادة"
];

const mockHandymen = [
  {
    id: "1",
    name: "محمد صلاح",
    image: "https://via.placeholder.com/400x400/607D8B/FFFFFF?text=محمد",
    category: "كهرباء",
    rating: 4.8,
    reviews: 95,
    experience: "10 سنوات",
    hourlyRate: 100,
  },
  {
    id: "2",
    name: "أحمد حسن",
    image: "https://via.placeholder.com/400x400/607D8B/FFFFFF?text=أحمد",
    category: "سباكة",
    rating: 4.6,
    reviews: 78,
    experience: "8 سنوات",
    hourlyRate: 90,
  },
  {
    id: "3",
    name: "علي محمود",
    image: "https://via.placeholder.com/400x400/607D8B/FFFFFF?text=علي",
    category: "نجارة",
    rating: 4.9,
    reviews: 120,
    experience: "15 سنة",
    hourlyRate: 120,
  },
  {
    id: "4",
    name: "محمود أحمد",
    image: "https://via.placeholder.com/400x400/607D8B/FFFFFF?text=محمود",
    category: "دهان",
    rating: 4.7,
    reviews: 65,
    experience: "7 سنوات",
    hourlyRate: 85,
  },
  {
    id: "5",
    name: "خالد إبراهيم",
    image: "https://via.placeholder.com/400x400/607D8B/FFFFFF?text=خالد",
    category: "تكييف",
    rating: 4.8,
    reviews: 88,
    experience: "12 سنة",
    hourlyRate: 130,
  },
  {
    id: "6",
    name: "سعيد محمد",
    image: "https://via.placeholder.com/400x400/607D8B/FFFFFF?text=سعيد",
    category: "أجهزة منزلية",
    rating: 4.5,
    reviews: 72,
    experience: "9 سنوات",
    hourlyRate: 110,
  }
];

export default function Handymen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات");

  const filteredHandymen = mockHandymen.filter((handyman) => {
    const matchesSearch = handyman.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "جميع الفئات" || handyman.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactClick = (handyman: typeof mockHandymen[0]) => {
    // Format message for WhatsApp
    const message = `مرحباً، أرغب في التواصل مع الفني ${handyman.name} (${handyman.category})`;
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/201024713976?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">الصنايعية</h1>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="ابحث عن صنايعي..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Handymen List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHandymen.map((handyman) => (
          <div key={handyman.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex p-4">
              <img
                src={handyman.image}
                alt={handyman.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="mr-4">
                <h3 className="text-lg font-bold mb-1">{handyman.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{handyman.category}</p>
                <div className="flex items-center mb-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${i < Math.floor(handyman.rating) ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 mr-1">
                    ({handyman.reviews})
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  خبرة: {handyman.experience}
                </p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">
                  السعر: {handyman.hourlyRate} ج.م/ساعة
                </span>
              </div>
              <Button
                onClick={() => handleContactClick(handyman)}
                className="w-full bg-elfahd-primary hover:bg-blue-700"
              >
                تواصل الآن
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredHandymen.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">لم يتم العثور على صنايعية مطابقين</p>
        </div>
      )}
    </div>
  );
}
