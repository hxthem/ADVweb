import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // جعل الدالة async للتعامل مع طلب الـ API
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ننتظر نتيجة عملية تسجيل الدخول من الـ Auth Context
      const res = await login(email.trim(), password);

      if (res.ok) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        // عرض الخطأ القادم من السيرفر (مثلاً: كلمة مرور خاطئة)
        toast.error(
          res.error || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      // في حال وجود مشكلة في الاتصال بالسيرفر
      toast.error("Server is unreachable. Please try again later.");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-16">
      <Card className="p-8 shadow-card-hover border-border/60">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-primary shadow-glow flex items-center justify-center mb-3">
            <LogIn className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access your AI House dashboard
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">University Email</Label>
            <Input
              id="email"
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@univ-blida.dz"
              className="bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="text-[10px] text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-muted/30"
            />
          </div>
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Authenticating...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* ── OAuth Divider ── */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground tracking-wider">
              or continue with
            </span>
          </div>
        </div>

        {/* ── Google & Facebook Buttons ── */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="http://localhost:5000/api/auth/google?role=student"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Google
          </a>
          <a
            href="http://localhost:5000/api/auth/facebook?role=student"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#1877F2" d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.626 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24z"/>
              <path fill="#fff" d="M33.342 30.938L34.406 24H27.75v-4.5c0-1.9.93-3.75 3.911-3.75h3.026V9.844s-2.746-.469-5.372-.469c-5.482 0-9.065 3.323-9.065 9.337V24h-6.094v6.938h6.094v16.77a24.2 24.2 0 0 0 7.5 0v-16.77h5.592z"/>
            </svg>
            Facebook
          </a>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-6">
          No account yet?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Request Access
          </Link>
        </p>

        {/* تنبيه تجريبي - يمكنك حذفه لاحقاً */}
        <div className="mt-6 rounded-lg bg-muted/60 p-3 text-[10px] text-muted-foreground border border-border/40">
          <p className="font-bold text-foreground mb-1 uppercase tracking-widest">
            Development Access
          </p>
          <p>Admin: admin@univ-blida.dz / admin123</p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
