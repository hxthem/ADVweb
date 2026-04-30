import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  FileText,
  Calendar,
  BookOpen,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { workshops as mockWorkshops } from "@/data/mockData";

const ResourcesPage = () => {
  // جلب البيانات من الباكاند
  const { data: workshops, isLoading } = useQuery({
    queryKey: ["all-resources"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/workshops");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  // فلترة الورشات التي انتهت وتملك موارد
  const today = new Date();
    ) || [];
    
  const displayWorkshops = pastWithResources.length > 0 ? pastWithResources : mockWorkshops.filter(w => w.status === "past" && w.resources?.length > 0);

  if (isLoading)
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-success" />
      </div>
    );

  return (
    <div className="container py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
          <BookOpen className="h-5 w-5 text-success" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Resource Library
        </h1>
      </div>
      <p className="text-muted-foreground mb-8 ml-[52px]">
        Materials from past events are automatically available here once the
        session date has passed.
      </p>

      {displayWorkshops.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-16 text-center shadow-card">
          <p className="text-muted-foreground">
            No resources available yet. Check back after upcoming events!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayWorkshops.map((w) => {
            const count = w.resources?.length || 0;
            return (
              <Link
                key={w._id || w.id}
                to={`/resources/${w._id || w.id}`}
                className="group block rounded-[2rem] border border-border/40 bg-card overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/20"
              >
                <div className="h-1.5 w-full gradient-primary opacity-30 group-hover:opacity-100 transition-opacity" />
                <div className="p-7">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-foreground text-base leading-tight truncate group-hover:text-primary transition-colors">
                        {w.title}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        {w.department}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                    {w.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary/60" />
                      {new Date(w.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-2 rounded-xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground px-4 py-2 text-xs font-bold transition-all">
                      <Download className="h-4 w-4" />
                      {count} file{count === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
