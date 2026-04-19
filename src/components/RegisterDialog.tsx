import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  eventId: string;
  eventTitle: string;
  minSize: number;
  maxSize: number;
  onSuccess?: () => void;
}

const teamSchema = z.object({
  teamName: z.string().trim().min(2, "Team name too short").max(60),
});

const codeSchema = z.object({
  code: z.string().trim().length(6, "Team code is 6 characters").toUpperCase(),
});

export const RegisterDialog = ({ open, onOpenChange, eventId, eventTitle, minSize, maxSize, onSuccess }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const isSolo = maxSize === 1;

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const teamName = isSolo
      ? `Solo · ${user.email?.split("@")[0] ?? "entry"}`
      : String(fd.get("teamName") ?? "");
    const parsed = teamSchema.safeParse({ teamName });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setSubmitting(true);
    const { data, error } = await supabase
      .from("registrations")
      .insert({
        event_id: eventId,
        leader_id: user.id,
        team_name: parsed.data.teamName,
      })
      .select("team_code")
      .single();
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") return toast.error("That team name is already taken for this event.");
      return toast.error(error.message);
    }

    toast.success("Registered!", {
      description: isSolo
        ? "See you at the event."
        : `Share team code ${data.team_code} with up to ${maxSize - 1} teammate(s).`,
    });
    onOpenChange(false);
    onSuccess?.();
    navigate("/dashboard");
  };

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const parsed = codeSchema.safeParse({ code: String(fd.get("code") ?? "") });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setSubmitting(true);
    // Find registration by code and event
    const { data: reg, error: regErr } = await supabase
      .from("registrations")
      .select("id, event_id, max_members:event_id(max_team_size)")
      .eq("team_code", parsed.data.code)
      .eq("event_id", eventId)
      .maybeSingle();

    if (regErr || !reg) {
      setSubmitting(false);
      return toast.error("No team found with that code for this event.");
    }

    // Count current members
    const { count } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("registration_id", reg.id);

    if ((count ?? 0) >= maxSize) {
      setSubmitting(false);
      return toast.error("This team is already full.");
    }

    const { error: joinErr } = await supabase.from("team_members").insert({
      registration_id: reg.id,
      user_id: user.id,
      is_leader: false,
    });
    setSubmitting(false);

    if (joinErr) {
      if (joinErr.code === "23505") return toast.error("You're already on this team.");
      return toast.error(joinErr.message);
    }

    toast.success("You're on the team!");
    onOpenChange(false);
    onSuccess?.();
    navigate("/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{eventTitle}</DialogTitle>
          <DialogDescription>
            {isSolo
              ? "Confirm your solo entry."
              : `Create a team or join an existing one (${minSize}–${maxSize} members).`}
          </DialogDescription>
        </DialogHeader>

        {isSolo ? (
          <form onSubmit={handleCreate}>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="ember" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm entry"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <Tabs defaultValue="create" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create team</TabsTrigger>
              <TabsTrigger value="join">Join team</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-4">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="teamName">Team name</Label>
                  <Input id="teamName" name="teamName" required maxLength={60} placeholder="The Phoenix Five" />
                </div>
                <Button type="submit" variant="ember" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create & register"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="join" className="mt-4">
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="code">Team code</Label>
                  <Input
                    id="code"
                    name="code"
                    required
                    maxLength={6}
                    placeholder="ABC123"
                    className="uppercase tracking-[0.4em] text-center font-display text-lg"
                  />
                  <p className="text-xs text-muted-foreground">Get this 6-character code from your team leader.</p>
                </div>
                <Button type="submit" variant="ember" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join team"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
