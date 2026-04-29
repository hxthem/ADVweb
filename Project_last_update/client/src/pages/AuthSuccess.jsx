import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";

// ✅ FIX: Uses loginWithToken() from AuthContext to properly sync state.
// ✅ FIX: No window.location.reload() — React state updates handle navigation.
// ✅ FIX: Token is NOT stored directly here; loginWithToken handles "aih_token" storage.
const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // loginWithToken: saves to "aih_token", calls /api/auth/me, and sets user state
      loginWithToken(token).then(() => {
        navigate("/dashboard", { replace: true });
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>جاري تسجيل الدخول، يرجى الانتظار...</p>
    </div>
  );
};

export default AuthSuccess;
