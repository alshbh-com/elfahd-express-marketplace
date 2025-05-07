
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  delivery_time: string;
  min_order: number;
  categories: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurant_id: string;
}

interface ProductCategory {
  id: string;
  name: string;
  items: Product[];
}

export default function RestaurantDetails() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchRestaurantDetails(id);
      fetchProducts(id);
    }
  }, [id]);

  async function fetchRestaurantDetails(restaurantId: string) {
    try {
      // Fetch restaurant details
      const { data: restaurantData, error: restaurantError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();

      if (restaurantError) throw restaurantError;
      
      if (!restaurantData) {
        toast.error("المطعم غير موجود");
        return;
      }

      // Fetch restaurant categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("restaurant_categories")
        .select("category_name")
        .eq("restaurant_id", restaurantId);
        
      if (categoriesError) throw categoriesError;

      const restaurantWithCategories = {
        ...restaurantData,
        categories: categoriesData?.map(c => c.category_name) || [],
      };

      setRestaurant(restaurantWithCategories);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات المطعم");
    }
  }

  async function fetchProducts(restaurantId: string) {
    setLoading(true);
    try {
      // Fetch products for this restaurant
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("restaurant_id", restaurantId);
        
      if (error) throw error;
      
      // Group products by category for display
      // For this example, we'll create some sample categories
      const categories: { [key: string]: Product[] } = {
        "برجر": [],
        "جانبية": [],
        "مشروبات": [],
        "حلويات": []
      };
      
      // Distribute products across categories (simple logic for demo)
      (products || []).forEach((product, index) => {
        const categoryKeys = Object.keys(categories);
        const categoryIndex = index % categoryKeys.length;
        categories[categoryKeys[categoryIndex]].push(product);
      });
      
      // Convert to array format for rendering
      const formattedCategories = Object.entries(categories)
        .filter(([_, items]) => items.length > 0) // Remove empty categories
        .map(([name, items], index) => ({
          id: `category-${index}`,
          name,
          items
        }));
      
      setProductCategories(formattedCategories);
      
      // Set the first category as active if there are products
      if (formattedCategories.length > 0) {
        setActiveTab(formattedCategories[0].id);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("حدث خطأ أثناء تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = (item: Product) => {
    if (!restaurant) return;
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
    
    toast.success(`تمت إضافة ${item.name} إلى السلة`);
  };

  // Use mock data if real data isn't available yet
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

  // Display loading state
  if (loading && !restaurant) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 rounded-b-xl mb-6"></div>
          <div className="h-6 bg-gray-300 w-3/4 mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 w-1/2 mb-6 rounded"></div>
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="h-5 bg-gray-300 w-1/4 mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 w-full mb-3 rounded"></div>
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const displayRestaurant = restaurant || mockRestaurant;

  return (
    <div className="container mx-auto px-4 pb-10">
      {/* Restaurant Header */}
      <div className="relative mb-6">
        <img
          src={restaurant?.image || mockRestaurant.cover}
          alt={displayRestaurant.name}
          className="w-full h-48 object-cover rounded-b-xl"
        />
        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl">
          <h1 className="text-white text-2xl font-bold">{displayRestaurant.name}</h1>
          <div className="flex items-center text-white">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-sm ${i < Math.floor(displayRestaurant.rating) ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm mr-1">({displayRestaurant.reviews} تقييم)</span>
            <span className="mx-2">•</span>
            <span className="text-sm">{displayRestaurant.categories.join(", ")}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h2 className="text-xl font-bold mb-2">معلومات المطعم</h2>
        <p className="text-gray-700 mb-3">{restaurant?.description || displayRestaurant.description}</p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-100 rounded-lg px-3 py-1">
            <span className="text-sm text-gray-700">
              وقت التوصيل: {restaurant?.delivery_time || displayRestaurant.deliveryTime}
            </span>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-1">
            <span className="text-sm text-gray-700">
              الحد الأدنى للطلب: {restaurant?.min_order || displayRestaurant.minOrder} ج.م
            </span>
          </div>
        </div>
      </div>

      {/* Menu Tabs */}
      {productCategories.length > 0 ? (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">القائمة</h2>
            <TabsList className="flex overflow-x-auto space-x-2 pb-2">
              {productCategories.map((category) => (
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

          {productCategories.map((category) => (
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
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-5 bg-gray-200 w-1/3 mx-auto rounded"></div>
              <div className="h-4 bg-gray-200 w-1/2 mx-auto rounded"></div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">لا توجد منتجات متاحة حالياً</h3>
              <p className="text-gray-500">
                يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالمطعم مباشرة.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
