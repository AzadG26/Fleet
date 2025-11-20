import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Save, X, IndianRupee } from "lucide-react";

const API_URL = "http://localhost:5000";

export function FeriwalaManager() {
  const [feriwalaRecords, setFeriwalaRecords] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [scrapTypes, setScrapTypes] = useState([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    vendor_id: "",
    scraps: [{ material: "", rate: "", weight: "", amount: "" }],
  });

  const company_id = "2f762c5e-5274-4a65-aa66-15a7642a1608";
  const godown_id = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";
  const account_id = "11a59a0a-bd93-41f3-bb45-ce0470a280c1";

  // 🟢 Load vendors & material rates
  useEffect(() => {
    loadVendors();
    loadMaterials();
    loadRecords();
  }, []);

  const loadVendors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rates/vendors-with-rates`);
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors.filter((v) => v.type === "feriwala"));
      }
    } catch (err) {
      toast.error("Failed to load vendors");
    }
  };

  const loadMaterials = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rates/global`);
      const data = await res.json();
      if (data.success) setScrapTypes(data.materials);
    } catch (err) {
      toast.error("Failed to load scrap types");
    }
  };

  const loadRecords = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/feriwala/list?company_id=${company_id}&godown_id=${godown_id}`
      );
      const data = await res.json();
      if (data.success) setFeriwalaRecords(data.records || []);
    } catch (err) {
      toast.error("Failed to load feriwala records");
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      vendor_id: "",
      scraps: [{ material: "", rate: "", weight: "", amount: "" }],
    });
    setIsAdding(false);
  };

  const handleScrapChange = (index, key, value) => {
    const updated = [...formData.scraps];
    updated[index][key] = value;

    if (key === "material") {
      const vendor = vendors.find((v) => v.vendor_id === formData.vendor_id);
      if (vendor) {
        const rateEntry = vendor.rates.find((r) => r.scrap_type_id === value);
        updated[index].rate = rateEntry ? rateEntry.vendor_rate : 0;
      }
    }

    if (key === "weight" || key === "rate") {
      const weight = parseFloat(updated[index].weight || 0);
      const rate = parseFloat(updated[index].rate || 0);
      updated[index].amount = weight * rate;
    }

    setFormData({ ...formData, scraps: updated });
  };

  const addScrapRow = () => {
    setFormData({
      ...formData,
      scraps: [...formData.scraps, { material: "", rate: "", weight: "", amount: "" }],
    });
  };

  const removeScrap = (i) => {
    const updated = formData.scraps.filter((_, idx) => idx !== i);
    setFormData({ ...formData, scraps: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = formData.scraps.reduce(
      (sum, s) => sum + Number(s.amount || 0),
      0
    );

    try {
      const res = await fetch(`${API_URL}/api/feriwala/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id,
          godown_id,
          vendor_id: formData.vendor_id,
          scraps: formData.scraps.map((s) => ({
            material_id: s.material,
            weight: Number(s.weight),
            rate: Number(s.rate),
            amount: Number(s.amount),
          })),
          account_id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Feriwala purchase added!");
        loadRecords();
        resetForm();
      } else toast.error(data.error);
    } catch (err) {
      toast.error("Server error");
    }
  };

  const totalAmount = feriwalaRecords.reduce(
    (sum, r) => sum + (r.total_amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* SUMMARY */}



   { /*  <Card>
        <CardHeader>
          <CardTitle>Total Feriwala Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl">
            ₹{totalAmount.toLocaleString()}
          </h2>
        </CardContent>
      </Card> */}



      {/* FORM */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Add Feriwala Purchase</CardTitle>
            </div>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)}>
                <Plus /> Add
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isAdding && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* VENDOR SELECT */}
              <div>
                <Label>Select Feriwala</Label>
                <select
                  className="border p-2 rounded w-full"
                  value={formData.vendor_id}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_id: e.target.value })
                  }
                >
                  <option value="">-- Select Feriwala --</option>
                  {vendors.map((v) => (
                    <option key={v.vendor_id} value={v.vendor_id}>
                      {v.vendor_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SCRAPS */}
              <Label>Scrap Items</Label>
              {formData.scraps.map((row, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-center">
                  <select
                    className="border p-2 rounded"
                    value={row.material}
                    required
                    onChange={(e) =>
                      handleScrapChange(i, "material", e.target.value)
                    }
                  >
                    <option value="">Material</option>
                    {scrapTypes.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.material_type}
                      </option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    placeholder="Weight"
                    value={row.weight}
                    onChange={(e) =>
                      handleScrapChange(i, "weight", e.target.value)
                    }
                  />

                  <Input type="number" value={row.rate} readOnly />

                  <Input type="number" value={row.amount} readOnly />

                  {formData.scraps.length > 1 && (
                    <Button type="button" onClick={() => removeScrap(i)}>
                      <Trash2 />
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" onClick={addScrapRow} variant="outline">
                <Plus /> Add More
              </Button>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save /> Save
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  <X /> Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
