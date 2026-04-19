import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import logo from "@/assets/ignitia-logo.jpeg";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(160),
  password: z.string().min(6, "At least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Enter your name").max(80),
  college: z.string().trim().max(120).optional().or(z.literal("")),
});

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [submitting, setSubmitting] = useState(false);
  const redirectTo = location.state?.from || "/dashboard";

  if (!loading && user) return <Navigate to={redirectTo} replace />;

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);
    if (error) {
      const msg = error.message.toLowerCase().includes("invalid")
        ? "Invalid email or password."
        : error.message;
      return toast.error(msg);
    }
    toast.success("Welcome back!");
    navigate(redirectTo);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
      fullName: fd.get("fullName"),
      college: fd.get("college") || "",
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: parsed.data.fullName,
          college: parsed.data.college,
        },
      },
    });
    setSubmitting(false);
    if (error) {
      const msg = error.message.toLowerCase().includes("registered")
        ? "This email is already registered. Try signing in instead."
        : error.message;
      return toast.error(msg);
    }
    toast.success("Account created!", { description: "You're signed in." });
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container-narrow flex min-h-screen flex-col py-8">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="m-auto w-full max-w-md">
          <div className="text-center animate-fade-in-up">
            <img src={logo} alt="IGNITIA'26" className="mx-auto h-16 w-16 rounded-xl object-contain" />
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
              Welcome to <span className="text-gradient-ember">IGNITIA'26</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in or create an account to register for events.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border/70 bg-surface-elevated p-6 shadow-card animate-scale-in">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="si-email">Email</Label>
                    <Input id="si-email" name="email" type="email" required maxLength={160} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="si-password">Password</Label>
                    <Input id="si-password" name="password" type="password" required maxLength={72} />
                  </div>
                  <Button type="submit" variant="ember" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-name">Full name</Label>
                    <Input id="su-name" name="fullName" required maxLength={80} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-college">College (optional)</Label>
                    <Input id="su-college" name="college" maxLength={120} placeholder="IEM Kolkata" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" name="email" type="email" required maxLength={160} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-password">Password</Label>
                    <Input id="su-password" name="password" type="password" required minLength={6} maxLength={72} />
                  </div>
                  <Button type="submit" variant="ember" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    By creating an account you agree to play fair and have fun.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
