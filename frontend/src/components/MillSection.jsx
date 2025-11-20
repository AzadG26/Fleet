// src/components/MillSection.jsx
import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Calendar, RefreshCcw, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { toast } from "sonner";
import { formatDate } from "../utils/dateFormat";

const API_URL = "http://localhost:5000";
const COMPANY_ID = "2f762c5e-5274-4a65-aa66-15a7642a1608";
const GODOWN_ID = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";

export function MillSection() {
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  // form state for add sale
  const [saleForm, setSaleForm] = useState({
    firm_name: "",
    bill_to: "",
    date: new Date().toISOString().split("T")[0],
    weight: 0,
    rate: 0,
    gst: 0,
    freight: 0,
    vehicle_no: "",
    payment_type: "later",
  });

  // payment form
  const [paymentForm, setPaymentForm] = useState({
    firm_name: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const fetchSales = async (date) => {
    try {
      const q = date ? `&date=${date}` : "";
      const res = await fetch(`${API_URL}/api/maalOut/list-sales?company_id=${COMPANY_ID}&godown_id=${GODOWN_ID}${q}`);
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to fetch sales");
        return;
      }
      setSales(data.sales || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch sales");
    }
  };

  const fetchPayments = async (date) => {
    try {
      const q = date ? `&date=${date}` : "";
      const res = await fetch(`${API_URL}/api/maalOut/list-payments?company_id=${COMPANY_ID}&godown_id=${GODOWN_ID}${q}`);
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to fetch payments");
        return;
      }
      setPayments(data.payments || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch payments");
    }
  };

  useEffect(() => {
    // load filtered lists
    fetchSales(filterDate);
    fetchPayments(filterDate);
  }, [filterDate]);

  const handleDateSelect = (d) => {
    if (!d) return;
    setSelectedDate(d);
    setFilterDate(d.toISOString().split("T")[0]);
  };

  // add sale
  const handleAddSale = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        company_id: COMPANY_ID,
        godown_id: GODOWN_ID,
        ...saleForm,
      };
      const res = await fetch(`${API_URL}/api/maalOut/add-sale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Sale added");
        setSaleForm({
          firm_name: "",
          bill_to: "",
          date: new Date().toISOString().split("T")[0],
          weight: 0,
          rate: 0,
          gst: 0,
          freight: 0,
          vehicle_no: "",
          payment_type: "later",
        });
        fetchSales(filterDate);
      } else {
        toast.error(data.error || "Failed to add sale");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add sale");
    }
  };

  // add payment
  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        company_id: COMPANY_ID,
        godown_id: GODOWN_ID,
        ...paymentForm,
      };
      const res = await fetch(`${API_URL}/api/maalOut/add-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Payment recorded");
        setPaymentForm({ firm_name: "", amount: 0, date: new Date().toISOString().split("T")[0] });
        fetchPayments(filterDate);
      } else {
        toast.error(data.error || "Failed to save payment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save payment");
    }
  };

  // derived summaries
  const totalSales = sales.reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalWeight = sales.reduce((s, r) => s + Number(r.weight || 0), 0);
  const paidSales = sales.filter(s => s.payment_type === "paid").reduce((s, r) => s + Number(r.amount || 0), 0);
  const pendingSales = sales.filter(s => s.payment_type === "later").reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalReceived = payments.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">Party / Mill Section</h2>
          <p className="text-gray-500 dark:text-gray-400">Owner — create sales & record payments</p>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(filterDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent mode="single" selected={selectedDate} onSelect={handleDateSelect} />
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={() => { fetchSales(filterDate); fetchPayments(filterDate); }}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Total Weight</CardTitle></CardHeader>
          <CardContent className="text-blue-600 font-semibold">{Number(totalWeight).toLocaleString()} KG</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Total Sales</CardTitle></CardHeader>
          <CardContent className="text-green-600 font-semibold">₹{Number(totalSales).toLocaleString()}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Payment Received</CardTitle></CardHeader>
          <CardContent className="text-green-700 font-semibold">₹{Number(totalReceived).toLocaleString()}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Pending</CardTitle></CardHeader>
          <CardContent className="text-orange-600 font-semibold">₹{Number(pendingSales).toLocaleString()}</CardContent>
        </Card>
      </div>

      {/* Sales Table + Add Sale Dialog */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Maal Out (Sales)</CardTitle>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Add Sale</DialogTitle></DialogHeader>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4" onSubmit={handleAddSale}>
                  <div><Label>Firm Name</Label><Input required value={saleForm.firm_name} onChange={(e)=>setSaleForm({...saleForm, firm_name: e.target.value})} /></div>
                  <div><Label>Bill To</Label><Input required value={saleForm.bill_to} onChange={(e)=>setSaleForm({...saleForm, bill_to: e.target.value})} /></div>
                  <div><Label>Date</Label><Input type="date" required value={saleForm.date} onChange={(e)=>setSaleForm({...saleForm, date: e.target.value})} /></div>
                  <div><Label>Vehicle No</Label><Input value={saleForm.vehicle_no} onChange={(e)=>setSaleForm({...saleForm, vehicle_no: e.target.value})} /></div>

                  <div><Label>Weight (kg)</Label><Input type="number" step="0.01" required value={saleForm.weight} onChange={(e)=>setSaleForm({...saleForm, weight: e.target.value})} /></div>
                  <div><Label>Rate (₹/kg)</Label><Input type="number" step="0.01" required value={saleForm.rate} onChange={(e)=>setSaleForm({...saleForm, rate: e.target.value})} /></div>

                  <div><Label>GST (₹)</Label><Input type="number" step="0.01" value={saleForm.gst} onChange={(e)=>setSaleForm({...saleForm, gst: e.target.value})} /></div>
                  <div><Label>Freight (₹)</Label><Input type="number" step="0.01" value={saleForm.freight} onChange={(e)=>setSaleForm({...saleForm, freight: e.target.value})} /></div>

                  <div>
                    <Label>Payment Type</Label>
                    <Select value={saleForm.payment_type} onValueChange={(v)=>setSaleForm({...saleForm, payment_type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="later">Pay Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <div className="p-2 bg-gray-50 rounded border">
                      <strong>Calculated Amount:</strong> ₹{(Number(saleForm.weight || 0) * Number(saleForm.rate || 0)).toLocaleString()}
                    </div>
                  </div>

                  <div className="col-span-2 flex gap-2 justify-end pt-2">
                    <Button type="submit">Save Sale</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Add Payment</DialogTitle></DialogHeader>
                <form className="space-y-3 p-4" onSubmit={handleAddPayment}>
                  <div><Label>Firm Name</Label><Input required value={paymentForm.firm_name} onChange={(e)=>setPaymentForm({...paymentForm, firm_name: e.target.value})} /></div>
                  <div><Label>Amount (₹)</Label><Input type="number" step="0.01" required value={paymentForm.amount} onChange={(e)=>setPaymentForm({...paymentForm, amount: e.target.value})} /></div>
                  <div><Label>Date</Label><Input type="date" required value={paymentForm.date} onChange={(e)=>setPaymentForm({...paymentForm, date: e.target.value})} /></div>
                  <div className="flex justify-end"><Button type="submit">Save Payment</Button></div>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="ghost"><Download className="w-4 h-4" /></Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firm</TableHead>
                  <TableHead>Bill To</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Freight</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Vehicle</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sales.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8">No sales found</TableCell></TableRow>
                ) : (
                  sales.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.firm_name}</TableCell>
                      <TableCell>{s.bill_to}</TableCell>
                      <TableCell>{formatDate(s.date)}</TableCell>
                      <TableCell>{Number(s.weight).toLocaleString()}</TableCell>
                      <TableCell>₹{Number(s.rate).toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">₹{Number(s.amount).toLocaleString()}</TableCell>
                      <TableCell>₹{Number(s.gst || 0).toLocaleString()}</TableCell>
                      <TableCell>₹{Number(s.freight || 0).toLocaleString()}</TableCell>
                      <TableCell>{s.payment_type?.toUpperCase()}</TableCell>
                      <TableCell>{s.vehicle_no || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader><CardTitle>Payments Received</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firm</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payments.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">No payments found</TableCell></TableRow>
                ) : (
                  payments.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{p.firm_name}</TableCell>
                      <TableCell className="text-green-600">₹{Number(p.amount).toLocaleString()}</TableCell>
                      <TableCell>{formatDate(p.date)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-600" /></Button>
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

export default MillSection;
