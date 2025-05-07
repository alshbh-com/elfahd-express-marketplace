
import { Link } from "react-router-dom";

interface CategoryProps {
  title: string;
  icon: string;
  link: string;
  color: string;
}

export default function CategoryCard({ title, icon, link, color }: CategoryProps) {
  return (
    <Link to={link} className="block">
      <div className={`p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow ${color} text-white flex flex-col items-center justify-center aspect-square`}>
        <img src={icon} alt={title} className="w-12 h-12 mb-2" />
        <span className="font-medium text-center">{title}</span>
      </div>
    </Link>
  );
}
