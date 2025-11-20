import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Calendar, RefreshCcw } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { toast } from "sonner";
import { formatDate } from "../utils/dateFormat";

const API_URL = "http://localhost:5000";
const COMPANY_ID = "2f762c5e-5274-4a65-aa66-15a7642a1608";
const GODOWN_ID = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";

export default function TruckDriver() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalFuel: 0,
    totalMisc: 0,
    totalPaid: 0,
    totalReturn: 0,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // =============================
  // 🔥 Fetch REAL TRUCK DATA
  // =============================
  const fetchTruckRecords = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/truck/all?company_id=${COMPANY_ID}&godown_id=${GODOWN_ID}`
      );

      const data = await res.json();
      if (!data.success) {
        toast.error("Failed to load truck records");
        return;
      }

      // Filter by date
      // Filter by date (dd/mm/yyyy match)
let list = data.trucks.filter((r) => {
  return formatDate(r.date) === formatDate(filterDate);
});

      //let list = data.trucks.filter((r) => r.date === filterDate);

      setRecords(list);

      // Summary
      const totalFuel = list.reduce((s, r) => s + Number(r.fuel_cost || 0), 0);
      const totalMisc = list.reduce((s, r) => s + Number(r.miscellaneous || 0), 0);
      const totalPaid = list.reduce((s, r) => s + Number(r.amount_paid || 0), 0);
      const totalReturn = list.reduce((s, r) => s + Number(r.return_amount || 0), 0);

      setSummary({ totalFuel, totalMisc, totalPaid, totalReturn });
    } catch (err) {
      console.error(err);
      toast.error("Error fetching truck data");
    }
  };

  useEffect(() => {
    fetchTruckRecords();
  }, [filterDate]);

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setFilterDate(date.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">
            Truck Driver Records (Owner)
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Read-only truck details added by manager
          </p>
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(filterDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={fetchTruckRecords}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Paid</CardTitle>
          </CardHeader>
          <CardContent className="text-green-600 font-bold">
            ₹{summary.totalPaid.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Fuel Cost</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-600 font-bold">
            ₹{summary.totalFuel.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Miscellaneous</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-600 font-bold">
            ₹{summary.totalMisc.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Return</CardTitle>
          </CardHeader>
          <CardContent className="text-red-600 font-bold">
            ₹{summary.totalReturn.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Truck Driver Entries</CardTitle>
          <CardDescription>Owner cannot edit or delete</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Trip</TableHead>
                  <TableHead>Fuel (₹)</TableHead>
                  <TableHead>Misc (₹)</TableHead>
                  <TableHead>Paid (₹)</TableHead>
                  <TableHead>Return (₹)</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{formatDate(r.date)}</TableCell>
                      <TableCell>{r.driver_name}</TableCell>
                      <TableCell>{r.vehicle_number}</TableCell>
                      <TableCell>{r.trip_details}</TableCell>
                      <TableCell>₹{r.fuel_cost}</TableCell>
                      <TableCell>₹{r.miscellaneous}</TableCell>
                      <TableCell className="text-green-600">
                        ₹{r.amount_paid}
                      </TableCell>
                      <TableCell className="text-blue-600 font-bold">
                        ₹{r.return_amount}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
