import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription
} from "./ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "./ui/table";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Calendar, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "../utils/dateFormat";

const API_URL = "http://localhost:5000";
const COMPANY_ID = "2f762c5e-5274-4a65-aa66-15a7642a1608";
const GODOWN_ID = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";

export function KabadiwalaSection() {
  const [kabadiData, setKabadiData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  const [summary, setSummary] = useState({
    totalWeight: 0,
    totalAmount: 0,
    pending: 0,
    paid: 0,
  });

  // Fetch Kabadiwala Data For Owner
  const fetchKabadiwalaEntries = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/kabadiwala/owner-list?company_id=${COMPANY_ID}&godown_id=${GODOWN_ID}&date=${filterDate}`
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const list = data.entries || [];
      setKabadiData(list);

      // ----- Summary Calculations -----
      const totalWeight = list.reduce((s, i) => s + Number(i.weight || 0), 0);
      const totalAmount = list.reduce((s, i) => s + Number(i.amount || 0), 0);

      const paid = list
        .filter((e) => e.payment_status === "paid")
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      const pending = list
        .filter((e) => e.payment_status !== "paid")
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      setSummary({ totalWeight, totalAmount, paid, pending });

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch Kabadiwala records");
    }
  };

  useEffect(() => {
    fetchKabadiwalaEntries();
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
            Kabadiwala Purchases (Owner View)
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Read-only view of all kabadiwala transactions
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

          <Button variant="outline" onClick={fetchKabadiwalaEntries}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Weight</CardTitle></CardHeader>
          <CardContent className="text-blue-600 font-semibold">
            {summary.totalWeight} KG
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Total Amount</CardTitle></CardHeader>
          <CardContent className="text-green-600 font-semibold">
            ₹{summary.totalAmount.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Paid Amount</CardTitle></CardHeader>
          <CardContent className="text-green-700 font-semibold">
            ₹{summary.paid.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pending Amount</CardTitle></CardHeader>
          <CardContent className="text-orange-600 font-semibold">
            ₹{summary.pending.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Kabadiwala Scrap Items</CardTitle>
          <CardDescription>Each row = one material entry</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Kabadiwala</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {kabadiData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  kabadiData.map((e, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(e.date)}</TableCell>
                      <TableCell>{e.kabadi_name}</TableCell>
                      <TableCell>{e.material}</TableCell>
                      <TableCell>{e.weight} KG</TableCell>
                      <TableCell>₹{e.rate}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ₹{e.amount}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            e.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {e.payment_status.toUpperCase()}
                        </span>
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

export default KabadiwalaSection;
