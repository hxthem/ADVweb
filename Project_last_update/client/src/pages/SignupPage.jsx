import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, UserPlus } from "lucide-react";

const SignupPage = () => {
  return (
    <div className="container max-w-lg py-16">
      <Card className="p-8 shadow-card-hover border-border/60 relative overflow-hidden bg-card">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 border border-accent/20">
            <UserPlus className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Verified Institutional Access</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm">
            To ensure secure access to AI House assets, all members must verify their identity via institutional providers.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          <Button 
            className="w-full h-14 bg-card hover:bg-muted/50 border-border/60 text-foreground flex items-center justify-between px-6 group transition-all"
            variant="outline"
            asChild
          >
            <a href="http://localhost:5000/api/auth/google">
              <div className="flex items-center gap-4">
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <div className="text-left">
                  <p className="text-sm font-bold">Continue with Google</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Institutional Account</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>

          <Button 
            className="w-full h-14 bg-card hover:bg-muted/50 border-border/60 text-foreground flex items-center justify-between px-6 group transition-all"
            variant="outline"
            asChild
          >
            <a href="http://localhost:5000/api/auth/facebook">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-[#1877F2] shadow-sm flex items-center justify-center">
                   <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#fff" d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.626 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Continue with Facebook</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Social Verification</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Registration Roadmap</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Instantly verify your institutional status via your secure social provider.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Complete your research profile by selecting your role and department.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-border/60 pt-6">
          <p className="text-sm text-muted-foreground">
            Already have a verified account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Portal Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;