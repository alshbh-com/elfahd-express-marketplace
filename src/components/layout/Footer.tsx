
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ELFAHD Express</h3>
            <p className="text-gray-400">
              خدمة توصيل سريعة وموثوقة لجميع احتياجاتك اليومية من مطاعم وصيدليات وسوبر ماركت
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">الخدمات</h3>
            <ul className="space-y-2">
              <li><Link to="/restaurants" className="text-gray-400 hover:text-white">مطاعم</Link></li>
              <li><Link to="/pharmacies" className="text-gray-400 hover:text-white">صيدليات</Link></li>
              <li><Link to="/supermarkets" className="text-gray-400 hover:text-white">سوبر ماركت</Link></li>
              <li><Link to="/doctors" className="text-gray-400 hover:text-white">دكاترة</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">الشركة</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">من نحن</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white">سياسة الخصوصية</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white">الشروط والأحكام</Link></li>
              <li><Link to="/admin/login" className="text-gray-400 hover:text-white">لوحة التحكم</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">البريد الإلكتروني: info@elfahd.com</li>
              <li className="text-gray-400">الهاتف: +20 123 456 7890</li>
              <li className="text-gray-400">العنوان: القاهرة، مصر</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-500">© {new Date().getFullYear()} ELFAHD Express. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
