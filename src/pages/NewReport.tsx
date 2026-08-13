import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { nigeriaStates, lgaData } from "@/data/nigeriaLocations";

import {
  Construction,
  Shield,
  HeartPulse,
  Lightbulb,
  Droplets,
  Trees,
  GraduationCap,
  Building2,
  MapPin,
  Camera,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const reportTitles = [
  "Bad Road",
  "Potholes",
  "Broken Bridge",
  "Drainage Blockage",
  "Flooding",
  "Power Outage",
  "Water Supply",
  "Waste Dumping",
  "Environmental Pollution",
  "School Infrastructure",
  "Hospital Complaint",
  "Police/Security Issue",
  "Illegal Construction",
  "Fire Outbreak",
  "Traffic Congestion",
  "Corruption",
  "Healthcare",
  "Street Light Fault",
  "Other",
];

const categories = [
  {
    id: "infrastructure",
    name: "Infrastructure",
    icon: Construction,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "health",
    name: "Health",
    icon: HeartPulse,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "electricity",
    name: "Electricity",
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "water",
    name: "Water",
    icon: Droplets,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "environment",
    name: "Environment",
    icon: Trees,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "other",
    name: "Other",
    icon: Building2,
    color: "bg-gray-100 text-gray-700",
  },
];

const NewReport = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const lgas = [...(lgaData[state] || [])].sort();

  /* =========================================================
     IMAGE PREVIEWS
  ========================================================= */

  useEffect(() => {
    const urls = images.map((image) =>
      URL.createObjectURL(image)
    );

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  /* =========================================================
     GET CURRENT LOCATION
  ========================================================= */

  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error(
            "Geolocation is not supported by this browser."
          )
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let message =
            "Unable to get your current location.";

          if (error.code === 1) {
            message =
              "Location permission was denied.";
          } else if (error.code === 2) {
            message =
              "Your location could not be determined.";
          } else if (error.code === 3) {
            message =
              "Location request timed out.";
          }

          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  };

  /* =========================================================
     VALIDATE IMAGES
  ========================================================= */

  const handleImages = (
    files: FileList | null
  ) => {
    if (!files) return;

    const selectedFiles = Array.from(files);

    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        alert(
          `${file.name} is not a valid image file.`
        );
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(
          `${file.name} is larger than 5MB.`
        );
        continue;
      }

      validFiles.push(file);
    }

    setImages(validFiles);
  };

  /* =========================================================
     SUBMIT REPORT
  ========================================================= */

  const submitReport = async () => {
    if (loading) return;

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!title) {
      alert("Please select a report title.");
      return;
    }

    if (
      title === "Other" &&
      !customTitle.trim()
    ) {
      alert("Please enter a custom report title.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!state) {
      alert("Please select a state.");
      return;
    }

    if (!lga) {
      alert("Please select an LGA.");
      return;
    }

    if (!location.trim()) {
      alert("Please enter the specific location.");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the issue.");
      return;
    }

    try {
      setLoading(true);

      /* -----------------------------------------------------
         CHECK AUTHENTICATION
      ----------------------------------------------------- */

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert(
          "Your session has expired. Please sign in again."
        );

        navigate("/login");
        return;
      }

      /* -----------------------------------------------------
         GET GPS LOCATION
      ----------------------------------------------------- */

      let latitude: number | null = null;
      let longitude: number | null = null;

      setLocationLoading(true);

      try {
        const coords =
          await getCurrentLocation();

        latitude = coords.latitude;
        longitude = coords.longitude;

        console.log(
          "GPS LOCATION:",
          latitude,
          longitude
        );
      } catch (locationError) {
        console.warn(
          "GPS LOCATION UNAVAILABLE:",
          locationError
        );

        /*
         * We allow the report to continue without
         * coordinates.
         *
         * ReportsMap.tsx will simply exclude this
         * report from the map.
         */
      } finally {
        setLocationLoading(false);
      }

      /* -----------------------------------------------------
         GENERATE TRACKING ID
      ----------------------------------------------------- */

      const tracking_id =
        "GC-" +
        Date.now().toString().slice(-6) +
        "-" +
        Math.floor(
          100 + Math.random() * 900
        );

      /* -----------------------------------------------------
         UPLOAD IMAGES
      ----------------------------------------------------- */

      const imageUrls: string[] = [];

      for (
        let index = 0;
        index < images.length;
        index++
      ) {
        const image = images[index];

        const extension =
          image.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        const fileName =
          `${user.id}/${Date.now()}-${index}-${crypto.randomUUID()}.${extension}`;

        console.log(
          "Uploading report image:",
          fileName
        );

        const {
          error: uploadError,
        } = await supabase.storage
          .from("report-images")
          .upload(
            fileName,
            image,
            {
              cacheControl: "3600",
              upsert: false,
              contentType: image.type,
            }
          );

        if (uploadError) {
          console.error(
            "IMAGE UPLOAD ERROR:",
            uploadError
          );

          throw new Error(
            `Failed to upload image: ${image.name}`
          );
        }

        const {
          data: publicUrlData,
        } =
          supabase.storage
            .from("report-images")
            .getPublicUrl(fileName);

        if (
          publicUrlData?.publicUrl
        ) {
          imageUrls.push(
            publicUrlData.publicUrl
          );
        }
      }

      /* -----------------------------------------------------
         FINAL REPORT TITLE
      ----------------------------------------------------- */

      const finalTitle =
        title === "Other"
          ? customTitle.trim()
          : title;

      /* -----------------------------------------------------
         INSERT REPORT
      ----------------------------------------------------- */

      const {
        data: newReport,
        error: reportError,
      } = await supabase
        .from("reports")
        .insert({
          title: finalTitle,
          category,
          state,
          lga,
          location: location.trim(),

          latitude,
          longitude,

          description:
            description.trim(),

          priority,

          status: "pending",

          tracking_id,

          user_id: user.id,

          image_urls: imageUrls,
        })
        .select()
        .single();

      if (reportError) {
        console.error(
          "REPORT INSERT ERROR:",
          reportError
        );

        throw new Error(
          reportError.message
        );
      }

      if (!newReport) {
        throw new Error(
          "Report was created but no report data was returned."
        );
      }

      console.log(
        "REPORT CREATED:",
        newReport
      );

      /* -----------------------------------------------------
         REPORT TIMELINE
      ----------------------------------------------------- */

      const {
        error: timelineError,
      } = await supabase
        .from("report_timeline")
        .insert({
          report_id: newReport.id,
          status: "pending",
          note: "Report submitted",
        });

      if (timelineError) {
        console.error(
          "TIMELINE ERROR:",
          timelineError
        );
      }

      /* -----------------------------------------------------
         NOTIFICATION
      ----------------------------------------------------- */

      const {
        error: notificationError,
      } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          title: "Report Submitted",
          description: `Your report "${newReport.title}" has been submitted successfully.`,
          type: "success",
          is_read: false,
        });

      if (notificationError) {
        console.error(
          "NOTIFICATION ERROR:",
          notificationError
        );
      }

      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      alert(
        `Report submitted successfully!\n\nTracking ID:\n\n${tracking_id}\n\nSave this ID to track your report.`
      );

      navigate("/reports");
    } catch (error) {
      console.error(
        "SUBMIT REPORT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to submit report. Please try again."
      );
    } finally {
      setLoading(false);
      setLocationLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 rounded-3xl p-8 text-white shadow-lg">

        <p className="text-sm uppercase tracking-wider opacity-90">
          GovConnect NG
        </p>

        <h1 className="text-4xl font-bold mt-2">
          Submit Community Report
        </h1>

        <p className="mt-3 text-green-100 max-w-xl">
          Help improve your community by reporting
          issues directly to the appropriate
          government authority.
        </p>

      </div>

      {/* FORM */}

      <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">

        {/* REPORT TITLE */}

        <div>
          <label className="font-semibold text-gray-700 mb-2 block">
            Report Title
          </label>

          <select
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full border rounded-xl p-3"
            disabled={loading}
          >
            <option value="">
              Select Report Title
            </option>

            {reportTitles.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>
        </div>

        {/* CUSTOM TITLE */}

        {title === "Other" && (
          <Input
            placeholder="Enter custom report title"
            value={customTitle}
            disabled={loading}
            onChange={(e) =>
              setCustomTitle(
                e.target.value
              )
            }
          />
        )}

        {/* CATEGORY */}

        <div>
          <label className="font-semibold text-gray-700 block mb-3">
            Category
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {categories.map(
              (item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setCategory(
                        item.id
                      )
                    }
                    className={`rounded-2xl border p-4 transition ${
                      category ===
                      item.id
                        ? "border-green-600 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-green-500"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 ${item.color}`}
                    >
                      <Icon size={24} />
                    </div>

                    <p className="text-sm font-medium">
                      {item.name}
                    </p>
                  </button>
                );
              }
            )}

          </div>
        </div>

        {/* STATE */}

        <div>
          <label className="font-semibold text-gray-700 mb-2 block">
            State
          </label>

          <select
            className="w-full border rounded-xl p-3"
            value={state}
            disabled={loading}
            onChange={(e) => {
              setState(
                e.target.value
              );
              setLga("");
            }}
          >
            <option value="">
              Select State
            </option>

            {nigeriaStates.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>
        </div>

        {/* LGA */}

        <div>
          <label className="font-semibold text-gray-700 mb-2 block">
            Local Government Area
          </label>

          <select
            value={lga}
            disabled={!state || loading}
            onChange={(e) =>
              setLga(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
          >
            <option value="">
              Select LGA
            </option>

            {lgas.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>
        </div>

        {/* LOCATION */}

        <div>
          <label className="font-semibold text-gray-700 mb-2 block">
            Specific Location
          </label>

          <div className="relative">

            <MapPin
              size={20}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              list="locations"
              value={location}
              disabled={loading}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              placeholder="e.g. Tudun Wada Road, Market, School..."
              className="w-full border rounded-xl p-3 pl-10"
            />

          </div>

          <datalist id="locations">
            <option value="Market" />
            <option value="Primary School" />
            <option value="Secondary School" />
            <option value="General Hospital" />
            <option value="Police Station" />
            <option value="Town Hall" />
            <option value="Village Center" />
            <option value="Government Secretariat" />
            <option value="Motor Park" />
            <option value="Main Road" />
            <option value="Roundabout" />
            <option value="Community Center" />
          </datalist>

        </div>

        {/* PRIORITY */}

        <div>
          <label className="font-semibold text-gray-700 mb-3 block">
            Priority
          </label>

          <div className="grid grid-cols-2 gap-4">

            {[
              {
                value: "low",
                label: "🟢 Low",
                active:
                  "bg-green-100 border-green-600",
              },
              {
                value: "medium",
                label: "🟡 Medium",
                active:
                  "bg-yellow-100 border-yellow-600",
              },
              {
                value: "high",
                label: "🟠 High",
                active:
                  "bg-orange-100 border-orange-600",
              },
              {
                value: "critical",
                label: "🔴 Critical",
                active:
                  "bg-red-100 border-red-600",
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                disabled={loading}
                onClick={() =>
                  setPriority(
                    item.value
                  )
                }
                className={`rounded-xl p-4 border transition ${
                  priority ===
                  item.value
                    ? item.active
                    : "border-gray-200"
                }`}
              >
                {item.label}
              </button>
            ))}

          </div>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="font-semibold text-gray-700 mb-2 block">
            Describe the Issue
          </label>

          <Textarea
            rows={7}
            value={description}
            disabled={loading}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Explain what happened, when it started, how severe it is and any useful information..."
            className="resize-none"
          />

          <p className="text-xs text-gray-500 mt-2">
            {description.length} characters
          </p>
        </div>

        {/* IMAGE UPLOAD */}

        <div>
          <label className="font-semibold text-gray-700 block mb-3">
            Upload Images
          </label>

          <label
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:border-green-600"
            }`}
          >

            <Camera
              size={48}
              className="text-green-600"
            />

            <p className="mt-3 font-semibold">
              Click to upload images
            </p>

            <p className="text-sm text-gray-500">
              PNG, JPG or JPEG
            </p>

            <p className="text-sm text-green-700 mt-2">
              {images.length} image(s)
              selected
            </p>

            <input
              hidden
              multiple
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              capture="environment"
              disabled={loading}
              onChange={(e) =>
                handleImages(
                  e.target.files
                )
              }
            />

          </label>
        </div>

        {/* IMAGE PREVIEW */}

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {previewUrls.map(
              (url, index) => (
                <div
                  key={url}
                  className="relative"
                >
                  <img
                    src={url}
                    alt={`Preview ${
                      index + 1
                    }`}
                    className="rounded-xl h-32 w-full object-cover border"
                  />
                </div>
              )
            )}

          </div>
        )}

        {/* LOCATION STATUS */}

        <div className="rounded-2xl bg-gray-50 border p-4">

          <div className="flex items-center gap-3">

            <MapPin
              size={22}
              className="text-green-600"
            />

            <div>

              <p className="font-semibold">
                Report Location
              </p>

              <p className="text-sm text-gray-500">
                {locationLoading
                  ? "Getting your GPS location..."
                  : "Your GPS location will be attached automatically when available."}
              </p>

            </div>

          </div>

        </div>

        {/* SUBMIT */}

        <div className="pt-4">

          <Button
            type="button"
            onClick={submitReport}
            disabled={
              loading ||
              locationLoading
            }
            className="w-full h-14 rounded-2xl text-lg font-semibold bg-green-600 hover:bg-green-700 transition-all"
          >

            {loading ? (
              <div className="flex items-center gap-2">

                <Loader2
                  className="animate-spin"
                  size={22}
                />

                <span>
                  Submitting Report...
                </span>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={22}
                />

                <span>
                  Submit Report
                </span>
              </div>
            )}

          </Button>

        </div>

      </div>
    </div>
  );
};

export default NewReport;