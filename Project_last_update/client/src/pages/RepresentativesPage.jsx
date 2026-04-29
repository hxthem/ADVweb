import { useState, useMemo } from "react";
import { Search, Users, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import RepresentativeCard from "@/components/RepresentativeCard";
// لم نعد بحاجة لاستيراد 'representatives' من mockData لأنه سيأتي من الباكاند
import { departments, topics } from "@/data/mockData";

const RepresentativesPage = () => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [focusFilter, setFocusFilter] = useState("all");

  // 1. جلب البيانات الحقيقية من الباكاند (فقط المقبولين Approved)
  const {
    data: representatives,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["representatives"],
    queryFn: () =>
      fetch("http://localhost:5000/api/users/representatives").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch representatives");
        return res.json();
      }),
  });

  // 2. منطق التصفية (Filtering Logic) على البيانات القادمة
  const filtered = useMemo(() => {
    if (!representatives) return [];

    return representatives.filter((r) => {
      // البحث بالاسم
      const matchesSearch =
        !search || r.fullName.toLowerCase().includes(search.toLowerCase());
      // الفلترة بالقسم
      const matchesDept = deptFilter === "all" || r.department === deptFilter;
      // الفلترة بمجال الذكاء الاصطناعي
      const matchesFocus = focusFilter === "all" || r.aiFocus === focusFilter;

      return matchesSearch && matchesDept && matchesFocus;
    });
  }, [search, deptFilter, focusFilter, representatives]);

  const selectClass =
    "rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors cursor-pointer";

  // حالة التحميل
  if (isLoading)
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="mt-4 text-muted-foreground animate-pulse">
          جاري جلب قائمة الأساتذة...
        </p>
      </div>
    );

  // حالة الخطأ
  if (error)
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-destructive">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="font-bold">عذراً، تعذر الاتصال بالسيرفر</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 underline text-sm text-foreground"
        >
          إعادة المحاولة
        </button>
      </div>
    );

  return (
    <div className="container py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Users className="h-5 w-5 text-accent" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          AI Representative Network
        </h1>
      </div>
      <p className="text-muted-foreground mb-8 ml-[52px]">
        Faculty members leading the AI transition within their departments at
        the University of Blida 1.
      </p>

      {/* شريط البحث والفلاتر */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 mb-8 shadow-card">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={focusFilter}
            onChange={(e) => setFocusFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">All AI Focus</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-5 font-medium">
        {filtered.length} representatives found
      </p>

      {/* عرض النتائج */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((r) => (
            <RepresentativeCard key={r._id} rep={r} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground italic">
            No representatives found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default RepresentativesPage;
