import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Plus,
  Edit,
  Bell,
  TrendingUp,
  TrendingDown,
  Minus,
  UserPlus,
  Users,
  Save,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "../utils/currencyFormat";

const API = process.env.REACT_APP_API_URL || "https://gd-2-0-clean.onrender.com/";

export default function RatesUpdate() {
  // data
  const [materials, setMaterials] = useState([]); // global scrap_types
  const [vendors, setVendors] = useState([]); // vendors with rates
  const [loading, setLoading] = useState(false);

  // add material dialog
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ materialType: "", baseRate: "" });

  // edit global rate dialog
  const [editMaterialOpen, setEditMaterialOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newGlobalRate, setNewGlobalRate] = useState("");

  // add vendor dialog
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", vendorType: "feriwala" });

  // set vendor rate dialog
  const [setVendorRateOpen, setSetVendorRateOpen] = useState(false);
  const [selectedVendorForRate, setSelectedVendorForRate] = useState(null);
  const [selectedScrapForRate, setSelectedScrapForRate] = useState("");
  const [vendorRateValue, setVendorRateValue] = useState("");

  // small helpers
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mRes, vRes] = await Promise.all([
        fetch(`${API}/api/rates/global`),
        fetch(`${API}/api/rates/vendors-with-rates`),
      ]);
      const mJson = await mRes.json();
      const vJson = await vRes.json();

      if (mRes.ok) setMaterials(mJson.materials || []);
      else toast.error(mJson.error || "Failed to load materials");

      if (vRes.ok) setVendors(vJson.vendors || []);
      else toast.error(vJson.error || "Failed to load vendors");
    } catch (err) {
      toast.error("Failed to fetch rate data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Derived stats
  const averageRate =
    materials.length > 0
      ? materials.reduce((s, m) => s + Number(m.global_rate || 0), 0) / materials.length
      : 0;

  const lastUpdated =
    materials.length > 0
      ? new Date(Math.max(...materials.map((m) => new Date(m.last_updated).getTime()))).toLocaleDateString("en-IN")
      : "N/A";

  // Add material
  const handleAddMaterial = async () => {
    if (!newMaterial.materialType.trim() || Number(newMaterial.baseRate) <= 0) {
      toast.error("Enter valid material name and base rate");
      return;
    }
    try {
      const res = await fetch(`${API}/api/rates/add-material`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material_type: newMaterial.materialType.trim(),
          base_rate: Number(newMaterial.baseRate),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to add");
      toast.success("Material added");
      setAddMaterialOpen(false);
      setNewMaterial({ materialType: "", baseRate: "" });
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to add material");
    }
  };

  // Update global
  const handleUpdateGlobal = async () => {
    if (!editingMaterial || Number(newGlobalRate) <= 0) {
      toast.error("Enter a valid new global rate");
      return;
    }
    try {
      const res = await fetch(`${API}/api/rates/update-global`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scrap_type_id: editingMaterial.id,
          new_global_rate: Number(newGlobalRate),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to update global rate");
      toast.success("Global rate updated and vendor rates adjusted");
      setEditMaterialOpen(false);
      setEditingMaterial(null);
      setNewGlobalRate("");
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to update global rate");
    }
  };

  // Add vendor
  const handleAddVendor = async () => {
    if (!newVendor.name.trim() || !newVendor.vendorType) {
      toast.error("Enter vendor name and type");
      return;
    }
    try {
      const res = await fetch(`${API}/api/rates/add-vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newVendor.name.trim(),
          vendor_type: newVendor.vendorType,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to add vendor");
      toast.success("Vendor added");
      setAddVendorOpen(false);
      setNewVendor({ name: "", vendorType: "feriwala" });
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to add vendor");
    }
  };

  // Set vendor rate (insert or update)
  const handleSetVendorRate = async () => {
    if (!selectedVendorForRate || !selectedScrapForRate || Number(vendorRateValue) <= 0) {
      toast.error("Select vendor, material and enter a valid rate");
      return;
    }
    try {
      const res = await fetch(`${API}/api/rates/set-vendor-rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_id: selectedVendorForRate.vendor_id,
          scrap_type_id: selectedScrapForRate,
          vendor_rate: Number(vendorRateValue),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to set vendor rate");
      toast.success("Vendor rate saved");
      setSetVendorRateOpen(false);
      setSelectedVendorForRate(null);
      setSelectedScrapForRate("");
      setVendorRateValue("");
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to set vendor rate");
    }
  };

  // helper to open set-vendor-rate modal with vendor
  const openSetRateModal = (vendor) => {
    setSelectedVendorForRate(vendor);
    setSetVendorRateOpen(true);
  };

  // small UI helpers
  const getRateChange = (mat) => {
    // Optional: compute difference vs previous / demo
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">Material Rates Update</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Maintain global rates and vendor-specific rates (feriwala / kabadiwala).
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => fetchAll()} variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setAddMaterialOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Material
          </Button>
          <Dialog open={addVendorOpen} onOpenChange={setAddVendorOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" variant="outline">
                <UserPlus className="h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vendor</DialogTitle>
                <DialogDescription>Add a feriwala or kabadiwala</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-4">
                <div>
                  <Label>Vendor Name</Label>
                  <Input
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    placeholder="Vendor name"
                  />
                </div>
                <div>
                  <Label>Vendor Type</Label>
                  <Select value={newVendor.vendorType} onValueChange={(v) => setNewVendor({ ...newVendor, vendorType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feriwala">Feriwala (street collector)</SelectItem>
                      <SelectItem value="kabadiwala">Kabadiwala (scrap dealer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddVendorOpen(false)}>Cancel</Button>
                <Button onClick={handleAddVendor}>Add Vendor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{formatINR(averageRate)}/kg</div>
            <p className="text-xs text-gray-500 mt-1">Across {materials.length} materials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">{materials.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active scrap types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-purple-600">{lastUpdated}</div>
            <p className="text-xs text-gray-500 mt-1">Most recent global update</p>
          </CardContent>
        </Card>
      </div>

      {/* GLOBAL RATES TABLE */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Global Material Rates</CardTitle>
              <CardDescription>Update global base rates here. Vendor rates will adjust keeping their offset.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAddMaterialOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Material
              </Button>
              <Button variant="outline" onClick={() => { toast("Use edit button on each row to change rate"); }}>
                <Bell className="h-4 w-4" /> Notify Vendors
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Global Rate (₹/kg)</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Change</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">No materials</TableCell>
                </TableRow>
              ) : (
                materials.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.material_type}</TableCell>
                    <TableCell className="font-semibold">{formatINR(m.global_rate)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{new Date(m.last_updated).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>
                      {/* placeholder change badge */}
                      <Badge variant="outline"> {getRateChange(m) >= 0 ? <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" /> ₹{getRateChange(m)}/kg</span> : <span className="inline-flex items-center gap-1"><TrendingDown className="h-3 w-3" /> ₹{getRateChange(m)}/kg</span>} </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingMaterial(m); setNewGlobalRate(m.global_rate); setEditMaterialOpen(true); }}>
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* VENDORS + RATES */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vendors & Their Rates</CardTitle>
              <CardDescription>Assign and view per-vendor rates for each material</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rates</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">No vendors</TableCell>
                </TableRow>
              ) : (
                vendors.map((v) => (
                  <TableRow key={v.vendor_id}>
                    <TableCell>{v.vendor_name}</TableCell>
                    <TableCell className="capitalize">{v.type}</TableCell>
                    <TableCell>
                      {v.rates.length === 0 ? (
                        <span className="text-sm text-gray-500">No rates set</span>
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          {v.rates.map((r) => (
                            <Badge key={r.scrap_type_id} className="gap-2">
                              {r.scrap_type}: ₹{formatINR(r.vendor_rate)} ({r.rate_offset >= 0 ? `+${formatINR(r.rate_offset)}` : formatINR(r.rate_offset)})
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => openSetRateModal(v)}>
                        <Save className="h-4 w-4" /> Set Rate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIALOGS */}

      {/* Add Material Dialog */}
      <Dialog open={addMaterialOpen} onOpenChange={setAddMaterialOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Material</DialogTitle>
            <DialogDescription>Add a new scrap material and global base rate</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Material Type</Label>
              <Input value={newMaterial.materialType} onChange={(e) => setNewMaterial({ ...newMaterial, materialType: e.target.value })} placeholder="Iron, Plastic..." />
            </div>
            <div>
              <Label>Base Rate (₹/kg)</Label>
              <Input type="number" value={newMaterial.baseRate} onChange={(e) => setNewMaterial({ ...newMaterial, baseRate: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMaterialOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMaterial}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Global Rate Dialog */}
      <Dialog open={editMaterialOpen} onOpenChange={setEditMaterialOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Global Rate</DialogTitle>
            <DialogDescription>Change global rate; vendor rates will be adjusted preserving offsets.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Material</Label>
              <Input value={editingMaterial?.material_type || ""} disabled />
            </div>
            <div>
              <Label>New Global Rate (₹/kg)</Label>
              <Input type="number" value={newGlobalRate} onChange={(e) => setNewGlobalRate(e.target.value)} />
              <p className="text-xs text-gray-500 mt-1">Current: ₹{formatINR(editingMaterial?.global_rate || 0)}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMaterialOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateGlobal}>Update Global</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Vendor Rate Dialog */}
      <Dialog open={setVendorRateOpen} onOpenChange={setSetVendorRateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Vendor Rate</DialogTitle>
            <DialogDescription>Choose material and enter vendor-specific rate</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Vendor</Label>
              <Input value={selectedVendorForRate?.vendor_name || ""} disabled />
            </div>

            <div>
              <Label>Material</Label>
              <Select value={selectedScrapForRate} onValueChange={(v) => setSelectedScrapForRate(v)}>
                <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                <SelectContent>
                  {materials.map((m) => <SelectItem key={m.id} value={m.id}>{m.material_type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Vendor Rate (₹/kg)</Label>
              <Input type="number" value={vendorRateValue} onChange={(e) => setVendorRateValue(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSetVendorRateOpen(false)}>Cancel</Button>
            <Button onClick={handleSetVendorRate}>Save Rate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
