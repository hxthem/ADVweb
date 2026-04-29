import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  FileText,
  Video,
  Code2,
  Database,
  Presentation,
  Calendar,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

// أيقونات الموارد بناءً على النوع
const resourceIcon = (type) => {
  const icons = {
    pdf: FileText,
    slides: Presentation,
    video: Video,
    code: Code2,
    dataset: Database,
  };
  return icons[type] || FileText;
};

const typeBadge = {
  pdf: "bg-primary/10 text-primary",
  slides: "bg-accent/10 text-accent",
  video: "bg-warning/10 text-warning",
  code: "bg-success/10 text-success",
  dataset: "bg-muted text-muted-foreground",
};

const ResourceDetailsPage = () => {
  const { id } = useParams();

  // جلب بيانات الورشة والموارد من الباكاند
  const {
    data: workshop,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["workshop-resources", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/workshops/${id}`);
      if (!res.ok) throw new Error("Resource set not found");
      return res.json();
    },
  });

  // حالة التحميل (Spinner)
  if (isLoading)
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          جاري تحضير الملفات والمصادر...
        </p>
      </div>
    );

  // حالة الخطأ أو عدم وجود بيانات
  if (error || !workshop)
    return (
      <div className="container py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">
          عذراً، لم يتم العثور على هذه المصادر.
        </p>
        <Link
          to="/resources"
          className="text-primary font-medium hover:underline inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to resource library
        </Link>
      </div>
    );

  // معالجة الموارد (تأكد أن الباكاند يرسلها كمصفوفة resources)
  const resources = workshop.resources || [];

  return (
    <div className="container py-12 max-w-5xl">
      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to resource library
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-card mb-6">
        <div className="h-1.5 w-full gradient-primary" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wide text-primary">
              {workshop.department}
            </span>
            <span>•</span>
            <span>{workshop.topic}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            {workshop.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {workshop.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(workshop.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>
              by{" "}
              <span className="font-medium text-foreground">
                {workshop.instructor}
              </span>
            </span>
            <Link
              to={`/sessions/${workshop._id}`}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
            >
              View session details
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Resources list */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {resources.length} resource{resources.length === 1 ? "" : "s"}{" "}
          available
        </h2>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <p className="text-muted-foreground">
            No downloadable materials are available for this session.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {resources.map((r, index) => {
            const Icon = resourceIcon(r.type);
            return (
              <div
                key={r._id || index}
                className="group rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeBadge[r.type]}`}
                      >
                        {r.type}
                      </span>
                      {r.size && (
                        <span className="text-[11px] text-muted-foreground">
                          {r.size}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-foreground text-sm leading-snug truncate">
                      {r.title}
                    </h3>
                    {r.description && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* رابط التحميل - يعمل مع الروابط الخارجية أو الملفات المرفوعة */}
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl gradient-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download / Access
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResourceDetailsPage;
