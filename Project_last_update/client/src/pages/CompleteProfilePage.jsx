import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { UserCircle2, GraduationCap, Building2, User } from "lucide-react";

const departments = [
  "Computer Science",
  "Mathematics",
  "Bio-Engineering",
  "Physics",
  "Chemistry",
  "Electronics",
  "Other",
];

const CompleteProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill name from social login
  useEffect(() => {
    if (user?.fullName && !fullName) {
      setFullName(user.fullName);
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!department) {
      toast.error("Please select your department");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/complete-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aih_token")}`,
        },
        body: JSON.stringify({ fullName, role, department }),
      });

      const updatedUser = await res.json();

      if (res.ok) {
        setUser(updatedUser);
        toast.success("Profile completed! Welcome to AI House.");
        navigate("/dashboard");
      } else {
        toast.error(updatedUser.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg py-16">
      <Card className="p-8 shadow-card-hover border-border/60 bg-card">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <UserCircle2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Set Up Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Confirm your details to finalize your membership.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Full Name (First & Last Name)
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Mohamed Amine"
                className="bg-muted/30 pl-10 h-11"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Account Role
            </Label>
            <RadioGroup
              defaultValue="student"
              onValueChange={setRole}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <div>
                <RadioGroupItem
                  value="student"
                  id="student"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="student"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary transition-all cursor-pointer"
                >
                  <GraduationCap className="mb-2 h-5 w-5" />
                  <span className="text-sm font-semibold">Student</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="representative"
                  id="representative"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="representative"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary transition-all cursor-pointer"
                >
                  <Building2 className="mb-2 h-5 w-5" />
                  <span className="text-sm font-semibold">Faculty</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="dept" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              University Department
            </Label>
            <Select onValueChange={setDepartment} value={department}>
              <SelectTrigger id="dept" className="bg-muted/30 h-11 text-sm">
                <SelectValue placeholder="Choose department..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full h-12 text-sm font-bold shadow-glow mt-4" disabled={loading}>
            {loading ? "Saving Profile..." : "Complete Setup →"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CompleteProfilePage;
