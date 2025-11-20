import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Download, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { formatDate } from "../utils/dateFormat";

export function BankAccount() {
  const [debits, setDebits] = useState([
    { id: "1", amount: 45000, name: "Supplier A", fromAccount: "HDFC - 1234", toAccount: "Supplier Account", date: "2025-11-06" },
    { id: "2", amount: 32000, name: "Transport Services", fromAccount: "HDFC - 1234", toAccount: "Transport Co.", date: "2025-11-05" },
    { id: "3", amount: 28000, name: "Raw Material Purchase", fromAccount: "SBI - 5678", toAccount: "Material Vendor", date: "2025-11-05" },
    { id: "4", amount: 15000, name: "Equipment Rental", fromAccount: "HDFC - 1234", toAccount: "Equipment Co.", date: "2025-11-04" },
    { id: "5", amount: 52000, name: "Partner Withdrawal", fromAccount: "HDFC - 1234", toAccount: "Partner Account", date: "2025-11-04" },
    { id: "6", amount: 18500, name: "Labour Salaries", fromAccount: "SBI - 5678", toAccount: "Multiple Workers", date: "2025-11-03" },
    { id: "7", amount: 9800, name: "Utility Bills", fromAccount: "HDFC - 1234", toAccount: "Utility Provider", date: "2025-11-03" },
    { id: "8", amount: 35000, name: "Feriwala Payments", fromAccount: "SBI - 5678", toAccount: "Feriwala Account", date: "2025-11-02" },
  ]);

  const [credits, setCredits] = useState([
    { id: "1", amount: 75000, from: "Mill Payment", fromAccount: "ABC Mills", toAccount: "HDFC - 1234", date: "2025-11-06" },
    { id: "2", amount: 50000, from: "Client XYZ", fromAccount: "Client XYZ", toAccount: "HDFC - 1234", date: "2025-11-05" },
    { id: "3", amount: 125000, from: "ABC Mills Settlement", fromAccount: "ABC Mills", toAccount: "SBI - 5678", date: "2025-11-05" },
    { id: "4", amount: 85000, from: "Steel Industries", fromAccount: "Steel Industries", toAccount: "HDFC - 1234", date: "2025-11-04" },
    { id: "5", amount: 95000, from: "Metal Traders Payment", fromAccount: "Metal Traders", toAccount: "SBI - 5678", date: "2025-11-04" },
    { id: "6", amount: 62000, from: "Scrap Sale Revenue", fromAccount: "Dealer Account", toAccount: "HDFC - 1234", date: "2025-11-03" },
    { id: "7", amount: 110000, from: "XYZ Corporation", fromAccount: "XYZ Corp", toAccount: "SBI - 5678", date: "2025-11-03" },
    { id: "8", amount: 48000, from: "Local Dealer Payment", fromAccount: "Local Dealer", toAccount: "HDFC - 1234", date: "2025-11-02" },
  ]);

  const [ledger, setLedger] = useState([
    { id: "1", type: "in", amount: 75000, date: "2025-11-06", description: "Mill Payment", fromAccount: "ABC Mills", toAccount: "HDFC - 1234" },
    { id: "2", type: "out", amount: 45000, date: "2025-11-06", description: "Supplier Payment", fromAccount: "HDFC - 1234", toAccount: "Supplier Account" },
    { id: "3", type: "in", amount: 50000, date: "2025-11-05", description: "Client XYZ Payment", fromAccount: "Client XYZ", toAccount: "HDFC - 1234" },
    { id: "4", type: "out", amount: 32000, date: "2025-11-05", description: "Transport Services", fromAccount: "HDFC - 1234", toAccount: "Transport Co." },
    { id: "5", type: "in", amount: 125000, date: "2025-11-05", description: "ABC Mills Settlement", fromAccount: "ABC Mills", toAccount: "SBI - 5678" },
    { id: "6", type: "out", amount: 28000, date: "2025-11-05", description: "Raw Material Purchase", fromAccount: "SBI - 5678", toAccount: "Material Vendor" },
    { id: "7", type: "in", amount: 85000, date: "2025-11-04", description: "Steel Industries", fromAccount: "Steel Industries", toAccount: "HDFC - 1234" },
    { id: "8", type: "out", amount: 15000, date: "2025-11-04", description: "Equipment Rental", fromAccount: "HDFC - 1234", toAccount: "Equipment Co." },
    { id: "9", type: "in", amount: 95000, date: "2025-11-04", description: "Metal Traders Payment", fromAccount: "Metal Traders", toAccount: "SBI - 5678" },
    { id: "10", type: "out", amount: 52000, date: "2025-11-04", description: "Partner Withdrawal", fromAccount: "HDFC - 1234", toAccount: "Partner Account" },
    { id: "11", type: "in", amount: 62000, date: "2025-11-03", description: "Scrap Sale Revenue", fromAccount: "Dealer Account", toAccount: "HDFC - 1234" },
    { id: "12", type: "out", amount: 18500, date: "2025-11-03", description: "Labour Salaries", fromAccount: "SBI - 5678", toAccount: "Multiple Workers" },
  ]);

  const totalDebit = debits.reduce((sum, d) => sum + d.amount, 0);
  const totalCredit = credits.reduce((sum, c) => sum + c.amount, 0);
  const netBalance = 567890;
  const runningBalance = totalCredit - totalDebit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">Bank Account Maintenance (CA)</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage bank transactions and account ledger</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export Statement
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="flex grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-600 dark:text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              ₹{totalCredit.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">Total Debits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              ₹{totalDebit.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">Net Movement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={runningBalance >= 0 ? "text-green-600" : "text-red-600"}>
              {runningBalance >= 0 ? "+" : ""}₹{runningBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 dark:text-white">₹{netBalance.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="debit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="debit">Debit (Money Out)</TabsTrigger>
          <TabsTrigger value="credit">Credit (Money In)</TabsTrigger>
          <TabsTrigger value="ledger">Bank Ledger</TabsTrigger>
        </TabsList>

        {/* Debit Tab */}
        <TabsContent value="debit">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Debit Transactions (Money Out)</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Debit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Debit Transaction</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Paid To</Label>
                      <Input placeholder="Enter recipient name" />
                    </div>
                    <div>
                      <Label>From Account</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hdfc">HDFC - 1234</SelectItem>
                          <SelectItem value="sbi">SBI - 5678</SelectItem>
                          <SelectItem value="icici">ICICI - 9012</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>To Account</Label>
                      <Input placeholder="Recipient account details" />
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input type="number" placeholder="Enter amount" />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Save Transaction</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paid To</TableHead>
                    <TableHead>From Account</TableHead>
                    <TableHead>To Account</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debits.map((debit) => (
                    <TableRow key={debit.id}>
                      <TableCell>{debit.name}</TableCell>
                      <TableCell className="text-red-600">{debit.fromAccount}</TableCell>
                      <TableCell className="text-green-600">{debit.toAccount}</TableCell>
                      <TableCell className="text-red-600">₹{debit.amount.toLocaleString()}</TableCell>
                      <TableCell>{formatDate(debit.date)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Tab */}
        <TabsContent value="credit">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Credit Transactions (Money In)</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Credit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Credit Transaction</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Received From</Label>
                      <Input placeholder="Enter sender name" />
                    </div>
                    <div>
                      <Label>From Account</Label>
                      <Input placeholder="Sender account details" />
                    </div>
                    <div>
                      <Label>To Account</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hdfc">HDFC - 1234</SelectItem>
                          <SelectItem value="sbi">SBI - 5678</SelectItem>
                          <SelectItem value="icici">ICICI - 9012</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input type="number" placeholder="Enter amount" />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Save Transaction</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Received From</TableHead>
                    <TableHead>From Account</TableHead>
                    <TableHead>To Account</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits.map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell>{credit.from}</TableCell>
                      <TableCell className="text-blue-600">{credit.fromAccount}</TableCell>
                      <TableCell className="text-green-600">{credit.toAccount}</TableCell>
                      <TableCell className="text-green-600">₹{credit.amount.toLocaleString()}</TableCell>
                      <TableCell>{formatDate(credit.date)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ledger Tab */}
        <TabsContent value="ledger">
          <Card>
            <CardHeader>
              <CardTitle>Bank Ledger (All Transactions)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>From Account</TableHead>
                    <TableHead>To Account</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            entry.type === "in"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {entry.type === "in" ? "Credit" : "Debit"}
                        </span>
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className={entry.type === "out" ? "text-red-600" : "text-blue-600"}>
                        {entry.fromAccount}
                      </TableCell>
                      <TableCell className="text-green-600">{entry.toAccount}</TableCell>
                      <TableCell className={entry.type === "in" ? "text-green-600" : "text-red-600"}>
                        {entry.type === "in" ? "+" : "-"}₹{entry.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
