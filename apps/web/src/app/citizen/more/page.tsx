import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Trophy, ShieldAlert, User, Truck, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ITEMS = [
  { href: "/citizen/badges", label: "Badges & Tier", icon: Award },
  { href: "/citizen/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/citizen/reviews", label: "Reviews & Disputes", icon: ShieldAlert },
  { href: "/citizen/profile", label: "Profile", icon: User },
  { href: "/citizen/truck-preview", label: "Truck & ETA Preview", icon: Truck, preview: true },
];

export default function CitizenMorePage() {
  return (
    <div>
      <PageHeader title="More" />
      <Card>
        <CardContent className="divide-y divide-brand-border p-0">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 p-4 text-sm">
                <Icon className="h-4 w-4 text-brand-muted-fg" />
                <span className="flex-1">{item.label}</span>
                {item.preview && <Badge variant="warning">PREVIEW</Badge>}
                <ChevronRight className="h-4 w-4 text-brand-muted-fg" />
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
