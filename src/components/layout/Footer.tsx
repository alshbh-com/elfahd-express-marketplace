
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-4/12 mb-8 md:mb-0">
            <h2 className="text-xl font-bold mb-4 text-elfahd-primary">ELFAHD</h2>
            <p className="text-gray-600">
              تطبيق توصيل متكامل يجمع أفضل المطاعم والصيدليات والسوبر ماركت والخدمات تحت سقف واحد
            </p>
          </div>
          
          <div className="w-full md:w-3/12 mb-8 md:mb-0">
            <h3 className="text-lg font-medium mb-4 text-gray-700">الأقسام الرئيسية</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurants" className="text-gray-600 hover:text-elfahd-primary">
                  مطاعم
                </Link>
              </li>
              <li>
                <Link to="/pharmacies" className="text-gray-600 hover:text-elfahd-primary">
                  صيدليات
                </Link>
              </li>
              <li>
                <Link to="/supermarkets" className="text-gray-600 hover:text-elfahd-primary">
                  سوبر ماركت
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-600 hover:text-elfahd-primary">
                  توظيف
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-3/12">
            <h3 className="text-lg font-medium mb-4 text-gray-700">تواصل معنا</h3>
            <a 
              href={`https://wa.me/201024713976`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700"
            >
              <Phone className="h-5 w-5" />
              <span>+201024713976</span>
            </a>
            <div className="mt-4">
              <Link 
                to="/add-store"
                className="bg-elfahd-secondary text-white px-4 py-2 rounded-lg inline-block hover:bg-opacity-90 transition"
              >
                انضم كشريك
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ELFAHD Express - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
