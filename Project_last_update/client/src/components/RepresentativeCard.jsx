import { CheckCircle, XCircle, BookOpen } from "lucide-react";

const focusColors = {
  "Python for Research": "bg-success/10 text-success",
  "Data Science": "bg-primary/10 text-primary",
  "Automation": "bg-accent/10 text-accent",
  "AI Pedagogy": "bg-warning/10 text-warning",
};

const RepresentativeCard = ({ rep }) => {
  const initials = rep.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="group rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-navy text-navy-foreground font-display font-bold text-sm shadow-card">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-display font-semibold text-foreground truncate text-[15px]">
                {rep.fullName}
              </h3>
              {rep.validated ? (
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">{rep.title}</p>

            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground">
                {rep.department}
              </span>
              <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold ${focusColors[rep.aiFocus] || "bg-muted text-muted-foreground"}`}>
                {rep.aiFocus}
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {rep.bio}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-medium">{rep.workshopsLed}</span> workshops led
              </div>
              <span
                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                  rep.validated
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {rep.validated ? "✓ Validated" : "In Training"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentativeCard;
