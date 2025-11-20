import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, TrendingUp, Truck, PieChart as PieChartIcon, Wallet, Users, ShoppingCart } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";

// Sample data for Total Maal In with subcategories
const maalInData = [
  { 
    date: "01/11", 
    greyBoardPaper: 2275, 
    boardPaper: 1680, 
    craftPaper: 1470, 
    mixedPaper: 1225,
    plastic: 700,
    total: 7350,
    value: 647500 
  },
  { 
    date: "02/11", 
    greyBoardPaper: 2520, 
    boardPaper: 1925, 
    craftPaper: 1680, 
    mixedPaper: 1400,
    plastic: 1050,
    total: 8575,
    value: 752500 
  },
  { 
    date: "03/11", 
    greyBoardPaper: 2030, 
    boardPaper: 1540, 
    craftPaper: 1365, 
    mixedPaper: 1295,
    plastic: 700,
    total: 6930,
    value: 612500 
  },
  { 
    date: "04/11", 
    greyBoardPaper: 2800, 
    boardPaper: 2170, 
    craftPaper: 1785, 
    mixedPaper: 1470,
    plastic: 1050,
    total: 9275,
    value: 840000 
  },
  { 
    date: "05/11", 
    greyBoardPaper: 2380, 
    boardPaper: 1820, 
    craftPaper: 1575, 
    mixedPaper: 1400,
    plastic: 875,
    total: 8050,
    value: 717500 
  },
  { 
    date: "06/11", 
    greyBoardPaper: 2975, 
    boardPaper: 2275, 
    craftPaper: 1890, 
    mixedPaper: 1610,
    plastic: 1050,
    total: 9800,
    value: 910000 
  },
  { 
    date: "07/11", 
    greyBoardPaper: 3080, 
    boardPaper: 2380, 
    craftPaper: 1960, 
    mixedPaper: 1680,
    plastic: 875,
    total: 9975,
    value: 945000 
  },
];

// Sample data for Truck Loading Weight Dispatched
const truckLoadingData = [
  { date: "01/11", weight: 5200, trucks: 2 },
  { date: "02/11", weight: 7800, trucks: 3 },
  { date: "03/11", weight: 2600, trucks: 1 },
  { date: "04/11", weight: 10400, trucks: 4 },
  { date: "05/11", weight: 5200, trucks: 2 },
  { date: "06/11", weight: 7800, trucks: 3 },
  { date: "07/11", weight: 13000, trucks: 5 },
];

// Daily Expenses Data by Category
const dailyExpensesData = [
  { date: "01/11", transport: 5000, labour: 3000, fuel: 4500, maintenance: 2200, rent: 0, utilities: 1400, total: 16100 },
  { date: "02/11", transport: 4800, labour: 3200, fuel: 5000, maintenance: 1800, rent: 0, utilities: 1200, total: 16000 },
  { date: "03/11", transport: 5200, labour: 2800, fuel: 4200, maintenance: 2500, rent: 0, utilities: 1500, total: 16200 },
  { date: "04/11", transport: 5500, labour: 3500, fuel: 4800, maintenance: 2000, rent: 0, utilities: 1300, total: 17100 },
  { date: "05/11", transport: 4900, labour: 3100, fuel: 5200, maintenance: 2400, rent: 15000, utilities: 1600, total: 32200 },
  { date: "06/11", transport: 5100, labour: 2900, fuel: 4600, maintenance: 1800, rent: 0, utilities: 1400, total: 15800 },
  { date: "07/11", transport: 5300, labour: 3300, fuel: 4900, maintenance: 2300, rent: 0, utilities: 1700, total: 17500 },
];

// Expense Category Distribution (for pie chart)
const expenseCategoryData = [
  { name: "Transport", value: 35800, color: "#10b981" },
  { name: "Labour", value: 21800, color: "#3b82f6" },
  { name: "Fuel", value: 33200, color: "#f59e0b" },
  { name: "Maintenance", value: 15000, color: "#8b5cf6" },
  { name: "Rent", value: 15000, color: "#ef4444" },
  { name: "Utilities", value: 10100, color: "#06b6d4" },
];

// Feriwala vs Kabadiwala Balance
const dealerBalanceData = [
  { name: "Vijay Feriwala", balance: 15000, type: "Feriwala" },
  { name: "Krishna Feriwala", balance: 18600, type: "Feriwala" },
  { name: "Ramesh Feriwala", balance: 32000, type: "Feriwala" },
  { name: "Dinesh Feriwala", balance: 30500, type: "Feriwala" },
  { name: "Mohan Kabadi", balance: 9240, type: "Kabadiwala" },
  { name: "Rajesh Traders", balance: 6200, type: "Kabadiwala" },
  { name: "Ganesh Kabadiwala", balance: 8760, type: "Kabadiwala" },
  { name: "Prakash Scrap", balance: 6800, type: "Kabadiwala" },
];

// Cash Flow Trend
const cashFlowData = [
  { date: "01/11", cashInHand: 125000, cashInBank: 540000, total: 665000 },
  { date: "02/11", cashInHand: 132000, cashInBank: 548000, total: 680000 },
  { date: "03/11", cashInHand: 128000, cashInBank: 555000, total: 683000 },
  { date: "04/11", cashInHand: 135000, cashInBank: 560000, total: 695000 },
  { date: "05/11", cashInHand: 138000, cashInBank: 562000, total: 700000 },
  { date: "06/11", cashInHand: 142000, cashInBank: 565000, total: 707000 },
  { date: "07/11", cashInHand: 145230, cashInBank: 567890, total: 713120 },
];

// Truck Driver Balance Status
const truckDriverData = [
  { name: "Raju Driver", balance: 13000, truckNumber: "MH-12-AB-1234" },
  { name: "Shankar Driver", balance: 13200, truckNumber: "MH-14-CD-5678" },
  { name: "Amit Driver", balance: -3000, truckNumber: "MH-15-EF-9012" },
  { name: "Prakash Driver", balance: -8500, truckNumber: "MH-12-GH-3456" },
  { name: "Mohan Driver", balance: 7200, truckNumber: "MH-14-IJ-7890" },
];

// Scrap Type Distribution
const scrapTypeData = [
  { name: "Grey Board Paper", value: 17060, color: "#10b981" },
  { name: "Board Paper", value: 13790, color: "#3b82f6" },
  { name: "Craft Paper", value: 11725, color: "#f59e0b" },
  { name: "Mixed Paper", value: 10080, color: "#8b5cf6" },
  { name: "Plastic", value: 6300, color: "#ef4444" },
];

// Payment Modes Distribution
const paymentModeData = [
  { name: "Cash", value: 65, color: "#10b981" },
  { name: "UPI", value: 20, color: "#3b82f6" },
  { name: "Bank Transfer", value: 15, color: "#f59e0b" },
];

// Revenue vs Expenses
const revenueExpenseData = [
  { date: "01/11", revenue: 125000, expenses: 16100, profit: 108900 },
  { date: "02/11", revenue: 135000, expenses: 16000, profit: 119000 },
  { date: "03/11", revenue: 118000, expenses: 16200, profit: 101800 },
  { date: "04/11", revenue: 145000, expenses: 17100, profit: 127900 },
  { date: "05/11", revenue: 130000, expenses: 32200, profit: 97800 },
  { date: "06/11", revenue: 155000, expenses: 15800, profit: 139200 },
  { date: "07/11", revenue: 162000, expenses: 17500, profit: 144500 },
];

export function BusinessReports() {
  const totalMaalInWeight = maalInData.reduce((sum, item) => sum + item.total, 0);
  const totalMaalInValue = maalInData.reduce((sum, item) => sum + item.value, 0);
  const totalTruckWeight = truckLoadingData.reduce((sum, item) => sum + item.weight, 0);
  const totalTrucks = truckLoadingData.reduce((sum, item) => sum + item.trucks, 0);
  
  // Financial data
  const paymentsFromMills = 850000;
  const totalExpenses = 580000;
  const netProfit = paymentsFromMills - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">Business Reports</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Comprehensive analytics and business insights
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="flex grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Maal In (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white">
              {totalMaalInWeight.toLocaleString()} kg
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              ₹{totalMaalInValue.toLocaleString()} Value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Total Dispatched (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white">
              {totalTruckWeight.toLocaleString()} kg
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              {totalTrucks} Trucks Loaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              Net Profit (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payments from Mills</p>
                <div className="text-green-600 dark:text-green-400 text-sm">
                  ₹{paymentsFromMills.toLocaleString()}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expenses</p>
                <div className="text-red-600 dark:text-red-400 text-sm">
                  ₹{totalExpenses.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="text-green-600 dark:text-green-400">
                ₹{netProfit.toLocaleString()}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                {((netProfit / paymentsFromMills) * 100).toFixed(1)}% Margin
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Maal In Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Total Maal In (Weight Trend by Category)
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Daily scrap intake by type over the last 7 days
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={maalInData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value.toLocaleString()} kg`]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="greyBoardPaper" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Grey Board Paper"
                  dot={{ fill: '#10b981', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="boardPaper" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Board Paper"
                  dot={{ fill: '#3b82f6', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="craftPaper" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Craft Paper"
                  dot={{ fill: '#f59e0b', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mixedPaper" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Mixed Paper"
                  dot={{ fill: '#8b5cf6', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="plastic" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Plastic"
                  dot={{ fill: '#ef4444', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Truck Loading Weight Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Truck Loading Weight Dispatched
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Daily dispatch weight over the last 7 days
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={truckLoadingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => {
                    if (name === 'weight') return [`${value.toLocaleString()} kg`, 'Weight'];
                    return [value, 'Trucks'];
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="weight" 
                  fill="#3b82f6" 
                  name="Dispatch Weight"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Expenses by Category (Stacked Area Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Daily Expenses Breakdown (By Category)
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Expense trends across different categories over 7 days
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={dailyExpensesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`]}
              />
              <Legend />
              <Area type="monotone" dataKey="transport" stackId="1" stroke="#10b981" fill="#10b981" name="Transport" />
              <Area type="monotone" dataKey="labour" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Labour" />
              <Area type="monotone" dataKey="fuel" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Fuel" />
              <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Maintenance" />
              <Area type="monotone" dataKey="rent" stackId="1" stroke="#ef4444" fill="#ef4444" name="Rent" />
              <Area type="monotone" dataKey="utilities" stackId="1" stroke="#06b6d4" fill="#06b6d4" name="Utilities" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue vs Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Revenue vs Expenses Comparison
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Daily revenue, expenses, and profit analysis
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={revenueExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`]}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
              <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} name="Profit" dot={{ fill: '#3b82f6', r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Category Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Expense Category Distribution
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total expenses breakdown by category (7 days)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scrap Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Scrap Type Distribution
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total weight by scrap type (7 days)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scrapTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scrapTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `${value.toLocaleString()} kg`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cash Flow Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Cash Flow Trend
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Daily cash position tracking (7 days)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`]}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Total Cash"
                />
                <Area 
                  type="monotone" 
                  dataKey="cashInBank" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.4}
                  name="Cash in Bank"
                />
                <Area 
                  type="monotone" 
                  dataKey="cashInHand" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.4}
                  name="Cash in Hand"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Modes Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Payment Modes Distribution
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Payment method preferences (%)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feriwala vs Kabadiwala Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Dealer Balance Comparison
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Current outstanding balances (Feriwala vs Kabadiwala)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealerBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Balance (₹)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Balance']}
                />
                <Legend />
                <Bar 
                  dataKey="balance" 
                  fill="#10b981" 
                  name="Balance"
                  radius={[8, 8, 0, 0]}
                >
                  {dealerBalanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'Feriwala' ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Truck Driver Balance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Truck Driver Balance Status
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Current balance position for each driver
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={truckDriverData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Balance']}
                />
                <Bar 
                  dataKey="balance" 
                  name="Balance"
                  radius={[0, 8, 8, 0]}
                >
                  {truckDriverData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}