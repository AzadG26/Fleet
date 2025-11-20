import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Download, Pencil, Trash2, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { formatDate } from "../utils/dateFormat";

export function PartnershipAccount() {
  const getMonthlyWithdrawals = (withdrawals) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return withdrawals.filter((w) => {
      const withdrawalDate = new Date(w.date);
      return withdrawalDate >= thirtyDaysAgo;
    });
  };

  const [partners, setPartners] = useState([
    {
      id: "1",
      name: "Rajesh Kumar",
      withdrawals: [
        { amount: 25000, date: "2025-11-06", mode: "UPI" },
        { amount: 15000, date: "2025-11-01", mode: "Cash" },
        { amount: 20000, date: "2025-10-28", mode: "UPI" },
        { amount: 18000, date: "2025-10-25", mode: "Cash" },
        { amount: 22000, date: "2025-10-20", mode: "UPI" },
        { amount: 17000, date: "2025-10-15", mode: "Cash" },
        { amount: 23000, date: "2025-10-10", mode: "UPI" },
        { amount: 19000, date: "2025-10-05", mode: "Cash" },
      ],
      totalWithdrawn: 159000,
    },
    {
      id: "2",
      name: "Amit Sharma",
      withdrawals: [
        { amount: 30000, date: "2025-11-05", mode: "Cash" },
        { amount: 20000, date: "2025-10-28", mode: "UPI" },
        { amount: 25000, date: "2025-10-22", mode: "Cash" },
        { amount: 18000, date: "2025-10-18", mode: "UPI" },
        { amount: 21000, date: "2025-10-12", mode: "Cash" },
        { amount: 24000, date: "2025-10-08", mode: "UPI" },
        { amount: 19000, date: "2025-10-03", mode: "Cash" },
      ],
      totalWithdrawn: 157000,
    },
  ]);

  const totalWithdrawn = partners.reduce((sum, p) => sum + p.totalWithdrawn, 0);

  const monthlyWithdrawals = partners.reduce((sum, p) => {
    const monthly = getMonthlyWithdrawals(p.withdrawals);
    return sum + monthly.reduce((s, w) => s + w.amount, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">Partnership Account</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage partner withdrawals</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Partner Name</Label>
                  <Input placeholder="Enter partner name" />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">Add Partner</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">Total Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white">{partners.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white">₹{totalWithdrawn.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">This Month (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-600">₹{monthlyWithdrawals.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map((partner) => {
          const monthlyData = getMonthlyWithdrawals(partner.withdrawals);
          const monthlyTotal = monthlyData.reduce((sum, w) => sum + w.amount, 0);

          return (
            <Card key={partner.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        <Users className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-gray-900 dark:text-white">{partner.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Partner ID: {partner.id}</p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Withdrawal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Withdrawal for {partner.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>Amount</Label>
                          <Input type="number" placeholder="Enter amount" />
                        </div>
                        <div>
                          <Label>Mode</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">Save Withdrawal</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Total Withdrawn</p>
                    <p className="text-gray-900 dark:text-white">₹{partner.totalWithdrawn.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">This Month</p>
                    <p className="text-blue-600 dark:text-blue-400">₹{monthlyTotal.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Monthly Withdrawals (Last 30 Days):</p>
                  <div className="space-y-2">
                    {monthlyData.slice(0, 5).map((w, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        <div>
                          <div className="text-gray-900 dark:text-white">₹{w.amount.toLocaleString()}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">{formatDate(w.date)}</div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            w.mode === "UPI"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {w.mode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Partner Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner Name</TableHead>
                <TableHead>Total Withdrawn</TableHead>
                <TableHead>This Month</TableHead>
                <TableHead>Last Withdrawal</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => {
                const monthlyData = getMonthlyWithdrawals(partner.withdrawals);
                const monthlyTotal = monthlyData.reduce((sum, w) => sum + w.amount, 0);

                return (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <Users className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        {partner.name}
                      </div>
                    </TableCell>
                    <TableCell>₹{partner.totalWithdrawn.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-600">₹{monthlyTotal.toLocaleString()}</TableCell>
                    <TableCell>
                      {partner.withdrawals.length > 0 ? formatDate(partner.withdrawals[0].date) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equalization Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partners.map((partner) => {
              const expectedShare = totalWithdrawn / partners.length;
              const difference = partner.totalWithdrawn - expectedShare;
              return (
                <div
                  key={partner.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="text-gray-900 dark:text-white">{partner.name}</span>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white">
                      ₹{partner.totalWithdrawn.toLocaleString()}
                    </div>
                    <div
                      className={
                        difference > 0
                          ? "text-green-600"
                          : difference < 0
                          ? "text-orange-600"
                          : "text-gray-500"
                      }
                    >
                      {difference > 0 ? "+" : ""}₹{Math.abs(difference).toLocaleString()}{" "}
                      {difference > 0 ? "(above avg)" : difference < 0 ? "(below avg)" : "(equal)"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
