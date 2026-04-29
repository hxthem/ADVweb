import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import RepresentativeDashboard from "@/components/dashboards/RepresentativeDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container py-8 md:py-12">
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "representative" && <RepresentativeDashboard />}
      {user.role === "student" && <StudentDashboard />}
    </div>
  );
};

export default DashboardPage;
