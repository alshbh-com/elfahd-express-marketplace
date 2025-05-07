
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for doctors
const mockSpecialties = [
  "جميع التخصصات", "باطنة", "أطفال", "نساء وتوليد", "جلدية", "عظام", "أسنان", "عيون", "أنف وأذن وحنجرة", "قلب"
];

const mockDoctors = [
  {
    id: "1",
    name: "د. أحمد محمد",
    image: "https://via.placeholder.com/400x400/F44336/FFFFFF?text=د.+أحمد",
    specialty: "باطنة",
    rating: 4.9,
    reviews: 120,
    education: "أستاذ بكلية الطب جامعة القاهرة",
    price: 300,
  },
  {
    id: "2",
    name: "د. سارة خالد",
    image: "https://via.placeholder.com/400x400/F44336/FFFFFF?text=د.+سارة",
    specialty: "أطفال",
    rating: 4.7,
    reviews: 98,
    education: "استشاري طب الأطفال",
    price: 250,
  },
  {
    id: "3",
    name: "د. محمد علي",
    image: "https://via.placeholder.com/400x400/F44336/FFFFFF?text=د.+محمد",
    specialty: "عظام",
    rating: 4.8,
    reviews: 156,
    education: "دكتوراه في جراحة العظام",
    price: 350,
  },
  {
    id: "4",
    name: "د. نورا حسن",
    image: "https://via.placeholder.com/400x400/F44336/FFFFFF?text=د.+نورا",
    specialty: "نساء وتوليد",
    rating: 4.9,
    reviews: 210,
    education: "أستاذ بكلية الطب جامعة عين شمس",
    price: 400,
  }
];

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("جميع التخصصات");

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "جميع التخصصات" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">الأطباء</h1>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="ابحث عن طبيب..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Specialties */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {mockSpecialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              onClick={() => setSelectedSpecialty(specialty)}
              className="flex-shrink-0"
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>

      {/* Doctor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Link key={doctor.id} to={`/doctors/${doctor.id}`} className="block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex justify-center p-4 bg-gradient-to-r from-elfahd-primary to-elfahd-secondary">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold mb-1">{doctor.name}</h3>
                <p className="text-sm text-elfahd-primary font-medium mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {doctor.education}
                </p>
                <div className="flex items-center justify-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < Math.floor(doctor.rating) ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 mr-1">
                    ({doctor.reviews} تقييم)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                    سعر الكشف: {doctor.price} ج.م
                  </span>
                  <Button
                    size="sm"
                    className="bg-elfahd-secondary hover:bg-orange-500 text-white"
                  >
                    احجز الآن
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">لم يتم العثور على أطباء مطابقين</p>
        </div>
      )}
    </div>
  );
}
