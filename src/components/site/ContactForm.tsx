import { cms, whatsappHref } from "@/lib/cms";
import { useSite } from "@/lib/site-context";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email.").max(255),
  phone: z.string().trim().max(30),
  company: z.string().trim().max(120),
  website: z.string().trim().max(200),
  // An untouched select has a disabled placeholder, so the field is missing rather than empty.
  service: z.string({ required_error: "Choose a service." }).min(1, "Choose a service."),
  budget: z.string({ required_error: "Choose a budget range." }).min(1, "Choose a budget range."),
  details: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(2000),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

/** Saves the enquiry in the CMS (Enquiries) and opens WhatsApp with the details pre-filled. */
function buildMessage(v: Values, audit: boolean) {
  return [
    audit ? "Free audit request (logicsgrid.org)" : "New enquiry (logicsgrid.org)",
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.phone && `Phone: ${v.phone}`,
    v.company && `Company: ${v.company}`,
    v.website && `Website: ${v.website}`,
    `Service: ${v.service}`,
    `Budget: ${v.budget}`,
    `Details: ${v.details}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function ContactForm({ variant = "contact" }: { variant?: "contact" | "audit" }) {
  const { site, services } = useSite();
  const budgets = site.budgetRanges;
  const audit = variant === "audit";
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const whatsappUrl = (text: string) => `${whatsappHref(site)}?text=${encodeURIComponent(text)}`;
  const mailUrl = (text: string) =>
    `mailto:${site.email}?subject=${encodeURIComponent(audit ? "Free audit request" : "Project enquiry")}&body=${encodeURIComponent(text)}`;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = schema.safeParse({
      phone: "",
      company: "",
      website: "",
      ...Object.fromEntries(form),
    });
    if (!parsed.success) {
      const next: Errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) next[key as keyof Errors] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    const text = buildMessage(parsed.data, audit);
    setMessage(text);
    window.open(whatsappUrl(text), "_blank", "noopener");
    void cms
      .submitEnquiry({ ...parsed.data, type: audit ? "audit" : "contact" })
      .catch(() => undefined);
    event.currentTarget.reset();
  }

  if (message)
    return (
      <div className="surface-card flex min-h-80 flex-col items-start justify-center" role="status">
        <CheckCircle2 className="h-10 w-10 text-secondary-accent" aria-hidden="true" />
        <h2 className="mt-5 text-2xl font-semibold">Almost done. Send it on WhatsApp.</h2>
        <p className="mt-3 text-muted-foreground">
          We opened WhatsApp with your details filled in. Press send there and we will reply within
          24 hours on business days. Prefer email? Use the button below.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a href={whatsappUrl(message)} target="_blank" rel="noreferrer">
              Open WhatsApp again
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={mailUrl(message)}>Send by email</a>
          </Button>
          <Button variant="ghost" onClick={() => setMessage(null)}>
            New enquiry
          </Button>
        </div>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="surface-card space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            maxLength={100}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={255}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone or WhatsApp (optional)" name="phone" error={errors.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
        </Field>
        <Field label="Company (optional)" name="company" error={errors.company}>
          <Input id="company" name="company" autoComplete="organization" maxLength={120} />
        </Field>
      </div>
      {audit ? (
        <Field label="Website or app link (optional)" name="website" error={errors.website}>
          <Input
            id="website"
            name="website"
            type="url"
            inputMode="url"
            placeholder="https://"
            maxLength={200}
          />
        </Field>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Service needed" name="service" error={errors.service}>
          <select
            id="service"
            name="service"
            defaultValue={audit ? "Free audit" : ""}
            className="form-control"
            aria-invalid={!!errors.service}
          >
            <option value="" disabled>
              Choose a service
            </option>
            {audit ? <option>Free audit</option> : null}
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Care plan</option>
            <option>Not sure yet</option>
          </select>
        </Field>
        <Field label="Budget range" name="budget" error={errors.budget}>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className="form-control"
            aria-invalid={!!errors.budget}
          >
            <option value="" disabled>
              Choose a range
            </option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field
        label={audit ? "What should we look at?" : "Project details"}
        name="details"
        error={errors.details}
      >
        <Textarea
          id="details"
          name="details"
          rows={6}
          maxLength={2000}
          placeholder={
            audit
              ? "Your current website, booking process or tools, and what is not working."
              : "What are you building, changing or trying to improve?"
          }
          aria-invalid={!!errors.details}
          aria-describedby={errors.details ? "details-error" : undefined}
        />
      </Field>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {audit ? "Request my free audit" : "Send enquiry"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Submitting opens WhatsApp with your message ready to send. We reply within 24 hours on
        business days.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
