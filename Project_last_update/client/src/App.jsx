import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// ✅ مهم
import AuthSuccess from "./pages/AuthSuccess.jsx";

import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth";

// Pages
import Index from "./pages/Index.jsx";
import WorkshopsPage from "./pages/WorkshopsPage.jsx";
import SessionDetailsPage from "./pages/SessionDetailsPage.jsx";
import RepresentativesPage from "./pages/RepresentativesPage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import ResourceDetailsPage from "./pages/ResourceDetailsPage.jsx";
import PartnersPage from "./pages/PartnersPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CreateWorkshopPage from "./pages/CreateWorkshopPage.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const AppLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* --- بدون Navbar --- */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* ✅ هذا الجديد */}
              <Route path="/auth-success" element={<AuthSuccess />} />

              {/* --- داخل Layout --- */}
              <Route element={<AppLayout />}>
                <Route path="/workshops" element={<WorkshopsPage />} />
                <Route path="/workshops/new" element={<CreateWorkshopPage />} />
                <Route path="/sessions/:id" element={<SessionDetailsPage />} />
                <Route
                  path="/representatives"
                  element={<RepresentativesPage />}
                />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route
                  path="/resources/:id"
                  element={<ResourceDetailsPage />}
                />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
