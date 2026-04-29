import { Calendar, MapPin, Users, Clock, Monitor, Download, Tag, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const typeColors = {
  technical: "bg-primary/10 text-primary",
  research: "bg-accent/10 text-accent",
  ethics: "bg-warning/10 text-warning",
  industry: "bg-success/10 text-success",
};

const audienceLabels = {
  representatives: "Dept. Representatives",
  students: "Students",
  public: "General Public",
};

const WorkshopCard = ({ workshop }) => {
  const isPast = new Date(workshop.date) < new Date();
  const fillPercent = Math.round(((workshop.enrolledCount || 0) / (workshop.maxParticipants || 50)) * 100);

  return (
    <Link
      to={`/sessions/${workshop._id}`}
      className="group relative block rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5"
    >
      {/* Workshop Image / Gradient */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {workshop.coverImage ? (
          <img
            src={`http://localhost:5000${workshop.coverImage}`}
            alt={workshop.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full gradient-primary opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Subtle top divider */}
      <div className="h-1 w-full gradient-primary opacity-60" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${typeColors[workshop.category] || "bg-muted"}`}>
              {workshop.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
              <Tag className="h-3 w-3" />
              {workshop.topic || "General"}
            </span>
          </div>
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
              isPast
                ? "bg-muted text-muted-foreground"
                : "bg-success/10 text-success"
            }`}
          >
            {isPast ? "Completed" : "Upcoming"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-semibold text-foreground mb-1.5 leading-snug group-hover:text-primary transition-colors">
          {workshop.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {workshop.description}
        </p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { icon: Calendar, text: new Date(workshop.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), color: "text-primary" },
            { icon: Clock, text: workshop.time, color: "text-primary" },
            { icon: workshop.venue === "Online" ? Monitor : MapPin, text: workshop.venue, color: "text-accent" },
            { icon: Users, text: workshop.audience, color: "text-muted-foreground" },
          ].map((meta, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <meta.icon className={`h-3.5 w-3.5 ${meta.color} shrink-0`} />
              <span className="truncate">{meta.text}</span>
            </span>
          ))}
        </div>

        {/* Enrollment */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground font-medium">Enrollment</span>
            <span className="font-semibold text-foreground">{workshop.enrolledCount || 0}/{workshop.maxParticipants || 50}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full gradient-primary transition-all duration-500"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            by <span className="font-medium text-foreground">{workshop.creator?.fullName || "Representative"}</span>
          </span>
          {isPast && workshop.resources?.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors">
              <Download className="h-3.5 w-3.5" />
              Resources
            </span>
          )}
          {!isPast && (
            <span className="flex items-center gap-1 rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow transition-all group-hover:scale-105">
              View details
              <ArrowUpRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default WorkshopCard;
