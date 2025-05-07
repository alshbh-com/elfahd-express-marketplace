
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

// Mock data for restaurant
const mockRestaurant = {
  id: "1",
  name: "برجر كينج",
  image: "https://via.placeholder.com/400x200/FF6600/FFFFFF?text=برجر+كينج",
  cover: "https://via.placeholder.com/1200x400/FF6600/FFFFFF?text=برجر+كينج",
  categories: ["برجر", "وجبات سريعة"],
  rating: 4.5,
  reviews: 230,
  deliveryTime: "30-45 دقيقة",
  minOrder: 50,
  description: "استمتع بأشهى برجر في المدينة مع خدمة توصيل سريعة وأطعمة طازجة"
};

// Mock menu categories and items
const menuCategories = [
  {
    id: "burgers",
    name: "برجر",
    items: [
      {
        id: "burger-1",
        name: "بيج كينج",
        price: 90,
        description: "برجر دبل لحم مع جبنة وصوص خاص",
        image: "https://via.placeholder.com/300x200/FF6600/FFFFFF?text=بيج+كينج"
      },
      {
        id: "burger-2",
        name: "تشيز برجر",
        price: 75,
        description: "برجر لحم مع طبقة مضاعفة من الجبن الذائب",
        image: "https://via.placeholder.com/300x200/FF6600/FFFFFF?text=تشيز+برجر"
      }
    ]
  },
  {
    id: "sides",
    name: "جانبية",
    items: [
      {
        id: "sides-1",
        name: "بطاطس كبير",
        price: 35,
        description: "بطاطس مقرمشة مقلية",
        image: "https://via.placeholder.com/300x200/FF6600/FFFFFF?text=بطاطس"
      },
      {
        id: "sides-2",
        name: "حلقات البصل",
        price: 30,
        description: "حلقات بصل مقرمشة",
        image: "https://via.placeholder.com/300x200/FF6600/FFFFFF?text=حلقات+البصل"
      }
    ]
  },
  {
    id: "drinks",
    name: "مشروبات",
    items: [
      {
        id: "drink-1",
        name: "كوكاكولا",
        price: 15,
        description: "كوكاكولا باردة",
        image: "https://via.placeholder.com/300x200/FF6600/FFFFFF?text=كوكاكولا"
      },
      {
        id: "drink-2",
        name: "عصير برتقال",
        price: 20,
        description: "عصير برتقال طازج",
        image: "https://via.placeholder.com/300x200/FF6600/FFFFFF?text=عصير+برتقال"
      }
    ]
  }
];

export default function RestaurantDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("burgers");
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      restaurantId: id,
      restaurantName: mockRestaurant.name,
    });
    
    toast.success(`تمت إضافة ${item.name} إلى السلة`);
  };

  return (
    <div className="container mx-auto px-4 pb-10">
      {/* Restaurant Header */}
      <div className="relative mb-6">
        <img
          src={mockRestaurant.cover}
          alt={mockRestaurant.name}
          className="w-full h-48 object-cover rounded-b-xl"
        />
        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl">
          <h1 className="text-white text-2xl font-bold">{mockRestaurant.name}</h1>
          <div className="flex items-center text-white">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-sm ${i < Math.floor(mockRestaurant.rating) ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm mr-1">({mockRestaurant.reviews} تقييم)</span>
            <span className="mx-2">•</span>
            <span className="text-sm">{mockRestaurant.categories.join(", ")}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h2 className="text-xl font-bold mb-2">معلومات المطعم</h2>
        <p className="text-gray-700 mb-3">{mockRestaurant.description}</p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-100 rounded-lg px-3 py-1">
            <span className="text-sm text-gray-700">وقت التوصيل: {mockRestaurant.deliveryTime}</span>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-1">
            <span className="text-sm text-gray-700">الحد الأدنى للطلب: {mockRestaurant.minOrder} ج.م</span>
          </div>
        </div>
      </div>

      {/* Menu Tabs */}
      <Tabs defaultValue="burgers" value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">القائمة</h2>
          <TabsList className="flex overflow-x-auto space-x-2 pb-2">
            {menuCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex-shrink-0"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {menuCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-4">{category.name}</h3>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                    <div className="w-1/4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full rounded-lg aspect-square object-cover"
                      />
                    </div>
                    <div className="w-3/4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold">{item.name}</h4>
                        <span className="font-bold text-elfahd-primary">{item.price} ج.م</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        className="bg-elfahd-secondary hover:bg-orange-500 text-white"
                      >
                        إضافة إلى السلة
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
