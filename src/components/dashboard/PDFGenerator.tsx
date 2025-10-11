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

  // Construct detailedReport object
  const detailedReport: DetailedReport = {
    executiveSummary: userData.executiveSummary!,
    tariffAnalysis: userData.tariffAnalysis!,
    consumptionAnalytics: userData.consumptionAnalytics!,
    solarAnalysis: userData.solarAnalysis || null,
    smartDevicesAnalysis: userData.smartDevicesAnalysis || { installedDevices: [], missingDevices: [] },
    recommendations: userData.recommendations || [],
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

  if (!userData.executiveSummary || !userData.tariffAnalysis || !userData.consumptionAnalytics) {
    return (
      <Button className="bg-red-600 text-white hover:bg-red-700" disabled>
        <div className="flex items-center">
          <AlertCircle className="mr-2 h-4 w-4" />
          Missing required data
        </div>
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <PDFReport
          user={user}
          userData={userData}
          detailedReport={detailedReport} // pass the combined object
        />
      }
      fileName={`energy-report-${new Date().toISOString().split('T')[0]}.pdf`}
      onClick={handleDownload}
      onError={handleDownloadError}
    >
      {({ loading, error, blob, url }) => {
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

        if (blob && url) {
          handleDownloadComplete();
        }

        return (
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={loading || isDownloading}
          >
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
