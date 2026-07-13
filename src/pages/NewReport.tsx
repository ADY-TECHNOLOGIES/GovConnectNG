import { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const lgas = [...(lgaData[state] || [])].sort();

  const getCurrentLocation = () => {
    return new Promise<{
      latitude: number;
      longitude: number;
    }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => reject("Location permission denied"),
        {
          enableHighAccuracy: true,
        }
      );
    });
  };

  const submitReport = async () => {
    if (
      !title ||
      !category ||
      !state ||
      !lga ||
      !location ||
      !description ||
      (title === "Other" && !customTitle.trim())
    ) {
      alert("Please complete all required fields.");
      return;
    }

  let latitude = null;
  let longitude = null;

  try {
    const coords = await getCurrentLocation();
    latitude = coords.latitude;
    longitude = coords.longitude;
  } catch (err) {
    console.log(err);
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    alert("User not logged in");
    return;
}

    const tracking_id =
      "GC-" +
      Date.now().toString().slice(-6) +
      "-" +
      Math.floor(Math.random() * 1000);

    const imageUrls: string[] = [];

    for (const image of images) {
      const fileName = `${user.id}/${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("report-images")
        .upload(fileName, image);

        if (uploadError) {
          console.error(uploadError);
          alert("Failed to upload image.");
          return;
      }

      const { data } = supabase.storage
        .from("report-images")
        .getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
    }

    const { data: newReport, error } = await supabase
      .from("reports")
      .insert([
        {
          title: title === "Other" ? customTitle : title,
          category,
          state,
          lga,
          location,
          latitude,
          longitude,
          description,
          priority,
          status: "pending",
          tracking_id,
          user_id: user.id,
          image_urls: imageUrls,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("INSERT ERROR:", error);
    
      alert(JSON.stringify(error));
    
      return;
    }

    const { error: timelineError } = await supabase
  .from("report_timeline")
  .insert({
    report_id: newReport.id,
    status: "pending",
    note: "Report submitted",
  });

if (timelineError) {
  console.error(timelineError);
}

    const { error: notificationError } = await supabase
    .from("notifications")
    .insert({
      user_id: user.id,
      title: "Report Submitted",
      description: `Your report "${newReport.title}" has been submitted successfully.`,
      type: "success",
      is_read: false,
    });

    if (notificationError) {
      console.error(notificationError);
    }

    alert(`Report submitted successfully!

Tracking ID:

${tracking_id}

Save this ID to track your report.`);

    navigate("/reports");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

    {/* Header */}

    <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 rounded-3xl p-8 text-white shadow-lg">

      <p className="text-sm uppercase tracking-wider opacity-90">
        GovConnect NG
      </p>

      <h1 className="text-4xl font-bold mt-2">
        Submit Community Report
      </h1>

      <p className="mt-3 text-green-100 max-w-xl">
        Help improve your community by reporting issues directly to the appropriate government authority.
      </p>

    </div>

    <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">

      {/* Report Title */}

      <div>

        <label className="font-semibold text-gray-700 mb-2 block">
          Report Title
        </label>

        <select
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-xl p-3"
        >

          <option value="">
            Select Report Title
          </option>

          {reportTitles.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

      </div>

      {title === "Other" && (

        <Input
          placeholder="Enter custom report title"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
        />

      )}

      {/* Category */}

      <div>

        <label className="font-semibold text-gray-700 block mb-3">
          Category
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {categories.map((item) => {

            const Icon = item.icon;

            return (

              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`rounded-2xl border p-4 transition ${
                  category === item.id
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

          })}

        </div>

      </div>

      {/* State */}

      <div>

        <label className="font-semibold text-gray-700 mb-2 block">
          State
        </label>

        <select
          className="w-full border rounded-xl p-3"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setLga("");
          }}
        >

          <option value="">
            Select State
          </option>

          {nigeriaStates.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

      </div>

      {/* LGA */}

      <div>

        <label className="font-semibold text-gray-700 mb-2 block">
          Local Government Area
        </label>

        <select
          value={lga}
          disabled={!state}
          onChange={(e) => setLga(e.target.value)}
          className="w-full border rounded-xl p-3"
        >

          <option value="">
            Select LGA
          </option>

          {lgas.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

      </div>

              {/* Specific Location */}

              <div>

<label className="font-semibold text-gray-700 mb-2 block">
  Specific Location
</label>

<input
  list="locations"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  placeholder="Specific Location"
  className="w-full border rounded-xl p-3"
/>

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

{/* Priority */}

<div>

<label className="font-semibold text-gray-700 mb-3 block">
  Priority
</label>

<div className="grid grid-cols-2 gap-4">

  <button
    type="button"
    onClick={() => setPriority("low")}
    className={`rounded-xl p-4 border transition ${
      priority === "low"
        ? "bg-green-100 border-green-600"
        : "border-gray-200"
    }`}
  >
    🟢 Low
  </button>

  <button
    type="button"
    onClick={() => setPriority("medium")}
    className={`rounded-xl p-4 border transition ${
      priority === "medium"
        ? "bg-yellow-100 border-yellow-600"
        : "border-gray-200"
    }`}
  >
    🟡 Medium
  </button>

  <button
    type="button"
    onClick={() => setPriority("high")}
    className={`rounded-xl p-4 border transition ${
      priority === "high"
        ? "bg-orange-100 border-orange-600"
        : "border-gray-200"
    }`}
  >
    🟠 High
  </button>

  <button
    type="button"
    onClick={() => setPriority("critical")}
    className={`rounded-xl p-4 border transition ${
      priority === "critical"
        ? "bg-red-100 border-red-600"
        : "border-gray-200"
    }`}
  >
    🔴 Critical
  </button>

</div>

</div>

{/* Description */}

<div>

<label className="font-semibold text-gray-700 mb-2 block">
  Describe the Issue
</label>

<Textarea
  rows={7}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Explain what happened, when it started, how severe it is and any useful information..."
  className="resize-none"
/>

</div>

{/* Image Upload */}

<div>

<label className="font-semibold text-gray-700 block mb-3">
  Upload Images
</label>

<label className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition">

  <span className="text-5xl">
    📷
  </span>

  <p className="mt-3 font-semibold">
    Click to upload images
  </p>

  <p className="text-sm text-gray-500">
    PNG, JPG or JPEG
  </p>

  <p className="text-sm text-green-700 mt-2">
    {images.length} image(s) selected
  </p>

  <input
    hidden
    multiple
    type="file"
    accept="image/*"
    capture="environment"
    onChange={(e) => {
      if (e.target.files) {
        setImages(Array.from(e.target.files));
      }
    }}
  />

</label>

</div>

{/* Image Preview */}

{images.length > 0 && (

<div className="grid grid-cols-2 md:grid-cols-3 gap-4">

  {images.map((image, index) => (

    <img
      key={index}
      src={URL.createObjectURL(image)}
      alt={`Preview ${index + 1}`}
      className="rounded-xl h-32 w-full object-cover border"
    />

  ))}

</div>

)}

        {/* Submit Button */}

        <div className="pt-4">

          <Button
            type="button"
            onClick={submitReport}
            disabled={loading}
            className="w-full h-14 rounded-2xl text-lg font-semibold bg-green-600 hover:bg-green-700 transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">

                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>

                <span>Submitting Report...</span>

              </div>
            ) : (
              "Submit Report"
            )}
          </Button>

        </div>

      </div>

    </div>
      );
    };
    
    export default NewReport;