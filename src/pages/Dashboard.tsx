import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Copy, Loader2, MapPin, Trophy, Users, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Reg {
  id: string;
  team_name: string;
  team_code: string;
  is_leader: boolean;
  member_count: number;
  event: {
    slug: string;
    title: string;
    category: string;
    event_date: string;
    event_time: string;
    venue: string;
    prize: string;
    max_team_size: number;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string; college: string | null } | null>(null);
  const [regs, setRegs] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);

    const [{ data: profileData }, { data: memberRows }] = await Promise.all([
      supabase.from("profiles").select("full_name, college").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("team_members")
        .select(`
          is_leader,
          registration:registration_id (
            id,
            team_name,
            team_code,
            event:event_id (
              slug,
              title,
              category,
              event_date,
              event_time,
              venue,
              prize,
              max_team_size
            )
          )
        `)
        .eq("user_id", user.id),
    ]);

    setProfile(profileData ?? null);

    const items: Reg[] = [];
    for (const row of memberRows ?? []) {
      const reg = (row as any).registration;
      if (!reg) continue;
      const { count } = await supabase
        .from("team_members")
        .select("*", { count: "exact", head: true })
        .eq("registration_id", reg.id);
      items.push({
        id: reg.id,
        team_name: reg.team_name,
        team_code: reg.team_code,
        is_leader: (row as any).is_leader,
        member_count: count ?? 1,
        event: reg.event,
      });
    }
    setRegs(items);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Team code copied!");
  };

  const handleLeave = async (registrationId: string, isLeader: boolean) => {
    if (!user) return;
    const confirm = window.confirm(
      isLeader
        ? "You are the team leader — leaving will remove the entire registration. Continue?"
        : "Leave this team?",
    );
    if (!confirm) return;

    if (isLeader) {
      const { error } = await supabase.from("registrations").delete().eq("id", registrationId);
      if (error) return toast.error(error.message);
      toast.success("Registration removed.");
    } else {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("registration_id", registrationId)
        .eq("user_id", user.id);
      if (error) return toast.error(error.message);
      toast.success("Left the team.");
    }
    load();
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Your dashboard"
        title={
          <>
            Hello,{" "}
            <span className="text-gradient-ember">
              {profile?.full_name?.split(" ")[0] ?? "creator"}.
            </span>
          </>
        }
        description={
          profile?.college
            ? `Logged in from ${profile.college}. Here's everything you've signed up for.`
            : "Here's everything you've signed up for at IGNITIA'26."
        }
      >
        <Button asChild variant="ember">
          <Link to="/events">Browse events</Link>
        </Button>
      </PageHero>

      <section className="container-narrow mt-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : regs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-cream/60 p-12 text-center">
            <Trophy className="mx-auto h-10 w-10 text-primary/60" />
            <h2 className="mt-4 font-display text-xl font-semibold">No registrations yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick an event and reserve your spot — solo or with a team.
            </p>
            <Button asChild variant="ember" className="mt-6">
              <Link to="/events">Find an event</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {regs.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl border border-border/70 bg-surface-elevated p-6 shadow-soft transition-all hover:shadow-card animate-fade-in-up"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-primary capitalize">
                      {r.event.category}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-semibold">
                      <Link to={`/events/${r.event.slug}`} className="hover:text-primary transition-colors">
                        {r.event.title}
                      </Link>
                    </h3>
                  </div>
                  {r.is_leader && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Leader
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">{r.team_name}</span>
                    <span>· {r.member_count}/{r.event.max_team_size} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> {r.event.event_date} · {r.event.event_time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> {r.event.venue}
                  </div>
                </div>

                {r.event.max_team_size > 1 && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-surface-cream/70 p-3">
                    <span className="text-xs text-muted-foreground">Team code</span>
                    <code className="font-display text-sm font-semibold tracking-[0.3em] text-primary">
                      {r.team_code}
                    </code>
                    <Button size="sm" variant="ghost" className="ml-auto" onClick={() => handleCopy(r.team_code)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-sm font-medium text-foreground">{r.event.prize}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleLeave(r.id, r.is_leader)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {r.is_leader ? "Withdraw" : "Leave"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Dashboard;
