import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DashboardOverview } from "./components/DashboardOverview";
import { DailyDataBook } from "./components/DailyDataBook";

import TruckDriver from "./components/TruckDriver";   // ✅ default export
import MaalIn from "./components/MaalIn";             // ✅ default export

import { RokadiUpdate } from "./components/RokadiUpdate";
import { BankAccount } from "./components/BankAccount";
import { FeriwalaSection } from "./components/FeriwalaSection";
import { LabourSection } from "./components/LabourSection";
import KabadiwalaSection from "./components/KabadiwalaSection";
import { PartnershipAccount } from "./components/PartnershipAccount";
import { BusinessReports } from "./components/BusinessReports";
import { MillSection } from "./components/MillSection";
import RatesUpdate  from "./components/RatesUpdate";
import { ManagerDashboard } from "./components/manager/ManagerDashboard";

import { Login } from "./components/Login";
import { Toaster } from "./components/ui/sonner";

import { AuthProvider, useAuth } from "./utils/authContext";
import { DataProvider } from "./utils/dataContext";

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  // Set default dashboard after login
  useEffect(() => {
    if (user?.role === "manager") {
      setActiveSection("manager-dashboard");
    } else if (user?.role === "owner") {
      setActiveSection("dashboard");
    }
  }, [user]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  // ============================
  //  OWNER SECTION ROUTING
  // ============================
  const renderActiveSection = () => {
    if (user?.role === "manager") {
      return <ManagerDashboard />;
    }

    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;

      case "daily-book":
        return <DailyDataBook />;

      case "maal-in":                    // ✅ corrected
        return <MaalIn />;

      case "truck-driver":               // ✅ corrected
        return <TruckDriver />;

      case "rokadi":
        return <RokadiUpdate />;

      case "bank":
        return <BankAccount />;

      case "labour":
        return <LabourSection />;

      case "feriwala":
        return <FeriwalaSection />;

      case "kabadiwala":
        return <KabadiwalaSection />;

      case "partnership":
        return <PartnershipAccount />;

      case "rates-update":
        return <RatesUpdate />;

      case "business-reports":
        return <BusinessReports />;

      case "mill":
        return <MillSection />;

      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        
        {/* Header */}
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar for Owner Only */}
          {user?.role === "owner" && (
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {renderActiveSection()}
          </main>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
