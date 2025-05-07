
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  delivery_time: string;
  min_order: number;
  categories: string[];
}

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    setLoading(true);
    try {
      // Fetch restaurants
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from("restaurants")
        .select("*")
        .order("name");

      if (restaurantsError) throw restaurantsError;

      // Fetch all restaurant categories
      const { data: allCategories, error: categoriesError } = await supabase
        .from("restaurant_categories")
        .select("category_name");

      if (categoriesError) throw categoriesError;

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(allCategories?.map(item => item.category_name))
      );
      
      setCategories(["الكل", ...uniqueCategories]);

      // For each restaurant, fetch its categories
      const restaurantsWithCategories = await Promise.all(
        (restaurantsData || []).map(async (restaurant) => {
          const { data: restaurantCategories } = await supabase
            .from("restaurant_categories")
            .select("category_name")
            .eq("restaurant_id", restaurant.id);
            
          return {
            ...restaurant,
            categories: restaurantCategories?.map(c => c.category_name) || [],
          };
        })
      );

      setRestaurants(restaurantsWithCategories);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRestaurants = restaurants.filter(restaurant => {
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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                      الحد الأدنى: {restaurant.min_order} ج.م
                    </span>
                    <span className="text-sm text-gray-600">
                      {restaurant.delivery_time}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredRestaurants.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">لم يتم العثور على مطاعم مطابقة</p>
        </div>
      )}
    </div>
  );
}
