import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  ShieldCheck,
  FileCheck,
  Scale,
  CreditCard,
  Heart,
  BookOpen,
  Car,
  Briefcase,
  Users,
  ExternalLink,
} from "lucide-react";

const Services = () => {
  const [search, setSearch] = useState("");

  const services = [
    {
      id: 1,
      name: "National Identity Number (NIN)",
      agency: "NIMC",
      time: "2–5 Working Days",
      description: "Register or update your National Identity Number.",
      link: "https://selfservicemodification.nimc.gov.ng",
      icon: ShieldCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      name: "International Passport",
      agency: "Nigeria Immigration Service",
      time: "3–6 Weeks",
      description: "Apply for or renew your Nigerian passport.",
      link: "https://passport.immigration.gov.ng",
      icon: FileCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 3,
      name: "Tax Identification Number",
      agency: "FIRS",
      time: "Instant",
      description: "Register your Tax Identification Number.",
      link: "https://taxpro.firs.gov.ng",
      icon: CreditCard,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: 4,
      name: "NHIA Health Insurance",
      agency: "NHIA",
      time: "1 Week",
      description: "Enroll for National Health Insurance.",
      link: "https://www.nhia.gov.ng",
      icon: Heart,
      color: "bg-red-100 text-red-600",
    },
    {
      id: 5,
      name: "Driver's Licence",
      agency: "FRSC",
      time: "1–2 Weeks",
      description: "Apply or renew your driver's licence.",
      link: "https://nigeriadriverslicence.org",
      icon: Car,
      color: "bg-slate-100 text-slate-600",
    },
    {
      id: 6,
      name: "CAC Business Registration",
      agency: "Corporate Affairs Commission",
      time: "24–48 Hours",
      description: "Register your business online.",
      link: "https://pre.cac.gov.ng",
      icon: Briefcase,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      id: 7,
      name: "Student Loan",
      agency: "NELFUND",
      time: "2–3 Weeks",
      description: "Apply for Federal Student Loan.",
      link: "https://nelf.gov.ng",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 8,
      name: "Legal Aid",
      agency: "Legal Aid Council",
      time: "Depends on Case",
      description: "Access free legal assistance.",
      link: "https://legalaidcouncil.gov.ng",
      icon: Scale,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      id: 9,
      name: "Social Investment Programme",
      agency: "Federal Government",
      time: "Varies",
      description: "Apply for empowerment programmes.",
      link: "#",
      icon: Users,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.agency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-8 text-white">

        <Badge className="bg-white text-green-700 mb-4">
          Official Government Services
        </Badge>

        <h1 className="text-4xl font-bold">
          Government Digital Services
        </h1>

        <p className="mt-4 text-green-100 max-w-3xl">
          Access verified Nigerian Government services from one place.
          Learn the requirements and continue your application using the
          official government portal.
        </p>

      </div>

      {/* Search */}

      <Input
        placeholder="Search by service or agency..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="text-gray-500">
        {filteredServices.length} services available
      </p>

      {/* Services */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredServices.map((service) => {
          const Icon = service.icon;

          return (
            <Card
              key={service.id}
              className="rounded-2xl hover:shadow-xl transition-all"
            >
              <CardContent className="p-6">

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.color}`}
                >
                  <Icon size={30} />
                </div>

                <Badge className="mt-4 bg-green-600">
                  {service.agency}
                </Badge>

                <h2 className="mt-4 text-xl font-bold">
                  {service.name}
                </h2>

                <p className="mt-2 text-gray-600">
                  {service.description}
                </p>

                <p className="mt-4 text-sm">
                  <strong>Processing Time:</strong> {service.time}
                </p>

                <Button
                  className="w-full mt-6"
                  disabled={service.link === "#"}
                  onClick={() => {
                    if (service.link !== "#") {
                      window.open(service.link, "_blank");
                    }
                  }}
                >
                  {service.link === "#"
                    ? "Coming Soon"
                    : "Visit Official Portal"}

                  {service.link !== "#" && (
                    <ExternalLink className="ml-2 h-4 w-4" />
                  )}
                </Button>

              </CardContent>
            </Card>
          );
        })}

      </div>

    </div>
  );
};

export default Services;