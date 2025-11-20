import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "./ui/table";

import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";

import { Calendar, RefreshCcw } from "lucide-react";
import { formatDate } from "../utils/dateFormat";
import { toast } from "sonner";

const API_URL = "http://localhost:5000";

export default function MaalIn() {
  const [maalIn, setMaalIn] = useState([]);
  const [summary, setSummary] = useState({
    totalWeight: 0,
    totalAmount: 0,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const company_id = "2f762c5e-5274-4a65-aa66-15a7642a1608";
  const godown_id = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";

  /* ======================================================
        FETCH FROM BACKEND (REAL DATA)
  ====================================================== */
  const fetchMaalIn = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/maalin/list?company_id=${company_id}&godown_id=${godown_id}&date=${filterDate}`
      );

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to fetch Maal In");
        return;
      }

      const entries = data.maal_in;

      // Convert header-only response into detailed item rows
      let allItemRows = [];

      for (let entry of entries) {
        // Fetch items for each Maal In
        const resp = await fetch(`${API_URL}/api/maalin/${entry.id}`);
        const detail = await resp.json();

        if (detail.success) {
          detail.items.forEach((it) => {
            allItemRows.push({
              id: it.id,
              date: entry.date,
              material: it.material,
              weight: it.weight,
              rate: it.rate,
              amount: it.amount,
              supplier: entry.supplier_name,
              source: entry.source,
            });
          });
        }
      }

      setMaalIn(allItemRows);

      // SUMMARY
      const totalWeight = allItemRows.reduce(
        (s, i) => s + Number(i.weight || 0),
        0
      );
      const totalAmount = allItemRows.reduce(
        (s, i) => s + Number(i.amount || 0),
        0
      );

      setSummary({ totalWeight, totalAmount });
    } catch (err) {
      console.error(err);
      toast.error("Error loading Maal In");
    }
  };

  useEffect(() => {
    fetchMaalIn();
  }, [filterDate]);

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
      setFilterDate(date.toISOString().split("T")[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">
            Maal In Records (Owner)
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Read-only view of all Maal In entries
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

          <Button variant="outline" onClick={fetchMaalIn}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Weight</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-600 font-semibold">
            {summary.totalWeight} KG
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Amount</CardTitle>
          </CardHeader>
          <CardContent className="text-green-600 font-semibold">
            ₹{summary.totalAmount.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Maal In Details</CardTitle>
          <CardDescription>Owner view — read only</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {maalIn.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  maalIn.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{formatDate(m.date)}</TableCell>
                      <TableCell>{m.material}</TableCell>
                      <TableCell>{m.weight}</TableCell>
                      <TableCell>₹{m.rate}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ₹{m.amount}
                      </TableCell>
                      <TableCell>{m.supplier}</TableCell>
                      <TableCell>{m.source}</TableCell>
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
