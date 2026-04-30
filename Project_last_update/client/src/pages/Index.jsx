import { useRef, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Brain,
  Activity,
  Clock,
  ExternalLink,
} from "lucide-react";
import heroImage from "@/assets/landing-hero.jpg";
// لم نعد بحاجة لـ { workshops } من الـ mockData لأننا سنجلبها من السيرفر
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar_chbab";
import { partners } from "@/data/mockData";

const Index = () => {
  const { user } = useAuth();
  const cardRef = useRef(null);

  // --- حالات جلب البيانات (States) ---
  const [data, setData] = useState({ stats: null, upcomingWorkshops: [] });
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- جلب البيانات من الباكاند عند تحميل الصفحة ---
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/home/landing-data");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.warn("Home data response not OK");
        }
        
        if (user?._id) {
          const resMy = await fetch(`http://localhost:5000/api/workshops?participant=${user._id}`);
          if (resMy.ok) {
            const myData = await resMy.json();
            setMyEvents(myData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch landing data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, [user]);

  // التحقق من التوجيه إذا كان المستخدم مسجل دخول
  // removed redirect to allow personalized landing page
  // if (user) return <Navigate to="/dashboard" replace />;

  // واجهة بسيطة أثناء التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary font-bold">
        <div className="animate-pulse">Loading AI House Assets...</div>
      </div>
    );
  }

  // معالجة البيانات القادمة من الباكاند لاستخدامها في التصميم
  const upcoming = data.upcomingWorkshops || [];
  const featured = upcoming[0];
  const secondary = upcoming.slice(1, 3);
  const statsData = data.stats;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (cardRef.current) {
      cardRef.current.style.left = `${x - 115}px`;
      cardRef.current.style.top = `${y - 40}px`;
      cardRef.current.style.bottom = "auto";
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.left = "";
      cardRef.current.style.top = "";
      cardRef.current.style.bottom = "";
    }
  };

  const formatDay = (date) =>
    new Date(date)
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section id="about" className="container pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-primary mb-7">
              <Sparkles className="h-3 w-3" />
              University of Blida 1
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
              AI House: The <span className="text-primary">Future</span> of
              Scholarly Intelligence.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              A dedicated research hub at the Faculty of Science, driving
              innovation through collaborative artificial intelligence and
              state-of-the-art computational frameworks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/workshops"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:bg-primary/90 hover:scale-[1.02]"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/representatives"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                Research Directory
              </Link>
            </div>
          </div>

          {/* Hero visual with mouse effect */}
          <div
            className="relative pb-8 "
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-card-hover">
              <img
                src={heroImage}
                alt="Neural network visualization"
                className="w-full h-full object-cover"
                width={1024}
                height={1024}
              />
            </div>
            <div
              ref={cardRef}
              style={{ transition: "left 0.1s ease-out, top 0.1s ease-out" }}
              className="absolute -bottom-6 -left-4 md:-left-8 rounded-2xl bg-card border border-border/60 shadow-card-hover p-4 max-w-[230px] pointer-events-none"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-primary uppercase mb-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Live Status
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug">
                {statsData?.representativesCount || 0} Active Researchers
                <br />
                Processing Ethics AI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section id="research" className="bg-muted/40 border-y border-border/60">
        <div className="container py-14">
          {user && myEvents.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-success" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Your Joined Events</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myEvents.map((event) => (
                  <Link
                    key={event._id}
                    to={`/sessions/${event._id}`}
                    className="group rounded-2xl bg-card border border-border/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-4">
                      {event.venue}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                       <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                        View Details
                      </span>
                      <ArrowRight className="h-3 w-3 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                value: `${statsData?.workshopsCount || 0}+`,
                label: "Workshops Hosted",
                desc: "Regular specialized training sessions covering Generative AI and Deep Learning architectures.",
              },
              {
                value: statsData?.departmentsCount || "12",
                label: "Departments Involved",
                desc: "Interdisciplinary collaboration spanning Computer Science, Mathematics, and Bio-Engineering.",
              },
              {
                value: statsData?.representativesCount || "0",
                label: "Representatives",
                desc: "Dedicated faculty members and research leads driving the digital transformation agenda.",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-card border border-border/60 p-7 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="font-display text-5xl font-bold text-foreground tracking-tight mb-2">
                  {s.value}
                </div>
                <div className="text-[11px] font-bold tracking-widest text-primary uppercase mb-3">
                  {s.label}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming workshops Section */}
      <section id="events" className="container py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
              Upcoming Workshops
            </h2>
            <p className="text-muted-foreground">
              Join our upcoming collaborative sessions led by industry experts.
            </p>
          </div>
          <Link
            to="/workshops"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition"
          >
            View All Calendar
            <Calendar className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Featured Large Card */}
          {featured ? (
            <Link
              to={`/sessions/${featured._id || featured.id}`}
              className="group relative overflow-hidden rounded-3xl gradient-navy text-navy-foreground p-8 min-h-[440px] flex flex-col justify-between shadow-card-hover hover:scale-[1.005] transition-transform"
            >
              <div className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/40 blur-[80px]" />
                <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/30 blur-[60px]" />
              </div>
              <div className="relative">
                <span className="inline-flex items-center rounded-full bg-success/20 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-success">
                  Featured Series
                </span>
              </div>
              <div className="relative">
                <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3">
                  {featured.title}
                </h3>
                <p className="text-sm text-navy-foreground/70 leading-relaxed mb-6 max-w-md line-clamp-2">
                  {featured.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-navy-foreground/80">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDay(featured.date)} · {featured.time}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-card text-foreground px-4 py-2 text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Register Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed rounded-3xl p-12 text-muted-foreground">
              No featured workshops available.
            </div>
          )}

          {/* Secondary stack */}
          <div className="grid gap-5">
            {secondary[0] && (
              <Link
                to={`/sessions/${secondary[0]._id || secondary[0].id}`}
                className="group rounded-2xl bg-card border border-border/60 shadow-card hover:shadow-card-hover transition-all p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Brain className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    {formatDay(secondary[0].date)}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {secondary[0].title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-5">
                  {secondary[0].description}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">
                    Limited Seats Available
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            )}

            <div className="grid grid-cols-2 gap-5">
              {secondary.slice(1, 3).map((w, i) => (
                <Link
                  key={w._id || w.id}
                  to={`/sessions/${w._id || w.id}`}
                  className="group rounded-2xl bg-muted/40 border border-border/60 p-5 hover:bg-card hover:shadow-card transition-all flex flex-col aspect-[4/5]"
                >
                  <div className="flex-1 rounded-xl bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 mb-4 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-primary/40" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-foreground mb-1 line-clamp-1">
                    {w.title}
                  </h4>
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    {formatDay(w.date)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="bg-muted/20 border-t border-border/40 py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold text-foreground tracking-tight mb-2">
              Our Strategic Partners
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Collaborating with industry leaders and academic clubs to bring state-of-the-art AI research and training to University Blida 1.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {partners.filter(p => p.logo).map((partner) => (
              <div 
                key={partner.id} 
                className="h-20 w-32 md:h-24 md:w-40 bg-white rounded-2xl shadow-sm border border-border/40 flex items-center justify-center p-4 md:p-6 grayscale hover:grayscale-0 transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 group"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110" 
                  title={partner.name}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="directory" className="border-t border-border/60 bg-muted/30">
        <div className="container py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-display font-bold text-foreground">
              AI House
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              © 2026 University of Blida 1 · Scholarly Intelligence Framework
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-foreground transition">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-foreground transition">
              Contact
            </Link>
            <Link to="/" className="hover:text-foreground transition">
              Ethics AI
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
