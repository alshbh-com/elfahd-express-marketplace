
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface Promo {
  id: string;
  image: string;
  title: string;
  description: string;
}

// Mock data for promotional offers
const mockPromos: Promo[] = [
  {
    id: "1",
    image: "https://via.placeholder.com/600x200/FF6600/FFFFFF?text=خصم+30%",
    title: "خصم 30% على جميع الوجبات",
    description: "استمتع بخصم 30% على جميع وجبات مطعم الفهد لفترة محدودة",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/600x200/0066CC/FFFFFF?text=توصيل+مجاني",
    title: "توصيل مجاني",
    description: "استمتع بتوصيل مجاني على جميع الطلبات فوق 100 جنيه",
  },
  {
    id: "3",
    image: "https://via.placeholder.com/600x200/4CAF50/FFFFFF?text=عروض+الصيدلية",
    title: "عروض الصيدلية",
    description: "خصومات تصل إلى 25% على المنتجات الصحية",
  }
];

export default function PromoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockPromos.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${currentSlide * 100}%)` }}
      >
        {mockPromos.map((promo) => (
          <div key={promo.id} className="w-full flex-shrink-0">
            <Card className="bg-gradient-to-r from-elfahd-primary to-elfahd-secondary text-white overflow-hidden">
              <img 
                src={promo.image}
                alt={promo.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{promo.title}</h3>
                <p className="mt-2">{promo.description}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Pagination dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {mockPromos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
