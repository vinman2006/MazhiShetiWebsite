"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { FarmRecord, FarmFieldRecord } from "@/db/seed-data";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Sprout,
  PlusCircle,
  MapPin,
  Trees,
  Trash2,
  Edit2,
  CheckCircle2,
  Activity,
  Layers,
  FileText,
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  Stethoscope,
  Landmark,
  Compass,
  FlaskConical,
  Cpu,
  Leaf,
} from "lucide-react";

export default function MyFarmPage() {
  const { data, addFarm, editFarm, deleteFarm, addField, editField, deleteField } = useAppState();

  const farms = data.farms || [];
  const fields = data.fields || [];

  // Selected Farm state
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || "");
  const activeFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const activeFarmFields = fields.filter((fld) => fld.farmId === activeFarm?.id);

  // Modals
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showEditFarmModal, setShowEditFarmModal] = useState(false);
  const [showDeleteFarmConfirm, setShowDeleteFarmConfirm] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  // Farm Form State
  const [farmName, setFarmName] = useState("");
  const [surveyNumber, setSurveyNumber] = useState("");
  const [totalAcres, setTotalAcres] = useState(10);
  const [soilType, setSoilType] = useState("Deep Black Cotton (Regur)");
  const [irrigationSource, setIrrigationSource] = useState("Drip Irrigation");
  const [village, setVillage] = useState("Ashti");
  const [taluka, setTaluka] = useState("Karanja");
  const [district, setDistrict] = useState("Wardha");
  const [boundaries, setBoundaries] = useState("");
  const [farmNotes, setFarmNotes] = useState("");

  // Field Form State
  const [fieldName, setFieldName] = useState("");
  const [fieldArea, setFieldArea] = useState(3.5);
  const [fieldSoilType, setFieldSoilType] = useState("Deep Black Cotton (Regur)");
  const [fieldIrrigation, setFieldIrrigation] = useState("Inline Drip System");
  const [fieldCrop, setFieldCrop] = useState("Cotton (कापूस)");
  const [fieldVariety, setFieldVariety] = useState("Ajeet-155 BG-II");
  const [fieldNotes, setFieldNotes] = useState("");
  const [farmingHistory, setFarmingHistory] = useState("Soybean (Kharif 2025) -> Harbhara (Rabi 2025)");

  const navItems = [
    { label: "Dashboard Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "My Farm & Fields", href: "/dashboard/farmer/my-farm", icon: Trees },
    { label: "Soil Health & Lab", href: "/dashboard/farmer/soil-health", icon: FlaskConical },
    { label: "Smart Devices & Valves", href: "/dashboard/farmer/devices", icon: Cpu },
    { label: "Sustainable & Organic", href: "/dashboard/farmer/organic", icon: Leaf },
    { label: "Soil Telemetry", href: "/sensors", icon: Activity },
    { label: "Produce Mandi", href: "/marketplace", icon: ShoppingBag },
    { label: "Machinery Fleet", href: "/rentals", icon: Wrench },
    { label: "Agronomist Clinic", href: "/advisory", icon: Stethoscope },
  ];

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName) return;
    addFarm({
      farmerId: "usr_farmer_01",
      name: farmName,
      totalAcres,
      surveyNumber,
      soilType,
      irrigationSource,
      waterAvailability: "Adequate",
      village,
      taluka,
      district,
      boundaries,
      notes: farmNotes,
    });
    setShowAddFarmModal(false);
    setFarmName("");
    setSurveyNumber("");
  };

  const handleUpdateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarm) return;
    editFarm(activeFarm.id, {
      name: farmName || activeFarm.name,
      surveyNumber: surveyNumber || activeFarm.surveyNumber,
      totalAcres: totalAcres || activeFarm.totalAcres,
      soilType: soilType || activeFarm.soilType,
      irrigationSource: irrigationSource || activeFarm.irrigationSource,
      boundaries: boundaries || activeFarm.boundaries,
      notes: farmNotes || activeFarm.notes,
    });
    setShowEditFarmModal(false);
  };

  const handleDeleteActiveFarm = () => {
    if (!activeFarm) return;
    deleteFarm(activeFarm.id);
    setShowDeleteFarmConfirm(false);
    if (farms.length > 1) {
      setSelectedFarmId(farms.find((f) => f.id !== activeFarm.id)?.id || "");
    }
  };

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarm || !fieldName) return;
    addField({
      farmId: activeFarm.id,
      name: fieldName,
      areaAcres: fieldArea,
      soilType: fieldSoilType,
      irrigationMethod: fieldIrrigation,
      currentCrop: fieldCrop,
      cropVariety: fieldVariety,
      growthStage: "Vegetative",
      soilHealthScore: 88,
      organicCarbonPct: 0.68,
      farmingHistory,
      fieldNotes,
    });
    setShowAddFieldModal(false);
    setFieldName("");
    setFieldNotes("");
  };

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="My Farm Management"
      roleSubtitle="शेत व तुकडे व्यवस्थापन"
      roleIcon={Trees}
    >
      <div className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-brand-text">My Farms & Field Boundaries</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage agricultural parcels, soil zones, survey numbers, and boundaries.
            </p>
          </div>

          <Button
            size="md"
            variant="accent"
            onClick={() => setShowAddFarmModal(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add New Farm
          </Button>
        </div>

        {/* Farm Selector Tabs */}
        {farms.length === 0 ? (
          <EmptyState
            title="No farms registered yet"
            description="Add your first farm property to begin monitoring fields and soil telemetry."
            actionLabel="Register Farm Property"
            onAction={() => setShowAddFarmModal(true)}
          />
        ) : (
          <div className="space-y-6">
            {/* Farm selection pill row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {farms.map((farm) => {
                const isSelected = farm.id === activeFarm?.id;
                return (
                  <button
                    key={farm.id}
                    onClick={() => setSelectedFarmId(farm.id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 border ${
                      isSelected
                        ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span>{farm.name}</span>
                    <Badge variant={isSelected ? "lime" : "neutral"} size="sm">
                      {farm.totalAcres} Ac
                    </Badge>
                  </button>
                );
              })}
            </div>

            {/* Active Farm Detail Card */}
            {activeFarm && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                        Active Farm Entity
                      </span>
                      <Badge variant="lime">Survey Gat: {activeFarm.surveyNumber}</Badge>
                    </div>
                    <h2 className="text-2xl font-black text-brand-text">{activeFarm.name}</h2>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{activeFarm.village}, Taluka {activeFarm.taluka}, District {activeFarm.district}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFarmName(activeFarm.name);
                        setSurveyNumber(activeFarm.surveyNumber);
                        setTotalAcres(activeFarm.totalAcres);
                        setSoilType(activeFarm.soilType);
                        setIrrigationSource(activeFarm.irrigationSource);
                        setBoundaries(activeFarm.boundaries || "");
                        setFarmNotes(activeFarm.notes || "");
                        setShowEditFarmModal(true);
                      }}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit Farm Details
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowDeleteFarmConfirm(true)}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Key Farm Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500">Total Land:</span>
                    <p className="font-black text-brand-text font-mono text-sm">{activeFarm.totalAcres} Acres</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Soil Profile:</span>
                    <p className="font-bold text-slate-900">{activeFarm.soilType}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Irrigation Infrastructure:</span>
                    <p className="font-bold text-slate-900">{activeFarm.irrigationSource}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Water Availability:</span>
                    <p className="font-bold text-emerald-700">{activeFarm.waterAvailability}</p>
                  </div>
                </div>

                {/* Boundaries & Notes */}
                {(activeFarm.boundaries || activeFarm.notes) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {activeFarm.boundaries && (
                      <div className="p-4 rounded-2xl bg-brand-light/40 border border-brand-light">
                        <p className="font-bold text-brand-dark flex items-center gap-1.5 mb-1">
                          <Compass className="w-3.5 h-3.5 text-brand-primary" />
                          <span>Field Boundaries & Demarcation:</span>
                        </p>
                        <p className="text-slate-700">{activeFarm.boundaries}</p>
                      </div>
                    )}
                    {activeFarm.notes && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Agronomic Notes:</span>
                        </p>
                        <p className="text-slate-600">{activeFarm.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Registered Fields Sub-section */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-text">
                        Registered Fields ({activeFarmFields.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Independent zones for precision crop cycles, soil sensors, and activity logs.
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setShowAddFieldModal(true)}
                      leftIcon={<PlusCircle className="w-4 h-4" />}
                    >
                      Register New Field
                    </Button>
                  </div>

                  {activeFarmFields.length === 0 ? (
                    <EmptyState
                      title="No fields registered in this farm"
                      description="Divide your farm acreage into distinct field zones for accurate crop monitoring."
                      actionLabel="Add Field"
                      onAction={() => setShowAddFieldModal(true)}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {activeFarmFields.map((fld) => (
                        <div
                          key={fld.id}
                          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-card transition flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="lime">{fld.areaAcres} Acres</Badge>
                              <Badge variant="success">Health: {fld.soilHealthScore}%</Badge>
                            </div>

                            <h4 className="text-base font-extrabold text-brand-text">{fld.name}</h4>
                            <p className="text-xs font-bold text-brand-primary mt-1">{fld.currentCrop}</p>
                            <p className="text-xs text-slate-500">Variety: {fld.cropVariety}</p>

                            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                              <div className="flex justify-between">
                                <span>Soil Type:</span>
                                <strong className="text-slate-800">{fld.soilType}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Irrigation:</span>
                                <strong className="text-slate-800">{fld.irrigationMethod}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Organic Carbon:</span>
                                <strong className="text-emerald-700 font-mono">{fld.organicCarbonPct}%</strong>
                              </div>
                              {fld.farmingHistory && (
                                <div className="pt-2 text-[11px] text-slate-500">
                                  <span className="font-semibold text-slate-700">History:</span> {fld.farmingHistory}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-mono">ID: {fld.id}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:bg-rose-50"
                              onClick={() => deleteField(fld.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Add New Farm */}
        <Modal
          isOpen={showAddFarmModal}
          onClose={() => setShowAddFarmModal(false)}
          title="Register New Farm Entity"
          description="Add a new agricultural land holding to your Mazhi Sheti account."
        >
          <form onSubmit={handleCreateFarm} className="space-y-4">
            <Input
              label="Farm Name"
              placeholder="e.g. Sadashiv Krishi Tirth (Wardha)"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Survey / Gat Number"
                placeholder="Gat No. 142/2A"
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                required
              />
              <Input
                label="Total Area (Acres)"
                type="number"
                step="0.5"
                value={totalAcres}
                onChange={(e) => setTotalAcres(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Soil Classification"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                options={[
                  { value: "Deep Black Cotton (Regur)", label: "Deep Black Cotton (काळी माती)" },
                  { value: "Medium Red Loam", label: "Medium Red Loam (तांबडी माती)" },
                  { value: "Alluvial Silt", label: "Alluvial Silt (गाळाची जमीन)" },
                  { value: "Laterite / Morrum", label: "Laterite / Morrum (मुरुमाड)" },
                ]}
              />
              <Select
                label="Primary Irrigation"
                value={irrigationSource}
                onChange={(e) => setIrrigationSource(e.target.value)}
                options={[
                  { value: "Drip Irrigation", label: "Drip Irrigation (ठिबक)" },
                  { value: "Sprinklers", label: "Sprinklers (तुषार)" },
                  { value: "Farm Pond + Well", label: "Farm Pond + Well (शेततळे)" },
                  { value: "Canal Water", label: "Canal Water (कालवा)" },
                  { value: "Rainfed", label: "Rainfed / Dryland (कोरडवाहू)" },
                ]}
              />
            </div>

            <Input
              label="Boundaries & Adjoining Lands"
              placeholder="North: Stream, South: Road, East: Gat 143"
              value={boundaries}
              onChange={(e) => setBoundaries(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddFarmModal(false)}>
                Cancel
              </Button>
              <Button variant="accent" size="sm" type="submit">
                Save Farm Property
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Edit Farm */}
        <Modal
          isOpen={showEditFarmModal}
          onClose={() => setShowEditFarmModal(false)}
          title="Edit Farm Details"
          description="Update acreage, survey number, and soil parameters."
        >
          <form onSubmit={handleUpdateFarm} className="space-y-4">
            <Input
              label="Farm Name"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Survey / Gat Number"
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                required
              />
              <Input
                label="Total Area (Acres)"
                type="number"
                step="0.5"
                value={totalAcres}
                onChange={(e) => setTotalAcres(Number(e.target.value))}
                required
              />
            </div>
            <Input
              label="Boundaries"
              value={boundaries}
              onChange={(e) => setBoundaries(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowEditFarmModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Delete Farm Confirmation */}
        <Modal
          isOpen={showDeleteFarmConfirm}
          onClose={() => setShowDeleteFarmConfirm(false)}
          title="Confirm Farm Deletion"
          description={`Are you sure you want to delete "${activeFarm?.name}"? All associated fields, telemetry zones, and crop records will be permanently removed.`}
        >
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteFarmConfirm(false)}>
              Keep Farm
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteActiveFarm}>
              Yes, Delete Farm
            </Button>
          </div>
        </Modal>

        {/* Modal: Register Field */}
        <Modal
          isOpen={showAddFieldModal}
          onClose={() => setShowAddFieldModal(false)}
          title="Register New Field Zone"
          description={`Add a sub-field to "${activeFarm?.name}".`}
        >
          <form onSubmit={handleCreateField} className="space-y-4">
            <Input
              label="Field Name / Tag"
              placeholder="e.g. Field D - Onion Bed"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Area (Acres)"
                type="number"
                step="0.5"
                value={fieldArea}
                onChange={(e) => setFieldArea(Number(e.target.value))}
                required
              />
              <Select
                label="Soil Type"
                value={fieldSoilType}
                onChange={(e) => setFieldSoilType(e.target.value)}
                options={[
                  { value: "Deep Black Cotton (Regur)", label: "Deep Black Cotton" },
                  { value: "Medium Red Loam", label: "Medium Red Loam" },
                  { value: "Alluvial Silt", label: "Alluvial Silt" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Current Crop"
                placeholder="e.g. Cotton (कापूस)"
                value={fieldCrop}
                onChange={(e) => setFieldCrop(e.target.value)}
                required
              />
              <Input
                label="Variety / Hybrid"
                placeholder="e.g. Ajeet 155"
                value={fieldVariety}
                onChange={(e) => setFieldVariety(e.target.value)}
                required
              />
            </div>

            <Input
              label="Previous Seasonal History"
              placeholder="e.g. Soybean (Kharif 2025) -> Harbhara (Rabi 2025)"
              value={farmingHistory}
              onChange={(e) => setFarmingHistory(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddFieldModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Register Field
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}
