import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Users,
  Tag,
  CheckCircle2,
  ListChecks,
  GraduationCap,
  ArrowUpRight,
  Download,
  FileText,
  Video,
  Code2,
  Database,
  Presentation,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/lib/auth";

const typeColors = {
  technical: "bg-primary/10 text-primary",
  research: "bg-accent/10 text-accent",
  ethics: "bg-warning/10 text-warning",
  industry: "bg-success/10 text-success",
};

const resourceIcon = (type) => {
  const icons = {
    pdf: FileText,
    slides: Presentation,
    video: Video,
    code: Code2,
    dataset: Database,
  };
  const Icon = icons[type] || FileText;
  return <Icon className="h-4 w-4 text-primary" />;
};

const SessionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  // 1. جلب بيانات الورشة من الباكاند
  const {
    data: workshop,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["workshop", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/workshops/${id}`);
      return res.data;
    },
  });

  // 2. منطق التسجيل (Enrollment)
  const enrollmentMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("aih_token");
      const res = await axios.post(
        `http://localhost:5000/api/workshops/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["workshop", id]);
      if (data.updatedUser) {
        setUser(data.updatedUser);
      }
    },
    onError: (err) => {
      alert(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
    },
  });

  if (isLoading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">
          Loading session details...
        </p>
      </div>
    );

  if (error || !workshop)
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
        <Link to="/workshops" className="text-primary hover:underline">
          Return to workshops
        </Link>
      </div>
    );

  const isPast = new Date(workshop.date) < new Date();
  const isEnrolled = workshop.participants?.some(p => (p._id || p) === user?._id);
  const fillPercent = Math.min(
    100,
    Math.round(
      (workshop.enrolledCount / (workshop.maxParticipants || 50)) * 100,
    ),
  );

  const handleRegister = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    enrollmentMutation.mutate();
  };

  return (
    <div className="container py-12 max-w-6xl">
      <Link
        to="/workshops"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all sessions
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-card">
            {/* Cover Image */}
            {workshop.coverImage && (
              <div className="aspect-video w-full overflow-hidden border-b border-border/60">
                <img
                  src={`http://localhost:5000${workshop.coverImage}`}
                  alt={workshop.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="h-1.5 w-full gradient-primary" />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${typeColors[workshop.category]}`}
                >
                  {workshop.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                  <Tag className="h-3 w-3" />
                  {workshop.topic || "General"}
                </span>
                <span
                  className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold ${isPast ? "bg-muted text-muted-foreground" : "bg-success/10 text-success"}`}
                >
                  {isPast ? "Completed" : "Upcoming"}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
                {workshop.title}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                {workshop.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-border/60">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground font-semibold">
                      Date
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {new Date(workshop.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground font-semibold">
                      Time
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {workshop.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 shrink-0">
                    {workshop.venue === "Online" ? (
                      <Monitor className="h-4 w-4 text-accent" />
                    ) : (
                      <MapPin className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground font-semibold">
                      Location
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {workshop.venue}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted shrink-0">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground font-semibold">
                      Target
                    </div>
                    <div className="text-sm font-medium text-foreground capitalize">
                      {workshop.audience}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-success" />
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Session Materials
                </h2>
              </div>
              {workshop.resources?.length > 0 && (
                <Link
                  to={`/resources/${workshop._id}`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Full Library <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {workshop.resources?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {workshop.resources.map((r, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-border/60 p-3 hover:border-primary/40 hover:bg-muted/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        {resourceIcon(r.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate">
                          {r.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 uppercase font-bold">
                          {r.type} • {r.size || "MB"}
                        </div>
                      </div>
                      <a
                        href={r.url}
                        download
                        className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed rounded-xl text-sm text-muted-foreground">
                {isPast
                  ? "No materials uploaded yet."
                  : "Materials will be available after the session."}
              </div>
            )}
          </div>
        </div>

        {/* الجانب الجانبي (Side Column) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card sticky top-24">
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground font-medium">
                  Capacity
                </span>
                <span className="font-semibold text-foreground">
                  {workshop.enrolledCount}/{workshop.maxParticipants || 50}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-primary transition-all duration-500"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>

            {!isPast ? (
              <button
                onClick={handleRegister}
                disabled={enrollmentMutation.isPending}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isEnrolled
                    ? "bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/20"
                    : "gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02]"
                }`}
              >
                {enrollmentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEnrolled ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Joined (Unregister)
                  </>
                ) : (
                  <>
                    Join this session
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            ) : (
              <div className="w-full text-center py-3 px-4 rounded-xl bg-muted text-muted-foreground text-sm font-medium border border-border/40">
                This event has concluded
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dept.</span>
                <span className="font-medium text-foreground">
                  {workshop.department || "CS"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Univ.</span>
                <span className="font-medium text-foreground">USDB 1</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-accent" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Instructor
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                {workshop.creator?.fullName?.substring(0, 2).toUpperCase() || "RE"}
              </div>
              <div>
                <div className="text-sm font-bold">
                  {workshop.creator?.fullName || "Representative"}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">
                  {workshop.creator?.role || "Dept. Rep"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsPage;
