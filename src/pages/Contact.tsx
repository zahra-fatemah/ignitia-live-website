import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: z.string().trim().min(3, "Add a short subject").max(120),
  message: z.string().trim().min(10, "Message is too short").max(1000),
});

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) return toast.error("Couldn't send your message. Please try again.");
    toast.success("Thanks for reaching out!", {
      description: "We'll get back within a day.",
    });
    form.reset();
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Drop a line.<br />
            <span className="text-gradient-ember">We answer every one.</span>
          </>
        }
        description="Press, sponsorships, partnerships, performance enquiries or just a hello — pick a channel and we'll be there."
      />

      <section className="container-narrow mt-4">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@ignitia26.in", href: "mailto:hello@ignitia26.in" },
              { icon: Phone, label: "Phone", value: "+91 98300 00000", href: "tel:+919830000000" },
              { icon: MapPin, label: "Campus", value: "IEM Gurukul, Sector V, Salt Lake, Kolkata 700091" },
            ].map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl border border-border/70 bg-surface-elevated p-5 shadow-soft"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                  {href ? (
                    <a href={href} className="text-sm font-medium hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : (
                    <div className="text-sm font-medium">{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="lg:col-span-3 rounded-2xl border border-border/70 bg-surface-elevated p-6 sm:p-8 shadow-card"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" name="name" placeholder="Avi Sen" maxLength={80} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@college.edu" maxLength={160} required />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="Sponsorship enquiry" maxLength={120} required />
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell us a little about what you're looking for…"
                maxLength={1000}
                required
              />
            </div>
            <Button type="submit" variant="ember" size="lg" className="mt-6 w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Sending…" : (<>Send message <Send className="h-4 w-4" /></>)}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
