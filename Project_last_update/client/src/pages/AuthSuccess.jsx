import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      loginWithToken(token).then((userData) => {
        if (userData && userData.isProfileComplete === false) {
          navigate("/complete-profile", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="relative flex items-center justify-center">
        <div className="h-20 w-20 rounded-full border-4 border-primary/20 animate-pulse" />
        <Loader2 className="h-10 w-10 text-primary animate-spin absolute" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">Verifying Identity</h2>
        <p className="text-sm text-muted-foreground mt-1">Please wait while we sync your secure session...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
