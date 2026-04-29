import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft,
  Info,
  Calendar as CalendarIcon,
  FileText,
  UploadCloud,
  Pencil,
  ShieldCheck,
  FileType2,
  X,
} from "lucide-react";

const CreateWorkshopPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only approved representatives (or admins) can create workshops
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "representative" && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("workshop");
  const [audience, setAudience] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleFileUpload = (e) => {
    const list = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...list]);
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (publish) => {
    if (!title.trim()) {
      toast.error("Please add a workshop title");
      return;
    }
    if (publish && (!date || !description.trim())) {
      toast.error("Date and description are required to publish");
      return;
    }

    try {
      const token = localStorage.getItem("aih_token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("department", user.department || "Computer Science");
      formData.append("audience", audience);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("venue", venue);
      formData.append("description", description);
      formData.append("status", publish ? "published" : "draft");
      
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      // Append resources (PDFs, etc.)
      files.forEach((file) => {
        formData.append("resources", file);
      });

      await axios.post(
        "http://localhost:5000/api/workshops",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        },
      );

      toast.success(publish ? "Workshop published!" : "Draft saved");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save workshop");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Page header bar */}
      <div className="bg-card border-b border-border/60 sticky top-16 z-30">
        <div className="container py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link to="/dashboard" aria-label="Back to dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                Create Event
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Scholarly Intelligence Framework · Faculty Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleSubmit(false)}>
              Save Draft
            </Button>
            <Button onClick={() => handleSubmit(true)}>Publish Event</Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Main form column */}
          <div className="space-y-6">
            {/* General Information */}
            <Section
              icon={<Info className="h-4 w-4" />}
              iconBg="bg-primary text-primary-foreground"
              title="General Information"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                    Event Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Advanced Neural Architectures for Medical Imaging"
                    className="bg-muted/40 h-12 text-base"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                      Event Type
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-muted/40 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="competition">Competition</SelectItem>
                        <SelectItem value="technical">Technical Session</SelectItem>
                        <SelectItem value="research">Research Forum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                      Target Audience
                    </Label>
                    <Input
                      id="audience"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="e.g., Postgraduates, AI Researchers"
                      className="bg-muted/40 h-12"
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Date, Time & Venue */}
            <Section
              icon={<CalendarIcon className="h-4 w-4" />}
              iconBg="bg-success text-success-foreground"
              title="Date, Time & Venue"
            >
              <div className="grid md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-muted/40 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                    Start Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-muted/40 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                    Location
                  </Label>
                  <Input
                    id="venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Main Campus - Block C"
                    className="bg-muted/40 h-12"
                  />
                </div>
              </div>
            </Section>

            {/* Description */}
            <Section
              icon={<FileText className="h-4 w-4" />}
              iconBg="bg-accent text-accent-foreground"
              title="Workshop Description"
            >
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed abstract and learning objectives for the participants..."
                className="bg-muted/40 min-h-[220px] text-base resize-none"
              />
            </Section>
          </div>

          {/* Side column */}
          <aside className="space-y-6">
            {/* Resource Repository */}
            <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileType2 className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-display font-bold">Resource Repository</h3>
              </div>

              <label
                htmlFor="file-upload"
                className="block rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition"
              >
                <div className="h-10 w-10 rounded-full bg-card border border-border/60 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="h-4 w-4 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground mb-1">Drag & Drop Materials</p>
                <p className="text-[11px] text-muted-foreground leading-snug mb-3">
                  Attach PDFs, Slides (PPTX), or Datasets. Max 50MB per file.
                </p>
                <span className="inline-flex items-center text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1.5">
                  Browse Files
                </span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleFileUpload}
                />
              </label>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                   {files.map((f, idx) => {
                    const ext = f.name.split(".").pop().toUpperCase();
                    const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 rounded-lg bg-muted/40 border border-border/40 px-2.5 py-2"
                      >
                        <div className="h-7 w-7 rounded bg-success/15 text-success flex items-center justify-center text-[9px] font-bold">
                          {ext}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{f.name}</div>
                          <div className="text-[10px] text-muted-foreground">{sizeMB} MB · Ready</div>
                        </div>
                        <button
                          onClick={() => removeFile(f.name)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          aria-label={`Remove ${f.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Visual identity */}
            <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-50 gradient-navy">
                      <div className="absolute top-6 right-8 w-32 h-32 rounded-full bg-primary/40 blur-2xl" />
                      <div className="absolute bottom-6 left-8 w-28 h-28 rounded-full bg-accent/30 blur-2xl" />
                    </div>
                    <div className="relative h-20 w-20 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-primary/30 animate-pulse" />
                    </div>
                  </>
                )}
                
                <input
                  type="file"
                  id="cover-upload"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleCoverChange}
                />
                
                <button
                  type="button"
                  onClick={() => document.getElementById("cover-upload").click()}
                  className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-card/90 border border-border/60 flex items-center justify-center hover:bg-card transition shadow-sm"
                  aria-label="Edit cover"
                >
                  <Pencil className="h-3.5 w-3.5 text-foreground" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1.5">
                  Visual Identity
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload a high-quality cover image to represent your workshop in the directory.
                </p>
              </div>
            </div>

            {/* Ethics alignment */}
            <div className="rounded-2xl bg-navy text-navy-foreground p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-success/20 text-success flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-display font-bold">Ethics Alignment</h3>
              </div>
              <p className="text-xs text-navy-foreground/70 leading-relaxed">
                By publishing, you confirm this workshop adheres to the University of Blida 1 AI Ethics
                Framework for research dissemination.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  icon,
  iconBg,
  title,
  children,
}) => (
  <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6 md:p-7">
    <div className="flex items-center gap-3 mb-5">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

export default CreateWorkshopPage;
