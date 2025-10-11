'use client';

import { Button } from "@/components/ui/button";
import { AlertCircle, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReport from "./PDFReport";
import { User } from "firebase/auth";
import { UserData, DetailedReport } from "@/types/user";
import { useState } from "react";
import { toast } from "sonner";

interface PDFGeneratorProps {
  user: User;
  userData: UserData;
}

const PDFGenerator = ({ user, userData }: PDFGeneratorProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Construct detailedReport object from userData
  const detailedReport: DetailedReport = {
    executiveSummary: {
      monthlyBill: userData.monthlyBill || 0,
      primaryGoal: userData.primaryGoal || "Reduce energy bills",
      energyProfile: {
        type: userData.userCategory || "Domestic",
        storageCapacity: Number(userData.storageCapacity) || 0,
        solarCapacity: userData.solarCapacity || 0,
      },
      discom: userData.discomInfo?.name || "Unknown",
    },
    tariffAnalysis: {
      averagePowerPurchaseCost: 3.08,
      averageCostOfSupply: 12.11,
      averageBillingRate: 3.7,
    },
    consumptionAnalytics: {
      peakDemand: 6.68,
      peakDemandTime: "Late morning hours",
      consumptionPattern: "Highest during daytime",
      mainConsumers: ["Dishwasher", "Thermostat"],
    },
    solarAnalysis: {
      status: userData.hasSolarPanels ? "Installed" : "Not Installed",
      capacity: userData.solarCapacity || 0,
      potential: "High potential for bill reduction through optimization",
    },
    smartDevicesAnalysis: {
      installedDevices: Object.entries(userData.smartDevices || {})
        .filter(([_, status]) => status)
        .map(([device]) => ({ name: device, type: "Energy-intensive" })),
      missingDevices: Object.entries(userData.smartDevices || {})
        .filter(([_, status]) => !status)
        .map(([device]) => device),
    },
    recommendations: [
      {
        title: "Optimize Solar Usage",
        details:
          "Consider upgrading solar panels to increase capacity. This will enable more electricity generation during the day and reduce grid dependency.",
      },
      {
        title: "Energy-Efficient Appliances",
        details:
          "Replace existing appliances with energy-efficient ones, such as a washing machine and EV charger, to reduce consumption and lower bills.",
      },
      {
        title: "Smart Home Automation",
        details:
          "Install smart devices like smart plugs and thermostats to optimize energy usage and reduce waste.",
      },
      {
        title: "Timing-Based Consumption",
        details:
          "Monitor consumption patterns and adjust usage based on TOU rates. Shift energy-intensive tasks to low-rate periods.",
      },
      {
        title: "Regular Maintenance",
        details:
          "Ensure regular maintenance of solar panels and storage system for optimal performance and extended lifespan.",
      },
    ],
  };

  const handleDownload = () => {
    setIsDownloading(true);
    toast.info("Preparing PDF for download...");
  };

  const handleDownloadComplete = () => {
    setIsDownloading(false);
    toast.success("PDF downloaded successfully!");
  };

  const handleDownloadError = (error: any) => {
    console.error("PDF download error:", error);
    setIsDownloading(false);
    toast.error("Failed to download PDF. Please try again.");
  };

  return (
    <PDFDownloadLink
  document={<PDFReport user={user} userData={userData} detailedReport={detailedReport} />}
  fileName={`energy-report-${new Date().toISOString().split("T")[0]}.pdf`}
  onClick={handleDownload}
  onError={handleDownloadError}
>
  {({ loading, error }) => {
    if (error) {
      handleDownloadError(error);
      return (
        <Button className="bg-red-600 text-white hover:bg-red-700" disabled>
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Error generating PDF
          </div>
        </Button>
      );
    }

    return (
      <Button className="bg-green-600 text-white hover:bg-green-700" disabled={loading || isDownloading}>
        <div className="flex items-center">
          {loading || isDownloading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {loading || isDownloading ? "Preparing PDF..." : "Download PDF"}
        </div>
      </Button>
    );
  }}
</PDFDownloadLink>

  );
};

export default PDFGenerator;
