import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { formatDate } from "../../utils/dateFormat";

const API_URL = "http://localhost:5000";

export function LabourManager() {
  const company_id = "2f762c5e-5274-4a65-aa66-15a7642a1608";
  const godown_id = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";

  const today = new Date().toISOString().split("T")[0];

  const [labours, setLabours] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(false);

  // ============================
  // ✅ Fetch labour list
  // ============================
  const fetchLabours = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/labour/all?company_id=${company_id}&godown_id=${godown_id}`
      );
      const data = await res.json();
      if (data.success) setLabours(data.labour);
    } catch (err) {
      toast.error("Error fetching labour list");
    }
  };

  // ============================
  // ✅ Fetch attendance per date
  // ============================
  const fetchAttendanceForDate = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/attendance/by-date?company_id=${company_id}&godown_id=${godown_id}&date=${selectedDate}`
      );
      const data = await res.json();

      if (data.success) {
        const mapped = {};
        data.attendance.forEach((a) => {
          mapped[a.labour_id] = a.status;
        });
        setAttendance(mapped);
      }
    } catch (err) {
      toast.error("Error fetching attendance");
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  useEffect(() => {
    fetchAttendanceForDate();
  }, [selectedDate]);

  // ============================
  // ✅ Mark attendance
  // ============================
  const handleMarkAttendance = async (labourId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/labour/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id,
          godown_id,
          labour_id: labourId,
          date: selectedDate,
          status,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Marked ${status} successfully`);
        setAttendance((prev) => ({ ...prev, [labourId]: status }));
      } else {
        toast.error(data.error || "Cannot mark attendance");
      }
    } catch (err) {
      toast.error("Connection error");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* ------------------------------------- */}
      {/* HEADER + DATE */}
      {/* ------------------------------------- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1 text-xl">
            Labour Attendance Manager
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Mark daily attendance & auto-generate salary
          </p>
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>

      {/* ------------------------------------- */}
      {/* SUMMARY CARDS */}
      {/* ------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Labour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-600">
              {labours.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(selectedDate)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Present Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              {Object.values(attendance).filter((s) => s === "Present").length}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ------------------------------------- */}
      {/* ATTENDANCE TABLE */}
      {/* ------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance List</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Daily Wage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {labours.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      No workers available
                    </TableCell>
                  </TableRow>
                ) : (
                  labours.map((labour) => (
                    <TableRow key={labour.id}>
                      <TableCell className="font-medium">{labour.name}</TableCell>
                      <TableCell>₹{Number(labour.daily_wage).toFixed(2)}</TableCell>

                      <TableCell>
                        {attendance[labour.id] ? (
                          <span
                            className={
                              attendance[labour.id] === "Present"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {attendance[labour.id]}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not marked</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleMarkAttendance(labour.id, "Present")
                            }
                          >
                            Present
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-500"
                            onClick={() =>
                              handleMarkAttendance(labour.id, "Absent")
                            }
                          >
                            Absent
                          </Button>
                        </div>
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
