import { useQuery } from "@tanstack/react-query"; // 1. أضف هذا هنا
import {
  Building2,
  GraduationCap,
  Landmark,
  Handshake,
  Loader2,
} from "lucide-react";
import { partners as mockPartners } from "@/data/mockData";

// هذه الثوابت تبقى خارج الدالة كما هي
const iconMap = {
  industry: Building2,
  rectorate: Landmark,
  academic: GraduationCap,
};

const typeColors = {
  industry: "bg-primary/10 text-primary",
  rectorate: "bg-accent/10 text-accent",
  academic: "bg-success/10 text-success",
};

const PartnersPage = () => {
  // 2. ضعه في بداية الدالة مباشرة قبل أي شيء آخر
  const {
    data: partners,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["partners"],
    queryFn: () =>
      fetch("http://localhost:5000/api/partners").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      }),
  });

  // Fallback to mock data if API is empty
  const displayPartners = partners && partners.length > 0 ? partners : mockPartners;

  // 3. حالات التحميل والخطأ توضع هنا قبل الـ return الرئيسي
  if (isLoading)
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="py-20 text-center text-red-500">
        Error connecting to server
      </div>
    );

  // 4. الآن الـ return يستعمل الـ partners القادمة من useQuery بدلاً من mockData
  return (
    <div className="container py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
          <Handshake className="h-5 w-5 text-warning" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Partnership Grid
        </h1>
      </div>
      <p className="text-muted-foreground mb-8 ml-[52px]">
        Collaborations with industry, rectorate, and academic institutions
        powering the AI House mission.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayPartners?.map((p) => {
          const Icon = iconMap[p.type] || Building2;
          const colorClass =
            typeColors[p.type] || "bg-muted text-muted-foreground";
          return (
            <div
              key={p._id || p.id}
              className="group relative rounded-3xl border border-border/50 bg-card p-1 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 z-10">
                 <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${colorClass}`}>
                  {p.type}
                </span>
              </div>
              
              <div className="flex flex-col h-full">
                {/* Logo Container */}
                <div className="relative aspect-video rounded-2xl bg-white flex items-center justify-center p-8 mb-2 overflow-hidden border border-border/30">
                  {p.logo ? (
                    <img 
                      src={p.logo} 
                      alt={p.name} 
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className={`h-16 w-16 rounded-2xl ${colorClass} flex items-center justify-center`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="px-5 pb-6 pt-2">
                  <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartnersPage;
