

import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Save, X } from "lucide-react";
import { formatDate } from "../../utils/dateFormat";

const EXPENSE_CATEGORIES = [
  "Miscellaneous",
  "Electricity Bill",
  "Water Bill",
  "Maintenance",
  "Labour",
  "Kabadiwala",
  "Partner",
];

export function ExpenseManager() {
  const [expenses, setExpenses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Miscellaneous",
    description: "",
    amount: "",
    transactionMode: "Cash",
    paymentTo: "",
    fromAccount: "",
  });

  const COMPANY_ID = "2f762c5e-5274-4a65-aa66-15a7642a1608";
  const GODOWN_ID = "fbf61954-4d32-4cb4-92ea-d0fe3be01311";
  const ACCOUNT_ID = "11a59a0a-bd93-41f3-bb45-ce0470a280c1";

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      category: "Miscellaneous",
      description: "",
      amount: "",
      transactionMode: "Cash",
      paymentTo: "",
      fromAccount: "",
    });
    setIsAdding(false);
    setLoading(false);
  };

  // ✅ Submit expense to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: COMPANY_ID,
          godown_id: GODOWN_ID,
          account_id: ACCOUNT_ID,
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          payment_mode: formData.transactionMode,
          paid_to: formData.paymentTo,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Expense saved successfully!");
        setExpenses((prev) => [
          {
            id: data.expense_id,
            ...formData,
            amount: parseFloat(formData.amount),
          },
          ...prev,
        ]);
        resetForm();
      } else {
        toast.error(data.error || "Failed to save expense");
      }
    } catch (err) {
      console.error("❌ Frontend Error:", err);
      toast.error("Error connecting to backend. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    toast.info("Deleted locally (not synced yet)");
  };

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily Kharch (Manager)</CardTitle>
              <CardDescription>
                Record and monitor all daily godown expenses
              </CardDescription>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-red-600 font-medium">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>

              {!isAdding && (
                <Button onClick={() => setIsAdding(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Add Expense Form */}
          {isAdding && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Add short note"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) || "",
                      })
                    }
                    required
                  />
                </div>

                {/* Payment Mode */}
                <div className="space-y-2">
                  <Label>Payment Mode</Label>
                  <Select
                    value={formData.transactionMode}
                    onValueChange={(value) =>
                      setFormData({ ...formData, transactionMode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Paid To */}
                <div className="space-y-2">
                  <Label>Paid To</Label>
                  <Input
                    placeholder="Name of person/vendor"
                    value={formData.paymentTo}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentTo: e.target.value })
                    }
                    required
                  />
                </div>

                {/* If UPI or Bank Transfer → show account field */}
                {(formData.transactionMode === "UPI" ||
                  formData.transactionMode === "Bank Transfer") && (
                  <div className="space-y-2">
                    <Label>From Account</Label>
                    <Input
                      placeholder="e.g. SBI Godown Account"
                      value={formData.fromAccount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fromAccount: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Expense"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Table Section */}
          <div className="overflow-x-auto mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount (₹)</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Paid To</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-gray-500 py-8"
                    >
                      No expenses yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell>{formatDate(exp.date)}</TableCell>
                      <TableCell>{exp.category}</TableCell>
                      <TableCell>{exp.description}</TableCell>
                      <TableCell className="text-red-600 font-medium">
                        ₹{exp.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{exp.transactionMode}</TableCell>
                      <TableCell>{exp.paymentTo}</TableCell>
                      <TableCell>
                        {exp.transactionMode === "Cash"
                          ? "-"
                          : exp.fromAccount || "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(exp.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
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
