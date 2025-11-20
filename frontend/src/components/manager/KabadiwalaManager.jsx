// src/components/manager/KabadiwalaManager.jsx
import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Save, X } from "lucide-react";
import { formatDate } from "../../utils/dateFormat";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const COMPANY_ID = "2f762c5e-5274-4a65-aa66-15a7642a1608";
const GODOWN_ID = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";

export function KabadiwalaManager() {
  const [vendors, setVendors] = useState([]);
  const [scrapTypes, setScrapTypes] = useState([]);
  const [records, setRecords] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    vendor_id: "",
    vehicle_number: "",
    notes: "",
    scraps: [{ scrap_type_id: "", weight: "", rate: 0, amount: 0 }],
    payment_amount: 0,
    payment_mode: "cash",
    account_id: ""
  });

  useEffect(() => {
    loadVendors();
    loadScrapTypes();
    fetchList();
  }, []);

  const loadVendors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rates/vendors-with-rates`);
      const data = await res.json();

      if (data.success) {
        // only kabadiwala vendors
        const filtered = data.vendors.filter(v => v.type === "kabadiwala");
        setVendors(filtered);
      }
    } catch (err) {
      toast.error("Failed to load vendors");
    }
  };

  const loadScrapTypes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rates/global`);
      const data = await res.json();
      if (data.success) setScrapTypes(data.materials || []);
    } catch (err) {
      toast.error("Failed to load materials");
    }
  };

  const fetchList = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/kabadiwala/list?company_id=${COMPANY_ID}&godown_id=${GODOWN_ID}`
      );
      const data = await res.json();
      if (data.success) setRecords(data.kabadiwala || []);
    } catch (err) {
      toast.error("Failed to load kabadiwala records");
    }
  };

  const onVendorChange = (vendor_id) => {
    setForm(prev => ({ ...prev, vendor_id }));

    const vendor = vendors.find(v => v.vendor_id === vendor_id);
    if (!vendor) return;

    setForm(prev => ({
      ...prev,
      scraps: prev.scraps.map(row => {
        if (!row.scrap_type_id) return row;
        const r = vendor.rates.find(rr => rr.scrap_type_id === row.scrap_type_id);
        const rate = r ? Number(r.vendor_rate) : 0;
        const amount = Number(row.weight || 0) * rate;

        return { ...row, rate, amount };
      })
    }));
  };

  const addScrapRow = () => {
    setForm(prev => ({
      ...prev,
      scraps: [...prev.scraps, { scrap_type_id: "", weight: "", rate: 0, amount: 0 }]
    }));
  };

  const removeScrapRow = (idx) => {
    setForm(prev => ({
      ...prev,
      scraps: prev.scraps.filter((_, i) => i !== idx)
    }));
  };

  const onScrapChange = (idx, key, val) => {
    setForm(prev => {
      const rows = [...prev.scraps];
      rows[idx] = { ...rows[idx], [key]: val };

      const vendor = vendors.find(v => v.vendor_id === prev.vendor_id);

      // Auto rate when scrap_type_id selected
      if (key === "scrap_type_id" && vendor) {
        const rateEntry = vendor.rates.find(r => r.scrap_type_id === val);
        rows[idx].rate = rateEntry ? Number(rateEntry.vendor_rate) : 0;
      }

      // Recalculate amount
      const w = Number(rows[idx].weight || 0);
      const r = Number(rows[idx].rate || 0);
      rows[idx].amount = Number((w * r).toFixed(2));

      return { ...prev, scraps: rows };
    });
  };

  const totalAmountForm = form.scraps.reduce(
    (s, it) => s + Number(it.amount || 0), 
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.vendor_id) return toast.error("Select kabadiwala vendor");
    if (form.scraps.some(s => !s.scrap_type_id || !s.weight))
      return toast.error("Fill all scrap rows");

    try {
      const body = {
        company_id: COMPANY_ID,
        godown_id: GODOWN_ID,
        vendor_id: form.vendor_id,
        scraps: form.scraps.map(s => ({
          scrap_type_id: s.scrap_type_id,
          weight: Number(s.weight)
        })),
        payment_amount: Number(form.payment_amount || 0),
        payment_mode: form.payment_mode,
        account_id: form.account_id || null,
        date: form.date,
        note: form.notes
      };

      const res = await fetch(`${API_URL}/api/kabadiwala/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Saved");
        fetchList();
        setIsAdding(false);

        // RESET FORM
        setForm({
          date: new Date().toISOString().split("T")[0],
          vendor_id: "",
          vehicle_number: "",
          notes: "",
          scraps: [{ scrap_type_id: "", weight: "", rate: 0, amount: 0 }],
          payment_amount: 0,
          payment_mode: "cash",
          account_id: ""
        });
      } else toast.error(data.error);
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="space-y-6">

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Purchases</CardTitle></CardHeader>
          <CardContent>
            ₹{records.reduce((s, r) => s + Number(r.total_amount || 0), 0).toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Paid</CardTitle></CardHeader>
          <CardContent className="text-green-600">
            ₹{records.reduce((s, r) => s + Number(r.total_paid || 0), 0).toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pending</CardTitle></CardHeader>
          <CardContent className="text-orange-600">
            ₹{records.reduce((s, r) =>
              s + (Number(r.total_amount || 0) - Number(r.total_paid || 0)), 0
            ).toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* FORM */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Kabadiwala (Manager)</CardTitle>
              <CardDescription>Auto-rate from vendor_rates</CardDescription>
            </div>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)}>
                <Plus /> Add Record
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isAdding && (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Vendor + Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.date}
                         onChange={e => setForm({...form, date: e.target.value})} />
                </div>

                <div>
                  <Label>Select Kabadiwala</Label>
                  <select className="border p-2 rounded w-full"
                    value={form.vendor_id}
                    onChange={e => onVendorChange(e.target.value)}
                    required>
                    <option value="">-- select --</option>
                    {vendors.map(v => (
                      <option key={v.vendor_id} value={v.vendor_id}>
                        {v.vendor_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Vehicle No.</Label>
                  <Input value={form.vehicle_number}
                         onChange={e => setForm({...form, vehicle_number: e.target.value})} />
                </div>
              </div>

              {/* SCRAP ROWS */}
              <Label>Scrap Items</Label>
              {form.scraps.map((s, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center my-2">

                  {/* Material */}
                  <select className="border p-2 rounded"
                    value={s.scrap_type_id}
                    onChange={e => onScrapChange(i, 'scrap_type_id', e.target.value)}
                    required>
                    <option value="">Select material</option>
                    {scrapTypes.map(m => (
                      <option key={m.id} value={m.id}>{m.material_type}</option>
                    ))}
                  </select>

                  {/* Weight */}
                  <Input type="number" placeholder="Weight"
                    value={s.weight}
                    onChange={e => onScrapChange(i, 'weight', e.target.value)}
                    required />

                  {/* Rate auto-filled */}
                  <Input type="number" placeholder="Rate" value={s.rate} readOnly />

                  {/* Amount */}
                  <Input type="number" placeholder="Amount" value={s.amount} readOnly />

                  {/* Remove */}
                  {form.scraps.length > 1 && (
                    <Button type="button" variant="outline"
                      onClick={() => removeScrapRow(i)}>
                      <Trash2 />
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" onClick={addScrapRow}>
                <Plus /> Add More
              </Button>

              {/* PAYMENT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div><Label>Total Amount</Label>
                  <div className="p-2">₹{totalAmountForm.toLocaleString()}</div>
                </div>

                <div>
                  <Label>Initial Payment</Label>
                  <Input type="number" value={form.payment_amount}
                         onChange={e => setForm({...form, payment_amount: e.target.value})} />
                </div>

                <div>
                  <Label>Payment Mode</Label>
                  <select className="border p-2 rounded w-full"
                    value={form.payment_mode}
                    onChange={e => setForm({...form, payment_mode: e.target.value})}>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>
              </div>

              {/* SAVE */}
              <div className="flex gap-2">
                <Button type="submit"><Save /> Save</Button>
                <Button type="button" variant="outline"
                        onClick={() => setIsAdding(false)}>
                  <X /> Cancel
                </Button>
              </div>

            </form>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Pending</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No records
                    </TableCell>
                  </TableRow>
                ) : records.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{formatDate(r.date)}</TableCell>
                    <TableCell>{r.kabadiwala_name}</TableCell>

                    <TableCell>
                      {Number(r.items_count || 0)} items /
                      {Number(r.total_weight || 0).toFixed(2)} kg
                    </TableCell>

                    <TableCell>
                      ₹{Number(r.total_amount || 0).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      ₹{Number(r.total_paid || 0).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      ₹{Number((r.total_amount || 0) - (r.total_paid || 0)).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default KabadiwalaManager;
