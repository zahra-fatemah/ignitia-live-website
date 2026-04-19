import { Link, NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Menu, Shield, User as UserIcon, X } from "lucide-react";
import logo from "@/assets/ignitia-logo.jpeg";
import { NAV_LINKS, FEST_NAME } from "@/data/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const initials = (user?.user_metadata?.full_name as string | undefined)
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || "U";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav border-b border-border/60 py-2" : "py-4",
      )}
    >
      <div className="container-wide flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt={`${FEST_NAME} phoenix logo`}
            className="h-9 w-9 rounded-md object-contain transition-transform group-hover:scale-105"
            width={36}
            height={36}
          />
          <span className="font-display text-lg font-bold tracking-tight">
            IGNITIA<span className="text-primary">'26</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <RouterNavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                )
              }
            >
              {link.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-ember text-primary-foreground font-display font-semibold text-sm shadow-soft hover:shadow-ember transition-all">
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="font-display text-sm font-semibold truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><Shield className="h-4 w-4" /> Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild variant="ember" size="sm">
                <Link to="/events">Register</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-nav border-t border-border/60 animate-fade-in">
          <div className="container-wide flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <RouterNavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/8"
                      : "text-foreground/80 hover:bg-accent",
                  )
                }
              >
                {link.label}
              </RouterNavLink>
            ))}
            <div className="my-2 border-t border-border/60" />
            {user ? (
              <>
                <RouterNavLink
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
                >
                  <UserIcon className="h-4 w-4" /> Dashboard
                </RouterNavLink>
                {isAdmin && (
                  <RouterNavLink
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
                  >
                    <Shield className="h-4 w-4" /> Admin
                  </RouterNavLink>
                )}
                <Button variant="outline" className="mt-2" onClick={() => { setOpen(false); handleSignOut(); }}>
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild variant="ember" className="mt-2" onClick={() => setOpen(false)}>
                  <Link to="/events">Register Now</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
