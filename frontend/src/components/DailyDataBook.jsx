import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "./ui/table";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "./ui/tabs";
import {
  Popover, PopoverContent, PopoverTrigger
} from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Calendar, Download, RefreshCcw } from "lucide-react";
import { formatDate, getTodayISO } from "../utils/dateFormat";
import { toast } from "sonner";

export function DailyDataBook() {
  const today = getTodayISO();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(today);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Config
  // const API_URL = "http://localhost:5000";
  const API_URL = "https://gd-2-0-clean.onrender.com/";
  const COMPANY_ID = "2f762c5e-5274-4a65-aa66-15a7642a1608";
  const GODOWN_ID = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";

  /** 🔹 Fetch Daily Expenses */
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/expenses/list?company_id=${COMPANY_ID}&godown_id=${GODOWN_ID}&date=${filterDate}`
      );
      const data = await res.json();
      if (data.success) {
        setExpenses(data.expenses || []);
      } else toast.error("Failed to fetch expenses");
    } catch (err) {
      toast.error("Error fetching expenses: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Fetch Summary */
  const fetchSummary = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/expenses/summary?company_id=${COMPANY_ID}&godown_id=${GODOWN_ID}&start_date=${filterDate}&end_date=${filterDate}`
      );
      const data = await res.json();
      if (data.success) setSummary(data.summary);
    } catch (err) {
      console.error(err);
    }
  };

  /** 🔹 Auto-fetch when date changes */
  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filterDate]);

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
      setFilterDate(date.toISOString().split("T")[0]);
    }
  };

  const totalExpense = summary ? Number(summary.total_amount || 0) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">Daily Data Book (Owner)</h2>
          <p className="text-gray-500 dark:text-gray-400">
            View all godown daily expenses entered by manager
          </p>
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                {filterDate === today ? "Today" : formatDate(filterDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={() => {
              fetchExpenses();
              fetchSummary();
              toast.success("Refreshed");
            }}
            variant="outline"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>

          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">
              Total Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white text-lg font-semibold">
              ₹{totalExpense.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">
              Cash Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white">
              ₹{Number(summary?.total_cash || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">
              UPI Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white">
              ₹{Number(summary?.total_upi || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">
              Bank Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white">
              ₹{Number(summary?.total_bank || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="expense" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="expense">Daily Expenses</TabsTrigger>
          </TabsList>
        </div>

        {/* Expense List */}
        <TabsContent value="expense">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expenses — {formatDate(filterDate)}</CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p className="text-gray-500 text-center py-6">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Paid To</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Entered By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.length > 0 ? (
                        expenses.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell>{formatDate(e.date)}</TableCell>
                            <TableCell>{e.category}</TableCell>
                            <TableCell>{e.description}</TableCell>
                            <TableCell>{e.paid_to}</TableCell>
                            <TableCell>{e.payment_mode}</TableCell>
                            <TableCell className="text-red-600 font-semibold">
                              ₹{Number(e.amount).toLocaleString()}
                            </TableCell>
                            <TableCell>{e.account_name || "-"}</TableCell>
                            <TableCell>{e.created_by_name || "Manager"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                            No expenses found for this date
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
