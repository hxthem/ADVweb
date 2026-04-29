import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, Calendar, Users, BookOpen, Handshake, Menu, X, LogOut, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const appNavItems = [
  { to: "/dashboard", label: "Home", icon: Brain },
  { to: "/workshops", label: "Events", icon: Calendar },
  { to: "/representatives", label: "Network", icon: Users },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/partners", label: "Partners", icon: Handshake },
];

const landingSections = [
  { id: "research", label: "Research" },
  { id: "events", label: "Events" },
  { id: "directory", label: "Directory" },
  { id: "about", label: "About" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleLabel = user?.role === "admin" ? "Admin" : user?.role === "representative" ? "Representative" : "Student";
  const isLanding = location.pathname === "/" && !user;

  const scrollToSection = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border/50 shadow-card"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow transition-transform group-hover:scale-110">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-foreground leading-tight">
              AI House
            </span>
            <span className="text-[10px] font-medium text-muted-foreground leading-none tracking-wider uppercase">
              Blida 1
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        {isLanding ? (
          <div className="hidden md:flex items-center gap-1">
            {landingSections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-0.5 rounded-xl bg-muted/60 p-1">
            {appNavItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-card text-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-2.5 py-1.5">
                <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                  {user.fullName.charAt(0)}
                </div>
                <div className="hidden lg:block leading-tight">
                  <div className="text-xs font-semibold">{user.fullName.split(" ")[0]}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{roleLabel}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">{isLanding ? "Portal Login" : "Sign up"}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border/50 p-3 space-y-0.5">
          {isLanding
            ? landingSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="w-full text-left flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {s.label}
                </button>
              ))
            : appNavItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
          <div className="border-t border-border/50 mt-2 pt-2 space-y-0.5">
            {user ? (
              <>
                <div className="px-4 py-2 text-xs text-muted-foreground">
                  Signed in as <span className="font-semibold text-foreground">{user.fullName}</span> ({roleLabel})
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;