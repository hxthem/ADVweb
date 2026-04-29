import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { workshops, representatives, departments } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TrainingHeatmap from "@/components/TrainingHeatmap";
import { BadgeCheck, BookOpen, Building2, Check, GraduationCap, ShieldCheck, UserCog, Users, X } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { users, approveRep, rejectRep, refresh } = useAuth();

  useEffect(() => {
    refresh();
  }, []);

  const pendingReps = (users || []).filter((u) => u.repStatus === "pending");
  const approvedReps = (users || []).filter((u) => u.role === "representative" || u.role === "admin");
  const studentUsers = (users || []).filter((u) => u.role === "student" && u.repStatus !== "pending");

  const totalWorkshops = workshops.length;
  const totalUpcoming = workshops.filter((w) => w.status === "upcoming").length;
  const totalParticipants = workshops.reduce((s, w) => s + w.enrolled, 0);

  return (
    <div className="space-y-10">
      <header>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Admin dashboard</p>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Platform overview</h1>
        <p className="text-muted-foreground mt-1">Monitor activity, manage representatives and review applications.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile icon={BookOpen} label="Total sessions" value={totalWorkshops} accent="bg-primary/10 text-primary" />
        <StatTile icon={GraduationCap} label="Upcoming" value={totalUpcoming} accent="bg-accent/10 text-accent" />
        <StatTile icon={Users} label="Trained participants" value={totalParticipants} accent="bg-success/10 text-success" />
        <StatTile icon={Building2} label="Departments" value={departments.length} accent="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserStatTile icon={UserCog} label="Active representatives" value={approvedReps.length + representatives.filter((r) => r.validated).length} hint="Including seeded faculty" />
        <UserStatTile icon={GraduationCap} label="Registered students" value={studentUsers.length} hint="Sign-ups via the app" />
        <UserStatTile icon={BadgeCheck} label="Pending applications" value={pendingReps.length} hint="Awaiting your review" highlight={pendingReps.length > 0} />
      </div>

      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold">Representative applications</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Approve or reject pending requests.</p>
        </div>
        <Card className="overflow-hidden">
          {pendingReps.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No pending applications right now.</div>
          ) : (
            <div className="divide-y divide-border">
              {pendingReps.map((u) => (
                <div key={u._id} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{u.fullName}</div>
                    <div className="text-sm text-muted-foreground">{u.email}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {u.department} · {u.aiFocus}
                    </div>
                    {u.bio && <p className="text-sm mt-2 text-foreground/80">{u.bio}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        approveRep(u._id);
                        toast.success(`${u.fullName} approved as representative`);
                      }}
                    >
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        rejectRep(u._id);
                        toast.message(`${u.fullName} rejected`);
                      }}
                    >
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold">Training activity by department</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Where AI literacy is growing fastest.</p>
        </div>
        <TrainingHeatmap />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold">Registered users</h2>
          <p className="text-sm text-muted-foreground mt-0.5">All accounts created on the platform.</p>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Name</th>
                  <th className="text-left font-medium px-4 py-3">Email</th>
                  <th className="text-left font-medium px-4 py-3">Role</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-3 font-medium">{u.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <RoleBadge status={u.repStatus} role={u.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
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

const UserStatTile = ({
  icon: Icon,
  label,
  value,
  hint,
  highlight,
}) => (
  <Card className={`p-5 ${highlight ? "border-warning/50 bg-warning/5" : ""}`}>
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
        <div className="font-display text-3xl font-bold mt-2">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{hint}</div>
      </div>
      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
    </div>
  </Card>
);

const RoleBadge = ({ status, role }) => {
  if (role === "admin")
    return <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5 font-medium">Admin</span>;
  if (status === "pending")
    return <span className="inline-flex items-center rounded-full bg-warning/15 text-warning text-xs px-2 py-0.5 font-medium">Pending</span>;
  if (status === "rejected")
    return <span className="inline-flex items-center rounded-full bg-destructive/10 text-destructive text-xs px-2 py-0.5 font-medium">Rejected</span>;
  if (status === "approved")
    return <span className="inline-flex items-center rounded-full bg-success/10 text-success text-xs px-2 py-0.5 font-medium">Approved</span>;
  return <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground text-xs px-2 py-0.5 font-medium">Student</span>;
};

export default AdminDashboard;
