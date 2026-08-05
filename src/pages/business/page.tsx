"use client";

import { useEffect, useState } from "react";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";
import type { BusinessPartner } from "@/types/businessPartner.types";

import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Separator } from "@/common/components/ui/separator";

import {
  Building2,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";

const BusinessPartnerList = () => {
  const { getBusinessPartners } = useBusinessPartnerApi();

  const [partner, setPartner] = useState<BusinessPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      <div className="flex h-[80vh] items-center justify-center">
        Loading Business Partner...
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        No Business Partner Found
      </div>
    );
  }

  const matchesSearch =
    search === "" ||
    `${partner.cardName} ${partner.cardCode} ${partner.city}`
      .toLowerCase()
      .includes(search.toLowerCase());

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              {partner.cardType}
            </Badge>

            <h1 className="text-4xl font-bold">{partner.cardName}</h1>

            <p className="mt-2 opacity-90">
              Business Partner Code: {partner.cardCode}
            </p>
          </div>

          <div className="w-full lg:w-80">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
              <Input
                className="bg-white pl-10 text-black"
                placeholder="Search partner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {!matchesSearch ? (
        <Card>
          <CardContent className="py-12 text-center">
            No matching business partner found.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Partner Code</p>
                  <p className="font-semibold">{partner.cardCode}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-green-100 p-3">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{partner.cellular}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-purple-100 p-3">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Credit Limit
                  </p>
                  <p className="font-semibold">
                    ₹{partner.creditLimit.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-orange-100 p-3">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">{partner.createDate}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <Card>
            <CardContent className="space-y-8 p-8">
              <div>
                <h2 className="text-xl font-semibold">
                  Business Information
                </h2>
                <Separator className="mt-3" />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />

                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      {partner.address}
                    </p>
                    <p className="text-muted-foreground">
                      {partner.city}, {partner.county}
                    </p>
                    <p className="text-muted-foreground">
                      {partner.country} - {partner.zipCode}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="mt-1 h-5 w-5 text-primary" />

                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      {partner.emailAddress ?? "Not Available"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 text-primary" />

                  <div>
                    <p className="font-medium">Contact Number</p>
                    <p className="text-muted-foreground">
                      {partner.cellular}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Building2 className="mt-1 h-5 w-5 text-primary" />

                  <div>
                    <p className="font-medium">Partner Type</p>
                    <Badge>{partner.cardType}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BusinessPartnerList;