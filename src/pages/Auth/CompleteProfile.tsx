import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  User,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";

/* =========================================================
   NIGERIAN STATES
========================================================= */

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

/* =========================================================
   COMPONENT
========================================================= */

const CompleteProfile = () => {
  const navigate = useNavigate();

  const { user, completeProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");

  const [loading, setLoading] = useState(false);

  /* =======================================================
     LOAD USER INFORMATION
  ======================================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    /*
     * Google users already have their name in Supabase
     * metadata/profile.
     */
    setFullName(user.full_name || "");

    setPhone(user.phone || "");
    setState(user.state || "");
    setLga(user.lga || "");
  }, [user]);

  /* =======================================================
     SUBMIT PROFILE
  ======================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You are not authenticated.");
      navigate("/login");
      return;
    }

    /* Full name validation */
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    /* Phone validation */
    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    /* State validation */
    if (!state) {
      toast.error("Please select your state.");
      return;
    }

    /* LGA validation */
    if (!lga.trim()) {
      toast.error("Please enter your Local Government Area.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await completeProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        state: state,
        lga: lga.trim(),
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Profile completed successfully!", {
        description: "Welcome to GovConnect NG.",
      });

      /*
       * Give AuthContext a moment to update the user state
       * before navigating.
       */
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 300);
    } catch (error) {
      console.error("Complete profile error:", error);

      toast.error(
        "Something went wrong while saving your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOADING / AUTH CHECK
  ======================================================= */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />

          <p className="text-gray-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <Card className="w-full max-w-md border-none shadow-xl rounded-3xl">

        {/* HEADER */}

        <CardHeader className="space-y-2 flex flex-col items-center text-center">

          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
            <User
              className="text-primary"
              size={32}
            />
          </div>

          <CardTitle className="text-2xl font-bold">
            Complete Your Profile
          </CardTitle>

          <CardDescription>
            Please provide your information to continue using
            GovConnect NG.
          </CardDescription>

        </CardHeader>

        {/* CONTENT */}

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ==========================================
                FULL NAME
            ========================================== */}

            <div className="space-y-2">

              <Label htmlFor="full-name">
                Full Name *
              </Label>

              <div className="relative">

                <User
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                />

                <Input
                  id="full-name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10 h-12"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  disabled={loading}
                  autoComplete="name"
                />

              </div>

            </div>

            {/* ==========================================
                EMAIL
            ========================================== */}

            <div className="space-y-2">

              <Label htmlFor="email">
                Email Address
              </Label>

              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="h-12 bg-gray-100"
              />

              <p className="text-xs text-gray-500">
                Your email address is connected to your
                account and cannot be changed here.
              </p>

            </div>

            {/* ==========================================
                PHONE
            ========================================== */}

            <div className="space-y-2">

              <Label htmlFor="phone">
                Phone Number *
              </Label>

              <div className="relative">

                <Phone
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                />

                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  className="pl-10 h-12"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  disabled={loading}
                  autoComplete="tel"
                />

              </div>

            </div>

            {/* ==========================================
                STATE
            ========================================== */}

            <div className="space-y-2">

              <Label>
                State *
              </Label>

              <Select
                value={state}
                onValueChange={setState}
                disabled={loading}
              >

                <SelectTrigger className="h-12">

                  <MapPin
                    className="h-4 w-4 text-gray-400 mr-2"
                  />

                  <SelectValue
                    placeholder="Select your state"
                  />

                </SelectTrigger>

                <SelectContent>

                  {NIGERIAN_STATES.map(
                    (stateName) => (
                      <SelectItem
                        key={stateName}
                        value={stateName}
                      >
                        {stateName}
                      </SelectItem>
                    )
                  )}

                </SelectContent>

              </Select>

            </div>

            {/* ==========================================
                LGA
            ========================================== */}

            <div className="space-y-2">

              <Label htmlFor="lga">
                Local Government Area *
              </Label>

              <Input
                id="lga"
                type="text"
                placeholder="Enter your LGA"
                className="h-12"
                value={lga}
                onChange={(e) =>
                  setLga(e.target.value)
                }
                disabled={loading}
              />

            </div>

            {/* ==========================================
                SUBMIT
            ========================================== */}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-semibold"
              disabled={loading}
            >

              {loading ? (
                <>
                  <Loader2
                    className="animate-spin mr-2"
                    size={18}
                  />

                  Saving Profile...
                </>
              ) : (
                <>
                  <CheckCircle2
                    className="mr-2"
                    size={18}
                  />

                  Complete Setup
                </>
              )}

            </Button>

          </form>

        </CardContent>

      </Card>
    </motion.div>
  );
};

export default CompleteProfile;