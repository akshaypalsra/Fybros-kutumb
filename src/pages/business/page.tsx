"use client";

import { useEffect, useState } from "react";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";
import type { BusinessPartner } from "@/types/businessPartner.types";

import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent } from "@/common/components/ui/card";
import { Separator } from "@/common/components/ui/separator";
import { Skeleton } from "@/common/components/ui/skeleton";

import {
  Building2,
  Calendar,
  Check,
  Copy,
  CreditCard,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

// ---- helpers -------------------------------------------------------------

const relativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;

  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

// Small, reusable "copy this value" control. Keeps the copy affordance
// next to the data itself instead of adding a separate toolbar.
const CopyField = ({ value }: { value?: string | null }) => {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail silently (e.g. permissions) — no need to surface an error for a convenience action.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className="group/copy inline-flex items-center justify-center rounded-md p-1 text-muted-foreground opacity-0 transition-all duration-150 hover:bg-secondary/10 hover:text-secondary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 group-hover:opacity-100"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};

const BusinessPartnerList = () => {
  const { getBusinessPartners } = useBusinessPartnerApi();

  const [partner, setPartner] = useState<BusinessPartner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const data = await getBusinessPartners();
        setPartner(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPartner();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="mx-auto max-w-6xl">
        <Card className="rounded-xl border-border">
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Building2 className="h-8 w-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No business partner found</p>
            <p className="text-sm text-muted-foreground">
              Once a partner record exists, its details will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const created = relativeTime(partner.createDate);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <style>{`
        @keyframes bp-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bp-animate {
          animation: bp-fade-up 0.45s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .bp-animate { animation: none; }
        }
      `}</style>

      {/* Header */}
      <div className="bp-animate relative overflow-hidden rounded-xl bg-secondary p-8 text-white shadow-sm">
        {/* subtle decorative texture — evokes a ledger / statement corner without competing with the content */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-24 h-24 w-24 rounded-full bg-white/5 blur-xl"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-semibold ring-2 ring-white/25">
              {initials(partner.cardName) || <Building2 className="h-6 w-6" />}
            </div>

            <div>
              <Badge
                variant="outline"
                className="mb-2 rounded-full border-transparent bg-white/20 px-3 py-0.5 text-xs font-semibold text-white"
              >
                {partner.cardType}
              </Badge>

              <h1 className="text-3xl font-bold leading-tight">{partner.cardName}</h1>

              <p className="mt-1 text-sm text-white/75">
                Business Partner Code: {partner.cardCode}
              </p>
            </div>
          </div>

          {/* Quick actions — real, usable shortcuts rather than decoration */}
          <div className="relative flex flex-wrap gap-2">
            {partner.cellular && (
              <a
                href={`tel:${partner.cellular}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            )}
            {partner.emailAddress && (
              <a
                href={`mailto:${partner.emailAddress}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: Building2,
            label: "Partner Code",
            value: partner.cardCode,
          },
          {
            icon: Phone,
            label: "Phone",
            value: partner.cellular,
          },
          {
            icon: CreditCard,
            label: "Credit Limit",
            value: `₹${partner.creditLimit.toLocaleString()}`,
          },
          {
            icon: Calendar,
            label: "Created",
            value: partner.createDate,
            caption: created,
          },
        ].map((item, i) => (
          <Card
            key={item.label}
            className="bp-animate rounded-xl border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-secondary/10 p-3 transition-colors duration-200">
                <item.icon className="h-5 w-5 text-secondary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="truncate font-semibold text-foreground">{item.value}</p>
                {item.caption && (
                  <p className="text-xs text-muted-foreground">{item.caption}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card
        className="bp-animate rounded-xl border-border"
        style={{ animationDelay: "240ms" }}
      >
        <CardContent className="space-y-6 p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-secondary" />
              <h2 className="text-lg font-semibold text-foreground">
                Business Information
              </h2>
            </div>
            <Separator className="mt-3" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-secondary" />

              <div>
                <p className="text-sm font-medium text-foreground">Address</p>
                <p className="text-sm text-muted-foreground">{partner.address}</p>
                <p className="text-sm text-muted-foreground">
                  {partner.city}, {partner.county}
                </p>
                <p className="text-sm text-muted-foreground">
                  {partner.country} - {partner.zipCode}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4">
              <Mail className="h-5 w-5 shrink-0 text-secondary" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="truncate text-sm text-muted-foreground">
                  {partner.emailAddress ?? "Not available"}
                </p>
              </div>

              <CopyField value={partner.emailAddress} />
            </div>

            <div className="group flex items-center gap-4">
              <Phone className="h-5 w-5 shrink-0 text-secondary" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Contact Number</p>
                <p className="text-sm text-muted-foreground">{partner.cellular}</p>
              </div>

              <CopyField value={partner.cellular} />
            </div>

            <div className="flex gap-4">
              <Building2 className="mt-1 h-5 w-5 shrink-0 text-secondary" />

              <div>
                <p className="text-sm font-medium text-foreground">Partner Type</p>
                <Badge
                  variant="outline"
                  className="mt-1 rounded-full border-transparent bg-secondary/10 px-3 py-0.5 text-xs font-semibold text-secondary"
                >
                  {partner.cardType}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessPartnerList;