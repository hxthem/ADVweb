import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import WorkshopCard from "@/components/WorkshopCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Calendar, GraduationCap, Plus, Sparkles, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const RepresentativeDashboard = () => {
  const { user } = useAuth();
  const [myWorkshops, setMyWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyWorkshops = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(`http://localhost:5000/api/workshops?creator=${user._id}`);
        setMyWorkshops(data);
      } catch (err) {
        console.error("Failed to fetch workshops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyWorkshops();
  }, [user]);

  if (!user) return null;

  const upcoming = myWorkshops.filter((w) => w.status === "published" || w.status === "upcoming");
  const drafts = myWorkshops.filter((w) => w.status === "draft");
  const totalParticipants = myWorkshops.reduce((s, w) => s + (w.enrolledCount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-accent uppercase tracking-wider">Representative dashboard</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
              <BadgeCheck className="h-3.5 w-3.5" /> Approved
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Welcome, {user.fullName.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-1">
            {user.department} · {user.aiFocus}
          </p>
        </div>
        <Button asChild>
          <Link to="/workshops/new">
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile icon={Calendar} label="Active" value={upcoming.length} accent="bg-primary/10 text-primary" />
        <StatTile icon={GraduationCap} label="Drafts" value={drafts.length} accent="bg-warning/10 text-warning" />
        <StatTile icon={Users} label="Participants" value={totalParticipants} accent="bg-accent/10 text-accent" />
        <StatTile icon={BadgeCheck} label="Total created" value={myWorkshops.length} accent="bg-success/10 text-success" />
      </div>

      <Section title="Active Events" subtitle="Sessions currently visible to students">
        {upcoming.length === 0 ? (
          <EmptyState message="You have no active events. Create or publish one!" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcoming.map((w) => (
              <WorkshopCard key={w._id} workshop={w} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Your Drafts" subtitle="Events you're still working on">
        {drafts.length === 0 ? (
          <EmptyState message="No drafts currently." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {drafts.map((w) => (
              <WorkshopCard key={w._id} workshop={w} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

const StatTile = ({
  icon: Icon,
  label,
  value,
  accent,
}) => (
  <Card className="p-5">
    <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent} mb-3`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="font-display text-3xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground mt-1 font-medium">{label}</div>
  </Card>
);

const Section = ({
  title,
  subtitle,
  children,
}) => (
  <section>
    <div className="mb-4">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const EmptyState = ({ message }) => (
  <Card className="p-10 text-center border-dashed">
    <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
    <p className="text-muted-foreground text-sm">{message}</p>
  </Card>
);

export default RepresentativeDashboard;
