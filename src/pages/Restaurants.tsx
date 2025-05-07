
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for restaurants
const mockRestaurants = [
  {
    id: "1",
    name: "برجر كينج",
    image: "https://via.placeholder.com/400x200/FF6600/FFFFFF?text=برجر+كينج",
    categories: ["برجر", "وجبات سريعة"],
    rating: 4.5,
    reviews: 230,
    deliveryTime: "30-45 دقيقة",
    minOrder: 50,
  },
  {
    id: "2",
    name: "بيتزا هت",
    image: "https://via.placeholder.com/400x200/FF6600/FFFFFF?text=بيتزا+هت",
    categories: ["بيتزا", "إيطالي"],
    rating: 4.2,
    reviews: 180,
    deliveryTime: "40-55 دقيقة",
    minOrder: 75,
  },
  {
    id: "3",
    name: "ماكدونالدز",
    image: "https://via.placeholder.com/400x200/FF6600/FFFFFF?text=ماكدونالدز",
    categories: ["برجر", "وجبات سريعة"],
    rating: 4.3,
    reviews: 320,
    deliveryTime: "25-40 دقيقة",
    minOrder: 40,
  },
  {
    id: "4",
    name: "كنتاكي",
    image: "https://via.placeholder.com/400x200/FF6600/FFFFFF?text=كنتاكي",
    categories: ["دجاج", "وجبات سريعة"],
    rating: 4.4,
    reviews: 280,
    deliveryTime: "35-50 دقيقة",
    minOrder: 60,
  },
  {
    id: "5",
    name: "المطعم الشرقي",
    image: "https://via.placeholder.com/400x200/FF6600/FFFFFF?text=المطعم+الشرقي",
    categories: ["شرقي", "مشويات"],
    rating: 4.7,
    reviews: 150,
    deliveryTime: "45-60 دقيقة",
    minOrder: 100,
  },
  {
    id: "6",
    name: "سوشي واي",
    image: "https://via.placeholder.com/400x200/FF6600/FFFFFF?text=سوشي+واي",
    categories: ["ياباني", "سوشي"],
    rating: 4.6,
    reviews: 95,
    deliveryTime: "50-70 دقيقة",
    minOrder: 150,
  }
];

// Categories for filtering
const categories = ["الكل", "برجر", "بيتزا", "دجاج", "شرقي", "إيطالي", "ياباني", "مشويات", "سوشي", "وجبات سريعة"];

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "الكل" || restaurant.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">المطاعم</h1>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="ابحث عن مطعم..."
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

      {/* Restaurant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} className="block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{restaurant.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-sm ${i < Math.floor(restaurant.rating) ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 mr-1">({restaurant.reviews} تقييم)</span>
                </div>
                <p className="text-sm text-gray-600">
                  {restaurant.categories.join(" • ")}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    الحد الأدنى: {restaurant.minOrder} ج.م
                  </span>
                  <span className="text-sm text-gray-600">
                    {restaurant.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">لم يتم العثور على مطاعم مطابقة</p>
        </div>
      )}
    </div>
  );
}
