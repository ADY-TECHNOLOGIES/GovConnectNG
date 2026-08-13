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
  ArrowLeft,
  Save,
} from "lucide-react";

import { toast } from "sonner";

import {
  nigeriaStates,
  lgaData,
} from "@/data/nigeriaLocations";

const EditProfile = () => {
  const navigate = useNavigate();

  const {
    user,
    completeProfile,
  } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");

  const [loading, setLoading] = useState(false);

  /*
  =========================================================
  LOAD EXISTING USER PROFILE
  =========================================================
  */

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    setFullName(user.full_name || "");
    setPhone(user.phone || "");
    setState(user.state || "");
    setLga(user.lga || "");
  }, [user, navigate]);

  /*
  =========================================================
  HANDLE STATE CHANGE
  =========================================================
  */

  const handleStateChange = (newState: string) => {
    setState(newState);

    // Reset LGA when the user changes state
    setLga("");
  };

  /*
  =========================================================
  HANDLE FORM SUBMISSION
  =========================================================
  */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error("You are not authenticated.");
      navigate("/login");
      return;
    }

    // Full name validation
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    // Phone validation
    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    // State validation
    if (!state) {
      toast.error("Please select your state.");
      return;
    }

    // LGA validation
    if (!lga) {
      toast.error(
        "Please select your Local Government Area."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await completeProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        state: state,
        lga: lga,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success(
        "Profile updated successfully!"
      );

      // Go back to profile
      setTimeout(() => {
        navigate("/profile", {
          replace: true,
        });
      }, 500);

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        "Something went wrong while updating your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================================
  LOADING / AUTH CHECK
  =========================================================
  */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">

          <Loader2
            className="w-8 h-8 animate-spin mx-auto mb-3 text-primary"
          />

          <p className="text-gray-600">
            Loading profile...
          </p>

        </div>
      </div>
    );
  }

  /*
  =========================================================
  UI
  =========================================================
  */

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="min-h-screen bg-gray-50 p-4 md:p-8"
    >

      <div className="max-w-2xl mx-auto">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Button
          variant="ghost"
          className="mb-4"
          onClick={() =>
            navigate("/profile")
          }
          disabled={loading}
        >

          <ArrowLeft
            className="mr-2"
            size={18}
          />

          Back to Profile

        </Button>


        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <Card className="border-none shadow-xl rounded-3xl">

          {/* HEADER */}

          <CardHeader className="space-y-2 text-center">

            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">

              <User
                className="text-primary"
                size={32}
              />

            </div>

            <CardTitle className="text-2xl md:text-3xl font-bold">
              Edit Your Profile
            </CardTitle>

            <CardDescription>
              Update your personal information
              and location.
            </CardDescription>

          </CardHeader>


          {/* CONTENT */}

          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* =================================================
                  FULL NAME
              ================================================= */}

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
                      setFullName(
                        e.target.value
                      )
                    }
                    disabled={loading}
                    autoComplete="name"
                  />

                </div>

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

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
                  Your email address cannot be changed
                  here.
                </p>

              </div>


              {/* =================================================
                  PHONE
              ================================================= */}

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
                      setPhone(
                        e.target.value
                      )
                    }
                    disabled={loading}
                    autoComplete="tel"
                  />

                </div>

              </div>


              {/* =================================================
                  STATE
              ================================================= */}

              <div className="space-y-2">

                <Label>
                  State *
                </Label>

                <Select
                  value={state}
                  onValueChange={
                    handleStateChange
                  }
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

                    {nigeriaStates.map(
                      (stateName) => (

                        <SelectItem
                          key={stateName}
                          value={stateName}
                        >

                          {stateName === "FCT"
                            ? "Federal Capital Territory (FCT)"
                            : stateName}

                        </SelectItem>

                      )
                    )}

                  </SelectContent>

                </Select>

              </div>


              {/* =================================================
                  LOCAL GOVERNMENT AREA
              ================================================= */}

              <div className="space-y-2">

                <Label>
                  Local Government Area *
                </Label>

                <Select
                  value={lga}
                  onValueChange={setLga}
                  disabled={
                    loading || !state
                  }
                >

                  <SelectTrigger className="h-12">

                    <MapPin
                      className="h-4 w-4 text-gray-400 mr-2"
                    />

                    <SelectValue
                      placeholder={
                        state
                          ? "Select your LGA"
                          : "Select your state first"
                      }
                    />

                  </SelectTrigger>


                  <SelectContent>

                    {(
                      lgaData[state] || []
                    ).map(
                      (lgaName) => (

                        <SelectItem
                          key={lgaName}
                          value={lgaName}
                        >

                          {lgaName}

                        </SelectItem>

                      )
                    )}

                  </SelectContent>

                </Select>


                {/* No LGA message */}

                {state &&
                  (!lgaData[state] ||
                    lgaData[state].length === 0) && (

                    <p className="text-xs text-red-500">
                      No LGAs found for this state.
                    </p>

                  )}


                {/* State reminder */}

                {!state && (

                  <p className="text-xs text-gray-500">
                    Please select your state first.
                  </p>

                )}

              </div>


              {/* =================================================
                  SAVE BUTTON
              ================================================= */}

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

                    Saving Changes...
                  </>

                ) : (

                  <>
                    <Save
                      className="mr-2"
                      size={18}
                    />

                    Save Changes
                  </>

                )}

              </Button>

            </form>

          </CardContent>

        </Card>

      </div>

    </motion.div>
  );
};

export default EditProfile;