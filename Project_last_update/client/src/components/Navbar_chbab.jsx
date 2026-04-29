import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const navItems = [
  { name: "Research", link: "#research" },
  { name: "Events", link: "#events" },
  { name: "Directory", link: "#directory" },
];

const Navbar = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[68px] bg-card py-2 border-b border-border/60 flex items-center px-8 lg:px-12">
      <div className="flex gap-6 items-center">
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="text-2xl font-bold tracking-tight text-foreground whitespace-nowrap shrink-0"
        >
          AI House
        </Link>
  
        {/* Nav links */}
        <nav className="hidden md:flex items-center justify-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="text-[13.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 px-4 py-2 rounded-lg transition-all duration-150"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle theme"
          className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-150"
        >
          {dark ? (
            <Sun className="h-[15px] w-[15px]" />
          ) : (
            <Moon className="h-[15px] w-[15px]" />
          )}
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-border" />

        {/* Login */}
        <Link
          to="/login"
          className="h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-semibold rounded-lg flex items-center transition-all duration-150 shadow-sm whitespace-nowrap"
        >
          Portal Login
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
