import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";

const API_URL = "http://localhost:5000";

export function MaalInManager() {
  const today = new Date().toISOString().split("T")[0];

  const company_id = "2f762c5e-5274-4a65-aa66-15a7642a1608";
  const godown_id = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";

  // Header form
  const [header, setHeader] = useState({
    date: today,
    supplier_name: "",
    source: "kabadiwala",
    vehicle_number: "",
    notes: "",
    created_by: "manager"
  });

  // Items list
  const [items, setItems] = useState([
    { material: "", weight: "", rate: "", amount: 0 }
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "weight" || field === "rate") {
      const w = Number(updated[index].weight) || 0;
      const r = Number(updated[index].rate) || 0;
      updated[index].amount = w * r;
    }

    setItems(updated);
  };

  const addNewItemRow = () => {
    setItems([...items, { material: "", weight: "", rate: "", amount: 0 }]);
  };

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const totalAmount = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  /* ===================================================
        SUBMIT FINAL MAAL IN ENTRY
  =================================================== */
  const handleSubmit = async () => {
    if (!header.supplier_name) return toast.error("Supplier name required");

    if (items.some(i => !i.material || !i.weight || !i.rate)) {
      return toast.error("Please fill all item fields");
    }

    try {
      // Step 1 → Create header
      const res1 = await fetch(`${API_URL}/api/maalin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...header,
          company_id,
          godown_id
        })
      });

      const data1 = await res1.json();

      if (!data1.success) throw new Error(data1.error);

      const maal_in_id = data1.maal_in.id;

      // Step 2 → Insert items
      const res2 = await fetch(`${API_URL}/api/maalin/${maal_in_id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });

      const data2 = await res2.json();

      if (!data2.success) throw new Error(data2.error);

      toast.success("Maal In saved successfully!");

      // Reset form
      setHeader({
        date: today,
        supplier_name: "",
        source: "kabadiwala",
        vehicle_number: "",
        notes: "",
        created_by: "manager"
      });

      setItems([{ material: "", weight: "", rate: "", amount: 0 }]);

    } catch (err) {
      toast.error("Failed to save Maal In");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maal In (Manager)</CardTitle>
          <CardDescription>Enter supplier details & scrap items</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* HEADER FORM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={header.date}
                onChange={(e) => setHeader({ ...header, date: e.target.value })}
              />
            </div>

            <div>
              <Label>Supplier Name *</Label>
              <Input
                value={header.supplier_name}
                onChange={(e) => setHeader({ ...header, supplier_name: e.target.value })}
                placeholder="Kabadiwala / Customer / Factory"
              />
            </div>

            <div>
              <Label>Source</Label>
              <Select
                value={header.source}
                onValueChange={(v) => setHeader({ ...header, source: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="kabadiwala">Kabadiwala</SelectItem>
                  <SelectItem value="factory">Factory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Vehicle Number</Label>
              <Input
                value={header.vehicle_number}
                onChange={(e) => setHeader({ ...header, vehicle_number: e.target.value })}
                placeholder="RJ 14 XX XXXX"
              />
            </div>

          </div>

          {/* ITEMS TABLE */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Scrap Items</CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Rate (₹)</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Input
                          value={it.material}
                          onChange={(e) => handleItemChange(idx, "material", e.target.value)}
                          placeholder="Iron / Plastic / etc."
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          value={it.weight}
                          onChange={(e) => handleItemChange(idx, "weight", e.target.value)}
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          value={it.rate}
                          onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                        />
                      </TableCell>

                      <TableCell className="font-semibold">₹{it.amount}</TableCell>

                      <TableCell>
                        {idx > 0 && (
                          <Button variant="destructive" size="icon" onClick={() => removeItem(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button className="mt-4" onClick={addNewItemRow}>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </CardContent>
          </Card>

          {/* TOTAL + SUBMIT */}
          <div className="text-xl font-bold mt-4">
            Total: <span className="text-green-600">₹{totalAmount}</span>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            <Save className="w-4 h-4 mr-2" /> Save Maal In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
