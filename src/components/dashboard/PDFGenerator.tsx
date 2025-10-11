'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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

  return (
    <PDFDownloadLink
      document={<PDFReport user={user} userData={userData} detailedReport={detailedReport} />}
      fileName={`energy-report-${new Date().toISOString().split("T")[0]}.pdf`}
    >
      {/* Children must be ReactNode, not a function */}
      <Button
        className="bg-green-600 text-white hover:bg-green-700"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <div className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </div>
      </Button>
    </PDFDownloadLink>
  );
};

export default PDFGenerator;
