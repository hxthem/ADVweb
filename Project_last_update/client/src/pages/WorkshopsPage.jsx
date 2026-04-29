import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Calendar, Loader2, AlertCircle } from "lucide-react";
import WorkshopCard from "@/components/WorkshopCard";
import axios from "axios";

// استيراد القوائم الثابتة (أو جلبها من الباكاند لاحقاً)
const departments = [
  "Computer Science",
  "Artificial Intelligence",
  "Mathematics",
  "Cybersecurity",
];
const topics = [
  "Machine Learning",
  "NLP",
  "Deep Learning",
  "Data Analysis",
  "Ethics",
];

const WorkshopsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // جلب البيانات من الباكاند مع تمرير الفلاتر كـ Query Parameters
  const {
    data: workshops = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "workshops",
      search,
      statusFilter,
      deptFilter,
      topicFilter,
      audienceFilter,
      categoryFilter,
    ],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/api/workshops", {
        params: {
          search,
          status: statusFilter,
          department: deptFilter,
          topic: topicFilter,
          audience: audienceFilter,
          category: categoryFilter,
        },
      });
      return data;
    },
    keepPreviousData: true, // لتحسين تجربة المستخدم أثناء الكتابة
  });

  const selectClass =
    "rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors cursor-pointer hover:bg-muted/50";

  return (
    <div className="container py-12 max-w-7xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
          Events & Activities
        </h1>
      </div>
      <p className="text-muted-foreground mb-8 ml-[52px]">
        University of Blida 1: Explore and register for specialized AI sessions.
      </p>

      {/* Filters Section */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-background pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:gap-3 gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">Type: All</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">Status: All</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">All Depts</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">All Topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {isLoading
              ? "Searching..."
              : `${workshops.length} activities found`}
          </span>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary/60 mb-4" />
          <p className="text-muted-foreground animate-pulse">
            Fetching sessions...
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">
            Failed to load workshops. Please check your connection.
          </p>
        </div>
      ) : workshops.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card p-20 text-center shadow-sm">
          <p className="text-muted-foreground text-lg italic">
            No sessions found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setDeptFilter("all");
              setTopicFilter("all");
              setAudienceFilter("all");
            }}
            className="mt-4 text-primary font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((w) => (
            <WorkshopCard key={w._id} workshop={w} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkshopsPage;
