
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/home/CategoryCard";
import PromoSlider from "@/components/home/PromoSlider";
import { Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  title: string;
  icon: string;
  link: string;
  color: string;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  categories: string[];
  delivery_time: string;
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*");

        if (categoriesError) throw categoriesError;

        // Format categories for display
        const formattedCategories = categoriesData?.map(cat => ({
          id: cat.id,
          title: cat.name,
          icon: cat.icon,
          link: cat.link,
          color: cat.color,
        })) || [];

        setCategories(formattedCategories);

        // Fetch popular restaurants (sorted by rating)
        const { data: restaurantsData, error: restaurantsError } = await supabase
          .from("restaurants")
          .select("*")
          .order("rating", { ascending: false })
          .limit(3);

        if (restaurantsError) throw restaurantsError;

        // For each restaurant, fetch its categories
        const restaurantsWithCategories = await Promise.all(
          (restaurantsData || []).map(async (restaurant) => {
            const { data: restaurantCategories } = await supabase
              .from("restaurant_categories")
              .select("category_name")
              .eq("restaurant_id", restaurant.id);
              
            return {
              id: restaurant.id,
              name: restaurant.name,
              image: restaurant.image,
              rating: restaurant.rating,
              reviews: restaurant.reviews,
              delivery_time: restaurant.delivery_time,
              categories: restaurantCategories?.map(c => c.category_name) || [],
            };
          })
        );

        setPopularRestaurants(restaurantsWithCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fallback categories if none are in the database yet
  const defaultCategories = [
    {
      id: "1",
      title: "مطاعم",
      icon: "https://via.placeholder.com/64/FF6600/FFFFFF?text=🍔",
      link: "/restaurants",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      id: "2",
      title: "صيدليات",
      icon: "https://via.placeholder.com/64/4CAF50/FFFFFF?text=💊",
      link: "/pharmacies",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      id: "3",
      title: "سوبر ماركت",
      icon: "https://via.placeholder.com/64/2196F3/FFFFFF?text=🛒",
      link: "/supermarkets",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      id: "4",
      title: "توظيف",
      icon: "https://via.placeholder.com/64/9C27B0/FFFFFF?text=👔",
      link: "/jobs",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      id: "5",
      title: "دكتور",
      icon: "https://via.placeholder.com/64/F44336/FFFFFF?text=👨‍⚕️",
      link: "/doctors",
      color: "bg-gradient-to-br from-red-500 to-red-600",
    },
    {
      id: "6",
      title: "صنيعية",
      icon: "https://via.placeholder.com/64/607D8B/FFFFFF?text=🔧",
      link: "/handymen",
      color: "bg-gradient-to-br from-gray-500 to-gray-600",
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero section */}
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
        <img
          src="https://via.placeholder.com/1200x400/0066CC/FFFFFF?text=ELFAHD+Express"
          alt="ELFAHD Express"
          className="w-full h-52 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-white text-3xl font-bold mb-2">ELFAHD Express</h1>
          <p className="text-white text-lg mb-4">
            كل ما تحتاجه في مكان واحد، توصيل سريع لجميع الخدمات
          </p>
          <Link to="/add-store">
            <Button className="bg-elfahd-secondary hover:bg-orange-500 text-white flex items-center space-x-2">
              <Store size={18} />
              <span>أضف متجرك الآن</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">الخدمات</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              icon={category.icon}
              link={category.link}
              color={category.color}
            />
          ))}
        </div>
      </section>

      {/* Featured promotions */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">عروض مميزة</h2>
        <PromoSlider />
      </section>

      {/* Popular restaurants */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">مطاعم شائعة</h2>
          <Link to="/restaurants" className="text-elfahd-primary hover:underline">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : popularRestaurants.length > 0 ? (
            popularRestaurants.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} className="block">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">{restaurant.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <span 
                            key={j} 
                            className={`text-sm ${j < Math.floor(restaurant.rating) ? "text-yellow-500" : "text-gray-300"}`}
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
                      <span className="text-sm bg-green-100 text-green-600 px-2 py-0.5 rounded">
                        توصيل سريع
                      </span>
                      <span className="text-sm text-gray-600">
                        {restaurant.delivery_time}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            defaultCategories.slice(0, 3).map((item, i) => (
              <Link key={i} to="/restaurants" className="block">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={`https://via.placeholder.com/400x200/FF6600/FFFFFF?text=مطعم+${i+1}`}
                    alt={`مطعم ${i+1}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">مطعم {i+1}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className={`text-sm ${j < 4 ? "text-yellow-500" : "text-gray-300"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 mr-1">(120 تقييم)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      برجر • بيتزا • دجاج
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm bg-green-100 text-green-600 px-2 py-0.5 rounded">
                        توصيل سريع
                      </span>
                      <span className="text-sm text-gray-600">
                        30-45 دقيقة
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
