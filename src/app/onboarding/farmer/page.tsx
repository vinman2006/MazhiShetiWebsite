"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import {
  Sprout,
  User,
  MapPin,
  Trees,
  Leaf,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Globe,
  Compass,
  FileCheck,
  Edit3,
} from "lucide-react";

export default function FarmerOnboardingPage() {
  const router = useRouter();
  const { onboarding, updateOnboarding, setOnboardingStep, completeFarmerOnboarding } = useAppState();

  const currentStep = onboarding.currentStep || 1;
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Personal
  const [fullName, setFullName] = useState(onboarding.fullName || "");
  const [phone, setPhone] = useState(onboarding.phone || "");
  const [email, setEmail] = useState(onboarding.email || "");
  const [preferredLanguage, setPreferredLanguage] = useState<"mr" | "hi" | "en">(
    onboarding.preferredLanguage || "mr"
  );
  const [avatarUrl, setAvatarUrl] = useState(onboarding.avatarUrl || "");

  // Step 2: Location
  const [state, setState] = useState(onboarding.state || "Maharashtra");
  const [district, setDistrict] = useState(onboarding.district || "Wardha");
  const [taluka, setTaluka] = useState(onboarding.taluka || "Karanja (Lad)");
  const [village, setVillage] = useState(onboarding.village || "Ashti");
  const [pinCode, setPinCode] = useState(onboarding.pinCode || "442202");
  const [gpsCoords, setGpsCoords] = useState(onboarding.gpsCoords || "21.1965° N, 78.4312° E");

  // Step 3: Farm Info
  const [totalLandAcres, setTotalLandAcres] = useState(onboarding.totalLandAcres || 12.5);
  const [ownershipType, setOwnershipType] = useState<"owned" | "leased" | "joint_family">(
    onboarding.ownershipType || "owned"
  );
  const [numberOfFields, setNumberOfFields] = useState(onboarding.numberOfFields || 3);
  const [mainCrops, setMainCrops] = useState<string[]>(
    onboarding.mainCrops || ["Cotton (कापूस)", "Soybean (सोयाबीन)"]
  );
  const [irrigationAvailability, setIrrigationAvailability] = useState<
    "drip" | "sprinkler" | "well" | "canal" | "rainfed"
  >(onboarding.irrigationAvailability || "drip");

  // Step 4: Practices
  const [farmingPractice, setFarmingPractice] = useState<
    "conventional" | "organic" | "transitioning" | "natural_zbnf" | "no_till"
  >(onboarding.farmingPractice || "transitioning");

  // Step Navigation handlers
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    updateOnboarding({
      fullName,
      phone,
      email,
      preferredLanguage,
      avatarUrl,
      currentStep: 2,
    });
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    updateOnboarding({
      state,
      district,
      taluka,
      village,
      pinCode,
      gpsCoords,
      currentStep: 3,
    });
  };

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    updateOnboarding({
      totalLandAcres,
      ownershipType,
      numberOfFields,
      mainCrops,
      irrigationAvailability,
      currentStep: 4,
    });
  };

  const handleNextStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    updateOnboarding({
      farmingPractice,
      currentStep: 5,
    });
  };

  const handleFinalSubmit = () => {
    setSubmitting(true);
    completeFarmerOnboarding();
    setTimeout(() => {
      setSubmitting(false);
      router.push("/dashboard/farmer");
    }, 700);
  };

  const toggleCrop = (cropName: string) => {
    if (mainCrops.includes(cropName)) {
      if (mainCrops.length > 1) {
        setMainCrops(mainCrops.filter((c) => c !== cropName));
      }
    } else {
      setMainCrops([...mainCrops, cropName]);
    }
  };

  const stepsMeta = [
    { num: 1, title: "Personal Info", icon: User },
    { num: 2, title: "Location", icon: MapPin },
    { num: 3, title: "Farm Details", icon: Trees },
    { num: 4, title: "Practices", icon: Leaf },
    { num: 5, title: "Review & Submit", icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-brand-cream py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Brand header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6 text-brand-lime" />
            </span>
            <div>
              <span className="font-extrabold text-base text-brand-text">Mazhi Sheti</span>
              <span className="block text-[10px] font-bold text-brand-primary uppercase">
                Farmer Onboarding • शेतकरी नोंदणी
              </span>
            </div>
          </Link>
          <Badge variant="lime" dot>
            Step {currentStep} of 5
          </Badge>
        </div>

        {/* Multi-step progress indicator */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-5 gap-2">
            {stepsMeta.map((s) => {
              const Icon = s.icon;
              const isPast = s.num < currentStep;
              const isCurrent = s.num === currentStep;
              return (
                <button
                  key={s.num}
                  disabled={s.num > currentStep}
                  onClick={() => setOnboardingStep(s.num)}
                  className={`flex flex-col items-center text-center p-2 rounded-2xl transition-all ${
                    isCurrent
                      ? "bg-brand-primary text-white shadow-sm"
                      : isPast
                      ? "text-brand-primary hover:bg-brand-light/50"
                      : "text-slate-400 opacity-60"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold hidden sm:inline">{s.title}</span>
                  <span className="text-[10px] font-mono sm:hidden">{s.num}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= STEP 1: PERSONAL INFORMATION ================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-brand-text">Step 1: Personal Information</h2>
              <p className="text-xs text-slate-500 mt-1">
                Tell us your name, contact details, and preferred communication language.
              </p>
            </div>

            <form onSubmit={handleNextStep1} className="space-y-4">
              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rameshwar Sadashiv Shinde"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Mobile Number (WhatsApp linked)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98223 XXXXX"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rameshwar.shinde@farmer.in"
                  required
                />
              </div>

              <div>
                <label className="text-form-label">Preferred Advisory Language</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "mr", title: "मराठी (Marathi)" },
                    { id: "hi", title: "हिंदी (Hindi)" },
                    { id: "en", title: "English" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setPreferredLanguage(lang.id as any)}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                        preferredLanguage === lang.id
                          ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {lang.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-600">
                    {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : "RS"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Profile Photo</p>
                    <p className="text-[11px] text-slate-500">Kisan ID card verification format</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAvatarUrl(
                      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256"
                    )
                  }
                >
                  Set Verified Photo
                </Button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Location
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 2: LOCATION ================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-brand-text">Step 2: Farm Location</h2>
              <p className="text-xs text-slate-500 mt-1">
                Pinpoint your village and taluka for hyper-local micro-climate forecasts and sensor mesh setup.
              </p>
            </div>

            <form onSubmit={handleNextStep2} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  readOnly
                  className="bg-slate-50 font-bold"
                />
                <Select
                  label="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  options={[
                    { value: "Wardha", label: "Wardha (वर्धा)" },
                    { value: "Nagpur", label: "Nagpur (नागपूर)" },
                    { value: "Amravati", label: "Amravati (अमरावती)" },
                    { value: "Akola", label: "Akola (अकोला)" },
                    { value: "Jalgaon", label: "Jalgaon (जळगाव)" },
                    { value: "Nashik", label: "Nashik (नाशिक)" },
                    { value: "Yavatmal", label: "Yavatmal (यवतमाळ)" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Taluka"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  placeholder="Karanja (Lad)"
                  required
                />
                <Input
                  label="Village / Gram Panchayat"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Ashti"
                  required
                />
                <Input
                  label="Postal PIN Code"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="442202"
                  required
                />
              </div>

              <div>
                <Input
                  label="Geographical Coordinates / Geotag (Optional)"
                  value={gpsCoords}
                  onChange={(e) => setGpsCoords(e.target.value)}
                  leftIcon={<Compass className="w-4 h-4 text-brand-primary" />}
                  placeholder="21.1965° N, 78.4312° E"
                  helperText="Used for satellite soil moisture calibration and drone flight path planning."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setOnboardingStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button type="submit" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Farm Details
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: FARM INFORMATION ================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-brand-text">Step 3: Farm & Land Information</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your total acreage, plots, cultivated crops, and irrigation facilities.
              </p>
            </div>

            <form onSubmit={handleNextStep3} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Total Cultivated Area (Acres)"
                  type="number"
                  step="0.5"
                  value={totalLandAcres}
                  onChange={(e) => setTotalLandAcres(Number(e.target.value))}
                  required
                />
                <Select
                  label="Land Ownership"
                  value={ownershipType}
                  onChange={(e) => setOwnershipType(e.target.value as any)}
                  options={[
                    { value: "owned", label: "Self-Owned (मालकीचे)" },
                    { value: "leased", label: "Leased / Tenant (खंडाने)" },
                    { value: "joint_family", label: "Joint Family (एकत्र कुटुंब)" },
                  ]}
                />
                <Input
                  label="Number of Fields / Plots"
                  type="number"
                  min={1}
                  max={20}
                  value={numberOfFields}
                  onChange={(e) => setNumberOfFields(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="text-form-label">Primary Cultivated Crops (Select all that apply)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    "Cotton (कापूस)",
                    "Soybean (सोयाबीन)",
                    "Turmeric (हळद)",
                    "Banana (केळी)",
                    "Onion (कांदा)",
                    "Nagpur Orange (संत्री)",
                    "Wheat (गहू)",
                    "Sugarcane (ऊस)",
                  ].map((cropName) => {
                    const isSelected = mainCrops.includes(cropName);
                    return (
                      <button
                        key={cropName}
                        type="button"
                        onClick={() => toggleCrop(cropName)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{cropName}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Select
                label="Primary Irrigation Method"
                value={irrigationAvailability}
                onChange={(e) => setIrrigationAvailability(e.target.value as any)}
                options={[
                  { value: "drip", label: "Drip Irrigation System (ठिबक सिंचन) — High Efficiency" },
                  { value: "sprinkler", label: "Micro-Sprinklers (तुषार सिंचन)" },
                  { value: "well", label: "Open Well / Borewell (विहीर / बोअरवेल)" },
                  { value: "canal", label: "Canal Water Source (कालवा पाणी)" },
                  { value: "rainfed", label: "Rainfed / Dryland (कोरडवाहू शेती)" },
                ]}
              />

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setOnboardingStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button type="submit" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Farming Practices
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 4: FARMING PRACTICES ================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-brand-text">Step 4: Farming Practices & Soil Care</h2>
              <p className="text-xs text-slate-500 mt-1">
                We calibrate your AI fertigation recommendations based on your soil management methodology.
              </p>
            </div>

            <form onSubmit={handleNextStep4} className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    id: "conventional",
                    title: "Conventional Farming (पारंपारिक शेती)",
                    desc: "Balanced use of NPK chemical fertilizers with standard agrochemical pest management.",
                  },
                  {
                    id: "transitioning",
                    title: "Transitioning to Bio-Organic (सेंद्रिय परिवर्तनाधीन)",
                    desc: "Reducing synthetic inputs, incorporating vermicompost, bio-stimulants, and neem cakes.",
                  },
                  {
                    id: "organic",
                    title: "Certified Organic (प्रमाणित सेंद्रिय)",
                    desc: "Strictly non-chemical, NPOP certified, using biological pest control and green manuring.",
                  },
                  {
                    id: "natural_zbnf",
                    title: "Subhash Palekar Natural Farming / ZBNF (नैसर्गिक शेती)",
                    desc: "Jeevamrut, Beejamrut, mulching, and indigenous cow dung/urine based soil biology.",
                  },
                  {
                    id: "no_till",
                    title: "Regenerative / Zero-Till Farming (शून्य मशागत)",
                    desc: "Soil microbiology preservation, permanent crop cover, and minimal mechanical disturbance.",
                  },
                ].map((item) => {
                  const isSelected = farmingPractice === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFarmingPractice(item.id as any)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between ${
                        isSelected
                          ? "bg-brand-light/70 border-brand-primary shadow-sm"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-black text-brand-text">{item.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? "border-brand-primary bg-brand-primary" : "border-slate-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setOnboardingStep(3)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button type="submit" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Review All Details
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 5: FINAL REVIEW & SUBMISSION ================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-brand-text">Step 5: Final Review & Submission</h2>
              <p className="text-xs text-slate-500 mt-1">
                Verify your complete farmer profile. You can edit any section before saving to the database.
              </p>
            </div>

            {/* Review Card 1: Personal */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Personal Information
                  </h4>
                </div>
                <button
                  onClick={() => setOnboardingStep(1)}
                  className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Name:</span>
                  <p className="font-bold text-slate-900">{fullName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>
                  <p className="font-bold text-slate-900 font-mono">{phone}</p>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>
                  <p className="font-bold text-slate-900 truncate">{email}</p>
                </div>
                <div>
                  <span className="text-slate-500">Language:</span>
                  <p className="font-bold text-brand-primary uppercase">{preferredLanguage}</p>
                </div>
              </div>
            </div>

            {/* Review Card 2: Location */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Farm Location
                  </h4>
                </div>
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Village:</span>
                  <p className="font-bold text-slate-900">{village}</p>
                </div>
                <div>
                  <span className="text-slate-500">Taluka:</span>
                  <p className="font-bold text-slate-900">{taluka}</p>
                </div>
                <div>
                  <span className="text-slate-500">District:</span>
                  <p className="font-bold text-slate-900">{district}, {state}</p>
                </div>
                <div>
                  <span className="text-slate-500">PIN Code:</span>
                  <p className="font-bold text-slate-900 font-mono">{pinCode}</p>
                </div>
              </div>
            </div>

            {/* Review Card 3: Farm & Practices */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trees className="w-4 h-4 text-brand-primary" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Farm & Cultivation Details
                  </h4>
                </div>
                <button
                  onClick={() => setOnboardingStep(3)}
                  className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Total Land:</span>
                  <p className="font-black text-brand-primary font-mono">{totalLandAcres} Acres</p>
                </div>
                <div>
                  <span className="text-slate-500">Plots / Fields:</span>
                  <p className="font-bold text-slate-900">{numberOfFields} Zones</p>
                </div>
                <div>
                  <span className="text-slate-500">Irrigation:</span>
                  <p className="font-bold text-slate-900 uppercase">{irrigationAvailability}</p>
                </div>
                <div>
                  <span className="text-slate-500">Practices:</span>
                  <p className="font-bold text-emerald-800 capitalize">{farmingPractice.replace("_", " ")}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500">Registered Crops:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {mainCrops.map((c) => (
                    <Badge key={c} variant="lime" size="sm">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Guarantee */}
            <div className="p-4 rounded-2xl bg-brand-light/60 border border-brand-light text-xs text-brand-dark space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                <span>Ready to synchronize with Mazhi Sheti IoT Cloud</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Submitting will create your farmer profile, link your location coordinates, and unlock the live telemetry dashboard.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setOnboardingStep(4)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="accent"
                size="lg"
                isLoading={submitting}
                onClick={handleFinalSubmit}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Submit & Open Farmer Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

