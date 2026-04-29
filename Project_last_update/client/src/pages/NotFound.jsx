import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth"; // لاستخدام حالة المستخدم في التوجيه
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // تسجيل الخطأ للمطورين في الكونسول
    console.error(
      "404 Error: Path",
      location.pathname,
      "does not exist. User status:",
      user ? "Logged In" : "Guest",
    );
  }, [location.pathname, user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* عنصر بصري (Icon) */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl"></div>
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/20 bg-card shadow-glow">
          <AlertTriangle className="h-12 w-12 text-primary" />
        </div>
      </div>

      {/* نصوص الخطأ */}
      <h1 className="font-display text-7xl font-bold tracking-tighter text-foreground md:text-9xl">
        404
      </h1>
      <div className="mb-8 mt-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Lost in the Latent Space?
        </h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          The page you are looking for at{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-primary text-sm font-mono">
            {location.pathname}
          </code>
          doesn't exist or has been moved within our neural network.
        </p>
      </div>

      {/* أزرار التنقل */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" className="gap-2 px-8 py-6 text-lg">
          <Link to={user ? "/dashboard" : "/"}>
            <Home className="h-5 w-5" />
            {user ? "Back to Dashboard" : "Return to Home"}
          </Link>
        </Button>

        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="gap-2 px-8 py-6 text-lg border-primary/20 hover:bg-primary/5"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </Button>
      </div>

      {/* تذييل الصفحة البسيط */}
      <p className="mt-16 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
        AI House · University of Blida 1
      </p>
    </div>
  );
};

export default NotFound;
