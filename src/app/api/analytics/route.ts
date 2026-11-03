import { NextResponse, type NextRequest } from "next/server";
import { initialSeedData } from "@/db/seed-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId") || "usr_farmer_01";

    // 1. Farmer profile & farms
    const farmer = initialSeedData.users.find((u) => u.id === farmerId) || initialSeedData.users[0];
    const farmerFarms = initialSeedData.farms.filter((f) => f.farmerId === farmerId);
    const farmIds = farmerFarms.map((f) => f.id);
    const fields = initialSeedData.fields.filter((fld) => farmIds.includes(fld.farmId));
    const totalAcres = farmerFarms.reduce((sum, f) => sum + Number(f.totalAcres), 0);

    // 2. Crop-wise area & field distribution
    const cropAreaMap: Record<string, number> = {};
    const fieldCropDistribution = fields.map((fld) => {
      const crop = fld.currentCrop || "Unassigned";
      const area = Number(fld.areaAcres) || 0;
      cropAreaMap[crop] = (cropAreaMap[crop] || 0) + area;
      return {
        fieldId: fld.id,
        fieldName: fld.name,
        areaAcres: area,
        crop,
        variety: fld.cropVariety,
        soilType: fld.soilType,
        irrigationMethod: fld.irrigationMethod,
      };
    });

    const cropWiseArea = Object.entries(cropAreaMap).map(([crop, acres]) => ({
      crop,
      acres,
      percentage: totalAcres > 0 ? Math.round((acres / totalAcres) * 100) : 0,
    }));

    // 3. Harvest history
    const harvests = (initialSeedData.harvestRecords || []).map((h) => ({
      id: h.id,
      cropName: h.cropName,
      harvestDate: h.harvestDate,
      quantityKg: h.yieldKg,
      quintals: h.yieldKg / 100,
      qualityGrade: h.grade,
      marketRatePerQuintal: h.marketPricePerKg * 100,
      grossRevenue: h.yieldKg * h.marketPricePerKg,
      notes: h.notes,
    }));

    const totalHarvestQuintals = harvests.reduce((sum, h) => sum + h.quintals, 0);
    const totalHarvestRevenue = harvests.reduce((sum, h) => sum + h.grossRevenue, 0);

    // 4. Farming expenses & cost breakdowns
    const expenses = (initialSeedData.farmExpenses || []).filter((e) => e.farmerId === farmerId);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const categoryBreakdown: Record<string, number> = {};
    const cropExpenseBreakdown: Record<string, number> = {};

    expenses.forEach((e) => {
      categoryBreakdown[e.categoryCode] = (categoryBreakdown[e.categoryCode] || 0) + Number(e.amount);
      const crop = e.cropName || "General Farm";
      cropExpenseBreakdown[crop] = (cropExpenseBreakdown[crop] || 0) + Number(e.amount);
    });

    const expensesByCategory = Object.entries(categoryBreakdown).map(([code, amount]) => ({
      categoryCode: code,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    }));

    const expensesByCrop = Object.entries(cropExpenseBreakdown).map(([crop, amount]) => ({
      crop,
      amount,
      costPerAcre: (cropAreaMap[crop] && cropAreaMap[crop] > 0) ? Math.round(amount / cropAreaMap[crop]) : 0,
    }));

    // 5. Recorded input usage
    const inputs = (initialSeedData.inputApplications || []).map((inp) => ({
      id: inp.id,
      inputName: inp.inputName,
      inputType: inp.category,
      quantityApplied: inp.quantity,
      unit: inp.unit,
      applicationDate: inp.appliedDate,
      applicationMethod: inp.applicationMethod,
    }));

    // 6. Irrigation history
    const irrigationEvents = (initialSeedData.irrigationEvents || []).map((ev) => ({
      id: ev.id,
      fieldId: ev.fieldId,
      triggerType: ev.triggerType,
      startTime: ev.startTime,
      durationMinutes: ev.durationMinutes,
      waterVolumeLiters: Number(ev.waterVolumeLiters),
      waterSource: ev.waterSource,
      status: ev.status,
    }));

    const totalWaterDeliveredLiters = irrigationEvents.reduce((sum, ev) => sum + ev.waterVolumeLiters, 0);

    // 7. Soil health trends
    const soilTests = (initialSeedData.soilTests || []).filter((st) => st.farmerId === farmerId);
    const soilTrends = [
      { year: "2024", organicCarbonPct: 0.52, nitrogenKgHa: 110, soilHealthIndex: 72 },
      { year: "2025", organicCarbonPct: 0.59, nitrogenKgHa: 128, soilHealthIndex: 79 },
      { year: "2026 (Current)", organicCarbonPct: 0.68, nitrogenKgHa: 142, soilHealthIndex: 88 },
    ];

    // 8. Organic transition progress
    const transition = (initialSeedData.organicTransitions || []).find((t) => t.farmerId === farmerId);

    return NextResponse.json({
      success: true,
      data: {
        farmer: {
          id: farmer.id,
          name: farmer.fullName,
          village: farmer.village,
          taluka: farmer.taluka,
          district: farmer.district,
          totalAcres,
        },
        cropAnalytics: {
          totalAcres,
          cropWiseArea,
          fieldCropDistribution,
        },
        harvestAnalytics: {
          records: harvests,
          totalHarvestQuintals,
          totalHarvestRevenue,
        },
        expenseAnalytics: {
          totalExpenses,
          costPerAcreAverage: totalAcres > 0 ? Math.round(totalExpenses / totalAcres) : 0,
          expensesByCategory,
          expensesByCrop,
          recentExpenses: expenses.slice(0, 8),
        },
        inputUsage: {
          recordedApplications: inputs,
          totalApplications: inputs.length,
        },
        irrigationAnalytics: {
          totalEvents: irrigationEvents.length,
          totalWaterDeliveredLiters,
          events: irrigationEvents,
        },
        soilHealthTrends: {
          history: soilTrends,
          currentRating: soilTests[0]?.overallHealthScore || 88,
          currentOrganicCarbonPct: 0.68,
        },
        organicTransition: {
          conversionStatus: transition?.conversionStatus || "in_conversion_c1",
          currentStage: transition?.currentStage || "transition_planning",
          progressPct: transition?.progressPct || 45,
          activePracticesCount: (initialSeedData.farmingPractices || []).length,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

