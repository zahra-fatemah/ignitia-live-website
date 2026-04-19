import { useEffect, useState } from "react";
import { Loader2, Mail, Pencil, Plus, Trash2, Users } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  category: "tech" | "cultural" | "gaming" | "literary";
  tagline: string;
  description: string;
  rules: string[];
  team_size: string;
  min_team_size: number;
  max_team_size: number;
  event_date: string;
  event_time: string;
  venue: string;
  prize: string;
  chip: string;
  is_published: boolean;
};

type Submission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

type RegistrationRow = {
  id: string;
  team_name: string;
  team_code: string;
  created_at: string;
  event: { title: string };
};

const blankEvent: Partial<EventRow> = {
  category: "tech",
  rules: [],
  min_team_size: 1,
  max_team_size: 1,
  chip: "peach",
  is_published: true,
};

const Admin = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<EventRow> | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: ev }, { data: subs }, { data: regs }] = await Promise.all([
      supabase.from("events").select("*").order("event_date"),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase
        .from("registrations")
        .select("id, team_name, team_code, created_at, event:event_id(title)")
        .order("created_at", { ascending: false }),
    ]);
    setEvents((ev as EventRow[]) ?? []);
    setSubmissions((subs as Submission[]) ?? []);
    setRegistrations((regs as unknown as RegistrationRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing({ ...blankEvent });
    setOpen(true);
  };
  const startEdit = (e: EventRow) => {
    setEditing({ ...e });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      slug: String(fd.get("slug") ?? "").trim(),
      title: String(fd.get("title") ?? "").trim(),
      category: editing.category as EventRow["category"],
      tagline: String(fd.get("tagline") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      rules: String(fd.get("rules") ?? "")
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      team_size: String(fd.get("team_size") ?? "").trim(),
      min_team_size: Number(fd.get("min_team_size") ?? 1),
      max_team_size: Number(fd.get("max_team_size") ?? 1),
      event_date: String(fd.get("event_date") ?? "").trim(),
      event_time: String(fd.get("event_time") ?? "").trim(),
      venue: String(fd.get("venue") ?? "").trim(),
      prize: String(fd.get("prize") ?? "").trim(),
      chip: String(fd.get("chip") ?? "peach"),
      is_published: true,
    };

    if (!payload.slug || !payload.title || !payload.tagline || !payload.description) {
      return toast.error("Title, slug, tagline and description are required.");
    }

    setSaving(true);
    const { error } = editing.id
      ? await supabase.from("events").update(payload).eq("id", editing.id)
      : await supabase.from("events").insert(payload);
    setSaving(false);

    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Event updated." : "Event created.");
    setOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? Registrations will be removed too.")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Event deleted.");
    load();
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Admin console"
        title={
          <>
            Run the show from<br />
            <span className="text-gradient-ember">one place.</span>
          </>
        }
        description="Manage events, view registrations and read contact submissions."
      />

      <section className="container-wide mt-4">
        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="registrations">
              Registrations <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-[10px]">{registrations.length}</span>
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-[10px]">{submissions.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* EVENTS */}
          <TabsContent value="events" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">All events</h2>
              <Button variant="ember" onClick={startCreate}>
                <Plus className="h-4 w-4" /> New event
              </Button>
            </div>
            {loading ? (
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            ) : (
              <div className="grid gap-3">
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-surface-elevated p-5 shadow-soft"
                  >
                    <div>
                      <div className="font-display font-semibold">{e.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {e.category} · {e.event_date} · {e.venue}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(e)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(e.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* REGISTRATIONS */}
          <TabsContent value="registrations" className="mt-6">
            {registrations.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No registrations yet.</p>
            ) : (
              <div className="grid gap-3">
                {registrations.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border/70 bg-surface-elevated p-5 shadow-soft">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-display font-semibold">{r.team_name}</div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {r.event?.title}</span>
                          <span>·</span>
                          <span>{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <code className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary">
                        {r.team_code}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* MESSAGES */}
          <TabsContent value="messages" className="mt-6">
            {submissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Inbox zero.</p>
            ) : (
              <div className="grid gap-3">
                {submissions.map((s) => (
                  <div key={s.id} className="rounded-2xl border border-border/70 bg-surface-elevated p-5 shadow-soft">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-display font-semibold">{s.subject}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {s.name} · {s.email}
                          <span>·</span>
                          <span>{new Date(s.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <a href={`mailto:${s.email}?subject=Re: ${s.subject}`}>Reply</a>
                      </Button>
                    </div>
                    <p className="mt-3 text-sm text-foreground/85 whitespace-pre-wrap">{s.message}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Editor dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing?.id ? "Edit event" : "New event"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editing.title} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" defaultValue={editing.slug} required placeholder="hackathon" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" name="tagline" defaultValue={editing.tagline} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={editing.description} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rules">Rules (one per line)</Label>
                <Textarea id="rules" name="rules" rows={4} defaultValue={editing.rules?.join("\n")} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={editing.category}
                    onValueChange={(v) => setEditing({ ...editing, category: v as EventRow["category"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="literary">Literary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Chip color</Label>
                  <Select
                    value={editing.chip}
                    onValueChange={(v) => setEditing({ ...editing, chip: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="peach">Peach</SelectItem>
                      <SelectItem value="lavender">Lavender</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="mint">Mint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="team_size">Team size label</Label>
                  <Input id="team_size" name="team_size" defaultValue={editing.team_size} required placeholder="2 – 4" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="min_team_size">Min</Label>
                  <Input id="min_team_size" name="min_team_size" type="number" min={1} defaultValue={editing.min_team_size} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="max_team_size">Max</Label>
                  <Input id="max_team_size" name="max_team_size" type="number" min={1} defaultValue={editing.max_team_size} required />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="event_date">Date label</Label>
                  <Input id="event_date" name="event_date" defaultValue={editing.event_date} required placeholder="Aug 1, 2026" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="event_time">Time label</Label>
                  <Input id="event_time" name="event_time" defaultValue={editing.event_time} required placeholder="10:00 AM – 1:00 PM" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="venue">Venue</Label>
                  <Input id="venue" name="venue" defaultValue={editing.venue} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prize">Prize</Label>
                  <Input id="prize" name="prize" defaultValue={editing.prize} required />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="ember" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing.id ? "Save changes" : "Create event"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
};

export default Admin;
