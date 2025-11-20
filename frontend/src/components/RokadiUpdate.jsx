import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Wallet, Building2, ArrowRightLeft, Eye, TrendingUp } from "lucide-react";
import { useData } from "../utils/dataContext";
import { formatINR } from "../utils/currencyFormat";
import { toast } from "sonner";
import { OwnerReadOnlyBadge } from "./OwnerBadge";

export function RokadiUpdate() {
  const { rokadiAccounts, updateRokadiAccount, bankAccounts } = useData();
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [viewTransactionsDialogOpen, setViewTransactionsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");

  const [transfer, setTransfer] = useState({
    fromAccount: "",
    toAccount: "",
    toType: "cash",
    amount: 0,
    description: "",
  });

  const totalBalance = rokadiAccounts.reduce((sum, account) => sum + account.balance, 0);

  const handleTransfer = () => {
    if (!transfer.fromAccount || !transfer.toAccount || transfer.amount <= 0) {
      toast.error("Please fill all transfer details");
      return;
    }

    const fromAcc = rokadiAccounts.find(a => a.id === transfer.fromAccount);
    if (!fromAcc || fromAcc.balance < transfer.amount) {
      toast.error("Insufficient balance in source account");
      return;
    }

    // Update source account
    updateRokadiAccount(transfer.fromAccount, {
      balance: fromAcc.balance - transfer.amount,
    });

    // Update destination account if it's a cash account
    if (transfer.toType === "cash") {
      const toAcc = rokadiAccounts.find(a => a.id === transfer.toAccount);
      if (toAcc) {
        updateRokadiAccount(transfer.toAccount, {
          balance: toAcc.balance + transfer.amount,
        });
      }
    }

    toast.success(`${formatINR(transfer.amount)} transferred successfully!`);
    setTransfer({ fromAccount: "", toAccount: "", toType: "cash", amount: 0, description: "" });
    setTransferDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">Rokadi & Cash Management</h2>
          <p className="text-gray-500 dark:text-gray-400">Multi-account cash position tracking</p>
        </div>
        <OwnerReadOnlyBadge />
      </div>

      {/* Summary Row - Total Balance */}
      <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-green-600 dark:text-green-400">Total Cash in Hand</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Combined balance across all cash accounts
            </p>
          </div>
          <Wallet className="w-8 h-8 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl text-green-600 dark:text-green-400 mb-3">{formatINR(totalBalance)}</div>
          <div className="flex gap-2">
            <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Transfer Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Transfer Funds</DialogTitle>
                  <DialogDescription>
                    Transfer cash between accounts or to bank
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>From Account (Cash)</Label>
                    <Select value={transfer.fromAccount} onValueChange={(val) => setTransfer({ ...transfer, fromAccount: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                      <SelectContent>
                        {rokadiAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.accountName} - {formatINR(account.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Transfer To</Label>
                    <Select value={transfer.toType} onValueChange={(val) => setTransfer({ ...transfer, toType: val, toAccount: "" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash Account</SelectItem>
                        <SelectItem value="bank">Bank Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>To Account</Label>
                    <Select value={transfer.toAccount} onValueChange={(val) => setTransfer({ ...transfer, toAccount: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                      <SelectContent>
                        {transfer.toType === "cash"
                          ? rokadiAccounts
                              .filter(a => a.id !== transfer.fromAccount)
                              .map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.accountName} - {formatINR(account.balance)}
                                </SelectItem>
                              ))
                          : bankAccounts.map(account => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.bankName} - ****{account.accountNumber.slice(-4)}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={transfer.amount || ""}
                      onChange={(e) => setTransfer({ ...transfer, amount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Input
                      placeholder="Transfer purpose..."
                      value={transfer.description}
                      onChange={(e) => setTransfer({ ...transfer, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTransfer}>Transfer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Individual Cash Account Cards */}
      <div className="flex grid-cols-1 md:grid-cols-3 gap-4">
        {rokadiAccounts.map((account, index) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                  {account.accountName}
                </CardTitle>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="w-fit mt-2">
                Account #{index + 1}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900 dark:text-white mb-1">
                {formatINR(account.balance)}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                <TrendingUp className="h-3 w-3" />
                <span>{((account.balance / totalBalance) * 100).toFixed(1)}% of total</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => {
                  setSelectedAccount(account.id);
                  setViewTransactionsDialogOpen(true);
                }}
              >
                <Eye className="h-3 w-3" />
                View Transactions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bank Balance Summary */}
      {bankAccounts.length > 0 && (
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-600 dark:text-purple-400">
              Bank Accounts Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">{account.bankName}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        ****{account.accountNumber.slice(-4)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {account.accountType}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-600 dark:text-purple-400">
                      {formatINR(account.currentBalance)}
                    </div>
                    <Button variant="ghost" size="sm" className="mt-1 h-6 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center p-4 bg-purple-100 dark:bg-purple-900/40 rounded-lg border-2 border-purple-300 dark:border-purple-700 mt-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Total Bank Balance</p>
                  <p className="text-gray-900 dark:text-white">
                    Across {bankAccounts.length} account{bankAccounts.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-xl text-purple-600 dark:text-purple-400">
                  {formatINR(bankAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rokadiAccounts.map((account) => (
              <div
                key={account.id}
                className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div>
                  <p className="text-gray-900 dark:text-white mb-1">{account.accountName}</p>
                  <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(account.balance / totalBalance) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {((account.balance / totalBalance) * 100).toFixed(1)}% of total balance
                  </p>
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-lg">
                  {formatINR(account.balance)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Transactions Dialog */}
      <Dialog open={viewTransactionsDialogOpen} onOpenChange={setViewTransactionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              Recent transactions for {rokadiAccounts.find(a => a.id === selectedAccount)?.accountName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-500 py-8">
              No transactions recorded yet
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
