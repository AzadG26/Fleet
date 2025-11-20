import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  LogOut,
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  Bell,
  ChartLine,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "../utils/authContext";
import { useData } from "../utils/dataContext";
import { formatINR } from "../utils/currencyFormat";

export function DashboardOverview() {
  const { user, logout } = useAuth();
  const {
    rokadiAccounts,
    bankAccounts,
    maalInRecords,
    kabadiwalaTransactions,
    workers,
  } = useData();

  const [viewMode, setViewMode] = useState("daily");
  const [outwardViewMode, setOutwardViewMode] = useState("daily");
  const [selectedChart, setSelectedChart] = useState(null);

  // Calculate total cash in hand (Rokadi)
  const totalCashInHand = useMemo(() => {
    return rokadiAccounts.reduce((sum, account) => sum + account.balance, 0);
  }, [rokadiAccounts]);

  // Calculate total bank balance
  const totalBankBalance = useMemo(() => {
    return bankAccounts.reduce(
      (sum, account) => sum + account.currentBalance,
      0
    );
  }, [bankAccounts]);

  // Calculate scrap inward metrics
  const scrapInwardMetrics = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const dailyInward = maalInRecords
      .filter((record) => record.date === todayStr)
      .reduce((sum, record) => {
        const weight =
          record.unit === "tons" ? record.quantity : record.quantity / 1000;
        return sum + weight;
      }, 0);

    const monthlyInward = maalInRecords
      .filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getMonth() === currentMonth &&
          recordDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, record) => {
        const weight =
          record.unit === "tons" ? record.quantity : record.quantity / 1000;
        return sum + weight;
      }, 0);

    return { dailyInward, monthlyInward };
  }, [maalInRecords]);

  // Calculate scrap outward metrics
  const scrapOutwardMetrics = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const dailyOutward = kabadiwalaTransactions
      .filter((record) => record.date === todayStr)
      .reduce((sum, record) => {
        const weight =
          record.unit === "tons" ? record.quantity : record.quantity / 1000;
        return sum + weight;
      }, 0);

    const monthlyOutward = kabadiwalaTransactions
      .filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getMonth() === currentMonth &&
          recordDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, record) => {
        const weight =
          record.unit === "tons" ? record.quantity : record.quantity / 1000;
        return sum + weight;
      }, 0);

    return { dailyOutward, monthlyOutward };
  }, [kabadiwalaTransactions]);

  // Get upcoming loan deductions
  const upcomingLoanDeductions = useMemo(() => {
    const deductions = [];

    workers.forEach((worker) => {
      if (worker.loanDeductions && worker.loanDeductions.length > 0) {
        worker.loanDeductions.forEach((deduction) => {
          const dueDate = new Date(deduction.dueDate);
          const today = new Date();
          const daysUntilDue = Math.ceil(
            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Show deductions due within next 7 days
          if (daysUntilDue >= 0 && daysUntilDue <= 7) {
            deductions.push({
              workerName: worker.name,
              amount: deduction.amount,
              dueDate: deduction.dueDate,
              description: deduction.description,
            });
          }
        });
      }
    });

    return deductions.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [workers]);

  // Sample chart data
  const inwardTrendData = [
    { date: "Nov 1", weight: 0.65 },
    { date: "Nov 2", weight: 0.72 },
    { date: "Nov 3", weight: 0.58 },
    { date: "Nov 4", weight: 0.81 },
    { date: "Nov 5", weight: 0.69 },
    { date: "Nov 6", weight: 0.77 },
    { date: "Nov 7", weight: 0.84 },
  ];

  const outwardTrendData = [
    { date: "Nov 1", weight: 0.55 },
    { date: "Nov 2", weight: 0.63 },
    { date: "Nov 3", weight: 0.48 },
    { date: "Nov 4", weight: 0.71 },
    { date: "Nov 5", weight: 0.59 },
    { date: "Nov 6", weight: 0.67 },
    { date: "Nov 7", weight: 0.74 },
  ];

  const cashFlowData = [
    { month: "May", cashIn: 145, cashOut: 120, bankIn: 280, bankOut: 250 },
    { month: "Jun", cashIn: 158, cashOut: 135, bankIn: 310, bankOut: 280 },
    { month: "Jul", cashIn: 142, cashOut: 128, bankIn: 295, bankOut: 265 },
    { month: "Aug", cashIn: 165, cashOut: 142, bankIn: 320, bankOut: 290 },
    { month: "Sep", cashIn: 152, cashOut: 138, bankIn: 305, bankOut: 275 },
    { month: "Oct", cashIn: 170, cashOut: 145, bankIn: 330, bankOut: 300 },
    { month: "Nov", cashIn: 163, cashOut: 140, bankIn: 315, bankOut: 285 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">
            Business Snapshot
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 dark:text-gray-400">
              Complete financial overview & operations metrics
            </p>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">
              Live Data
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            defaultValue={new Date().toISOString().split("T")[0]}
          />

          {/* Loan Deductions Notification Bell */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {upcomingLoanDeductions.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {upcomingLoanDeductions.length}
                  </span>
                )}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <h4 className="font-semibold">Upcoming Loan Deductions</h4>
                </div>
                {upcomingLoanDeductions.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No upcoming deductions
                  </p>
                ) : (
                  <div className="space-y-2">
                    {upcomingLoanDeductions.map((deduction, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm">{deduction.workerName}</p>
                          <Badge variant="destructive" className="text-xs">
                            {formatINR(deduction.amount)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {deduction.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due:{" "}
                          {new Date(
                            deduction.dueDate
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* Profile Section */}
          <Card className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">
                      Owner
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {user?.email}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Cards and Charts Continue Below... */}
      {/* Main Metrics Grid */}
      <div className="flex grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Scrap Inward Card */}
        <Card className="relative group border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex-1">
              <CardTitle className="text-green-600 dark:text-green-400">Scrap Inward</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant={viewMode === 'daily' ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setViewMode('daily')}
                >
                  Daily
                </Button>
                <Button
                  variant={viewMode === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setViewMode('monthly')}
                >
                  Monthly
                </Button>
              </div>
            </div>
            <ArrowDownCircle className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-black dark:text-white mb-1">
              {viewMode === 'daily' 
                ? `${scrapInwardMetrics.dailyInward.toFixed(2)} Tons` 
                : `${scrapInwardMetrics.monthlyInward.toFixed(2)} Tons`}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
              {viewMode === 'daily' ? 'Today\'s Collection' : 'This Month\'s Collection'}
            </p>
            
            <Dialog open={selectedChart === 'inward'} onOpenChange={(open) => setSelectedChart(open ? 'inward' : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ChartLine className="w-3 h-3" />
                  View Trend
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Scrap Inward Trend - Last 7 Days</DialogTitle>
                </DialogHeader>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={inwardTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#16a34a" strokeWidth={2} name="Scrap Inward (Tons)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Total Scrap Outward Card */}
        <Card className="relative group border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex-1">
              <CardTitle className="text-blue-600 dark:text-blue-400">Scrap Outward</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant={outwardViewMode === 'daily' ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setOutwardViewMode('daily')}
                >
                  Daily
                </Button>
                <Button
                  variant={outwardViewMode === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setOutwardViewMode('monthly')}
                >
                  Monthly
                </Button>
              </div>
            </div>
            <ArrowUpCircle className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-black dark:text-white mb-1">
              {outwardViewMode === 'daily' 
                ? `${scrapOutwardMetrics.dailyOutward.toFixed(2)} Tons` 
                : `${scrapOutwardMetrics.monthlyOutward.toFixed(2)} Tons`}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
              {outwardViewMode === 'daily' ? 'Today\'s Dispatch' : 'This Month\'s Dispatch'}
            </p>
            
            <Dialog open={selectedChart === 'outward'} onOpenChange={(open) => setSelectedChart(open ? 'outward' : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ChartLine className="w-3 h-3" />
                  View Trend
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Scrap Outward Trend - Last 7 Days</DialogTitle>
                </DialogHeader>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={outwardTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} name="Scrap Outward (Tons)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Cash in Hand (Rokadi) Card */}
        <Card className="relative group border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-orange-600 dark:text-orange-400">Cash in Hand</CardTitle>
              <span className="text-xs text-gray-400 dark:text-gray-500">Rokadi Balance</span>
            </div>
            <Wallet className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-black dark:text-white mb-1">
              {formatINR(totalCashInHand)}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
              Across {rokadiAccounts.length} cash account{rokadiAccounts.length !== 1 ? 's' : ''}
            </p>
            
            {/* Account breakdown on hover */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <TrendingUp className="w-3 h-3" />
                  View Breakdown
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-72">
                <div className="space-y-2">
                  <h4 className="font-semibold mb-2">Cash Accounts</h4>
                  {rokadiAccounts.map(account => (
                    <div key={account.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{account.accountName}</span>
                      <span className="text-sm">{formatINR(account.balance)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t flex justify-between items-center">
                    <span className="text-sm">Total</span>
                    <span className="text-sm">{formatINR(totalCashInHand)}</span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardContent>
        </Card>

        {/* Bank Balance Summary Card */}
        <Card className="relative group border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-purple-600 dark:text-purple-400">Bank Balance</CardTitle>
              <span className="text-xs text-gray-400 dark:text-gray-500">All Accounts</span>
            </div>
            <Building2 className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-black dark:text-white mb-1">
              {formatINR(totalBankBalance)}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
              Across {bankAccounts.length} bank account{bankAccounts.length !== 1 ? 's' : ''}
            </p>
            
            {/* Account breakdown on hover */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <TrendingUp className="w-3 h-3" />
                  View Breakdown
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold mb-2">Bank Accounts</h4>
                  {bankAccounts.length === 0 ? (
                    <p className="text-sm text-gray-500">No bank accounts added</p>
                  ) : (
                    <>
                      {bankAccounts.map(account => (
                        <div key={account.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="text-sm">{account.bankName}</span>
                              <p className="text-xs text-gray-500">****{account.accountNumber.slice(-4)}</p>
                            </div>
                            <span className="text-sm">{formatINR(account.currentBalance)}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{account.accountType}</Badge>
                        </div>
                      ))}
                      <div className="pt-2 border-t flex justify-between items-center">
                        <span className="text-sm">Total Balance</span>
                        <span className="text-sm">{formatINR(totalBankBalance)}</span>
                      </div>
                    </>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Cash Flow Analysis</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monthly cash and bank transactions overview
              </p>
            </div>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: '₹ (Thousands)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value) => formatINR(value * 1000)}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar dataKey="cashIn" fill="#16a34a" name="Cash In" />
                <Bar dataKey="cashOut" fill="#dc2626" name="Cash Out" />
                <Bar dataKey="bankIn" fill="#2563eb" name="Bank In" />
                <Bar dataKey="bankOut" fill="#f59e0b" name="Bank Out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
