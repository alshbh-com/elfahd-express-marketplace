
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const jobCategories = [
  {
    name: "مطاعم وكافيهات",
    jobs: [
      { title: "شيف", description: "خبرة لا تقل عن 3 سنوات في المطاعم الكبرى" },
      { title: "ويتر/ويترس", description: "دوام كامل أو جزئي، خبرة سابقة مطلوبة" },
      { title: "كاشير", description: "إجادة التعامل مع الحاسوب وأنظمة المبيعات" }
    ]
  },
  {
    name: "توصيل",
    jobs: [
      { title: "سائق دراجة", description: "امتلاك دراجة نارية ورخصة قيادة سارية" },
      { title: "مندوب توصيل", description: "معرفة جيدة بالمناطق المحيطة" }
    ]
  },
  {
    name: "إدارة ومبيعات",
    jobs: [
      { title: "مدير فرع", description: "خبرة إدارية لا تقل عن 5 سنوات" },
      { title: "مندوب مبيعات", description: "قدرة على التواصل وإقناع العملاء" },
      { title: "خدمة عملاء", description: "مهارات تواصل ممتازة واتقان استخدام الكمبيوتر" }
    ]
  }
];

export default function Jobs() {
  const handleContactClick = () => {
    window.open(`https://wa.me/201024713976`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">فرص عمل</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">انضم إلى فريق ELFAHD</h2>
        <p className="text-lg text-gray-700 mb-6">
          نبحث دائماً عن أشخاص موهوبين للانضمام إلى فريقنا المتنامي. استعرض الوظائف المتاحة أدناه وتواصل معنا للتقديم.
        </p>
        <Button
          onClick={handleContactClick}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
        >
          <Phone size={20} />
          <span>تواصل للتقديم</span>
        </Button>
      </div>

      <div className="space-y-8">
        {jobCategories.map((category, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-elfahd-primary text-white p-4">
              <h2 className="text-xl font-bold">{category.name}</h2>
            </div>
            <div className="p-4">
              <div className="divide-y">
                {category.jobs.map((job, jobIdx) => (
                  <div key={jobIdx} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="text-lg font-bold mb-2">{job.title}</h3>
                    <p className="text-gray-700 mb-3">{job.description}</p>
                    <Button
                      onClick={handleContactClick}
                      className="bg-elfahd-secondary hover:bg-orange-500 text-white"
                    >
                      تواصل للتقديم
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-elfahd-primary to-elfahd-secondary text-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">لم تجد الوظيفة المناسبة؟</h2>
        <p className="mb-4">
          أرسل لنا سيرتك الذاتية وسنتواصل معك عند توفر فرص مناسبة لمهاراتك.
        </p>
        <Button
          onClick={handleContactClick}
          className="bg-white text-elfahd-primary hover:bg-gray-100"
        >
          تواصل معنا
        </Button>
      </div>
    </div>
  );
}
