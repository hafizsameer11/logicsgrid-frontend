import {
  Activity,
  Archive,
  Bot,
  Bug,
  CalendarCheck,
  Cloud,
  Code,
  Database,
  EyeOff,
  FileText,
  Gauge,
  Handshake,
  Layers,
  LayoutTemplate,
  MessagesSquare,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Icons selectable in the CMS (see cms/app/Filament/Support/Fields.php iconSelect). */
export const cmsIcons: Record<string, LucideIcon> = {
  rocket: Rocket,
  "layout-template": LayoutTemplate,
  smartphone: Smartphone,
  "calendar-check": CalendarCheck,
  bot: Bot,
  handshake: Handshake,
  "shield-check": ShieldCheck,
  activity: Activity,
  archive: Archive,
  bug: Bug,
  gauge: Gauge,
  "refresh-cw": RefreshCw,
  "eye-off": EyeOff,
  "file-text": FileText,
  layers: Layers,
  "messages-square": MessagesSquare,
  wrench: Wrench,
  code: Code,
  database: Database,
  cloud: Cloud,
  sparkles: Sparkles,
  users: Users,
};

export function CmsIcon({
  name,
  className,
}: {
  name?: string | null | undefined;
  className?: string;
}) {
  const Icon = (name && cmsIcons[name]) || Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}
