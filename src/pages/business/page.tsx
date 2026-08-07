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
  CreditCard,
  Mail,
  MapPin,
  Phone,

} from "lucide-react";

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
      <div className="mx-auto max-w-6xl space-y-6 p-6">
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
      <div className="mx-auto max-w-6xl p-6">
        <Card className="rounded-xl border-border">
          <CardContent className="py-12 text-center text-muted-foreground">
            No business partner found.
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="rounded-xl bg-[#E92739] p-8 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 rounded-full border-transparent bg-white/20 px-3 py-0.5 text-xs font-semibold text-white"
            >
              {partner.cardType}
            </Badge>

            <h1 className="text-3xl font-bold">{partner.cardName}</h1>

            <p className="mt-2 text-sm text-white/80">
              Business Partner Code: {partner.cardCode}
            </p>
          </div>
        </div>
      </div>


      <>
        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-xl border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-[#E92739]/10 p-3">
                <Building2 className="h-5 w-5 text-[#E92739]" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Partner Code</p>
                <p className="font-semibold text-foreground">{partner.cardCode}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-[#E92739]/10 p-3">
                <Phone className="h-5 w-5 text-[#E92739]" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-semibold text-foreground">{partner.cellular}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-[#E92739]/10 p-3">
                <CreditCard className="h-5 w-5 text-[#E92739]" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Credit Limit</p>
                <p className="font-semibold text-foreground">
                  ₹{partner.creditLimit.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-[#E92739]/10 p-3">
                <Calendar className="h-5 w-5 text-[#E92739]" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-semibold text-foreground">{partner.createDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>


        <Card className="rounded-xl border-border">
          <CardContent className="space-y-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Business Information
              </h2>
              <Separator className="mt-3" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 text-[#E92739]" />

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

              <div className="flex gap-4">
                <Mail className="mt-1 h-5 w-5 text-[#E92739]" />

                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {partner.emailAddress ?? "Not Available"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 text-[#E92739]" />

                <div>
                  <p className="text-sm font-medium text-foreground">Contact Number</p>
                  <p className="text-sm text-muted-foreground">{partner.cellular}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Building2 className="mt-1 h-5 w-5 text-[#E92739]" />

                <div>
                  <p className="text-sm font-medium text-foreground">Partner Type</p>
                  <Badge
                    variant="outline"
                    className="mt-1 rounded-full border-transparent bg-[#E92739]/10 px-3 py-0.5 text-xs font-semibold text-[#E92739]"
                  >
                    {partner.cardType}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </>

    </div>
  );
};

export default BusinessPartnerList;