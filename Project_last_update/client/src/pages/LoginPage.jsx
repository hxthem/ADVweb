import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, LogIn, Mail, Lock, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showAdmin, setShowAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res.ok) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error(res.error || "Login failed. Check your credentials.");
      }
    } catch (err) {
      toast.error("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg py-16">
      <Card className="p-8 shadow-card-hover border-border/60 relative overflow-hidden bg-card">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
            <LogIn className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Member Portal</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to access your AI House dashboard and resources.
          </p>
        </div>

        {/* ── Main Login Form ── */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider opacity-70">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@univ-blida.dz"
                className="bg-muted/20 pl-10 h-12"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider opacity-70">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-muted/20 pl-10 h-12"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-sm font-bold shadow-glow mt-2"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        {/* ── Divider ── */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-card px-3 text-muted-foreground tracking-[0.2em] font-bold">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {/* ── Social Login Section ── */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <a
            href="http://localhost:5000/api/auth/google"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-muted/60"
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Google
          </a>
          <a
            href="http://localhost:5000/api/auth/facebook"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-muted/60"
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#1877F2" d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.626 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24z"/>
              <path fill="#fff" d="M33.342 30.938L34.406 24H27.75v-4.5c0-1.9.93-3.75 3.911-3.75h3.026V9.844s-2.746-.469-5.372-.469c-5.482 0-9.065 3.323-9.065 9.337V24h-6.094v6.938h6.094v16.77a24.2 24.2 0 0 0 7.5 0v-16.77h5.592z"/>
            </svg>
            Facebook
          </a>
        </div>

        {/* ── Signup Redirect ── */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between group">
          <div className="text-left">
            <p className="text-xs font-bold text-foreground">New to AI House?</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Start identity verification</p>
          </div>
          <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all" asChild>
            <Link to="/signup">
              Sign Up <ArrowRight className="h-3 w-3 ml-2" />
            </Link>
          </Button>
        </div>

        {/* ── Internal Admin Portal ── */}
        <div className="mt-12 pt-6 border-t border-dashed border-border/60">
           {!showAdmin ? (
             <button 
              onClick={() => setShowAdmin(true)}
              className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest hover:text-primary transition-colors block mx-auto"
             >
               Internal Admin Portal
             </button>
           ) : (
             <form onSubmit={onSubmit} className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="h-3 w-3 text-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Admin Root Access</span>
               </div>
               <Input 
                type="email" 
                placeholder="Admin Email" 
                className="h-9 text-xs" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
               />
               <Input 
                type="password" 
                placeholder="Password" 
                className="h-9 text-xs" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
               />
               <Button type="submit" size="sm" className="w-full h-9 text-xs font-bold" disabled={loading}>
                 {loading ? "Verifying..." : "Access Root"}
               </Button>
               <button 
                type="button"
                onClick={() => setShowAdmin(false)}
                className="text-[9px] text-muted-foreground hover:underline block mx-auto pt-2"
               >
                 Close Portal
               </button>
             </form>
           )}
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
