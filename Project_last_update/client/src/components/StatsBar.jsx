import { departments } from "@/data/mockData";
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";

const StatsBar = () => {
  const totalWorkshops = departments.reduce((s, d) => s + d.workshopCount, 0);
  const totalReps = departments.reduce((s, d) => s + d.representativeCount, 0);
  const totalParticipants = departments.reduce((s, d) => s + d.participantCount, 0);

  const stats = [
    { label: "Workshops Held", value: totalWorkshops, icon: BookOpen, accent: "bg-primary/10 text-primary" },
    { label: "Active Departments", value: departments.length, icon: GraduationCap, accent: "bg-accent/10 text-accent" },
    { label: "Representatives", value: totalReps, icon: Users, accent: "bg-success/10 text-success" },
    { label: "Trained Participants", value: totalParticipants, icon: TrendingUp, accent: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.accent} mb-3`}>
            <stat.icon className="h-4 w-4" />
          </div>
          <div className="font-display text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
          <div className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
