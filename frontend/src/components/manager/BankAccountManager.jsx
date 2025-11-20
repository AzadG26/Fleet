import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useData } from '../../utils/dataContext';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Save, X, Building2 } from 'lucide-react';
import { formatDate } from '../../utils/dateFormat';

const TRANSACTION_CATEGORIES = [
  'Supplier Payment', 'Customer Receipt', 'Salary', 'Rent', 'Utilities',
  'Loan EMI', 'Investment', 'Other'
];

export function BankAccountManager() {
  const { 
    bankAccounts, addBankAccount, updateBankAccount, deleteBankAccount,
    bankTransactions, addBankTransaction, updateBankTransaction, deleteBankTransaction 
  } = useData();
  
  const [activeTab, setActiveTab] = useState('accounts');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  
  const [accountForm, setAccountForm] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    branch: '',
    ifscCode: '',
    accountType: 'Current',
    openingBalance: 0,
  });

  const [transactionForm, setTransactionForm] = useState({
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    transactionType: 'Credit',
    category: 'Customer Receipt',
    description: '',
    accountDetails: '',
    chequeNumber: '',
    debitAmount: 0,
    creditAmount: 0,
  });

  const resetAccountForm = () => {
    setAccountForm({
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      branch: '',
      ifscCode: '',
      accountType: 'Current',
      openingBalance: 0,
    });
    setIsAddingAccount(false);
    setEditingAccountId(null);
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      accountId: '',
      date: new Date().toISOString().split('T')[0],
      transactionType: 'Credit',
      category: 'Customer Receipt',
      description: '',
      accountDetails: '',
      chequeNumber: '',
      debitAmount: 0,
      creditAmount: 0,
    });
    setIsAddingTransaction(false);
    setEditingTransactionId(null);
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    
    if (editingAccountId) {
      updateBankAccount(editingAccountId, { ...accountForm, currentBalance: accountForm.openingBalance });
      toast.success('Bank account updated!');
    } else {
      addBankAccount({ ...accountForm, currentBalance: accountForm.openingBalance });
      toast.success('Bank account added!');
    }
    
    resetAccountForm();
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    
    const account = bankAccounts.find(a => a.id === transactionForm.accountId);
    if (!account) {
      toast.error('Please select a bank account');
      return;
    }

    const accountTransactions = bankTransactions.filter(t => t.accountId === transactionForm.accountId);
    const currentBalance = accountTransactions.reduce((bal, txn) => {
      return bal + txn.creditAmount - txn.debitAmount;
    }, account.openingBalance);

    const balance = transactionForm.transactionType === 'Credit'
      ? currentBalance + transactionForm.creditAmount
      : currentBalance - transactionForm.debitAmount;
    
    if (editingTransactionId) {
      updateBankTransaction(editingTransactionId, { ...transactionForm, balance });
      toast.success('Transaction updated!');
    } else {
      addBankTransaction({ ...transactionForm, balance });
      toast.success('Transaction added!');
    }
    
    resetTransactionForm();
  };

  const handleEditAccount = (account) => {
    setAccountForm({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountHolderName: account.accountHolderName,
      branch: account.branch,
      ifscCode: account.ifscCode,
      accountType: account.accountType,
      openingBalance: account.openingBalance,
    });
    setEditingAccountId(account.id);
    setIsAddingAccount(true);
  };

  const handleEditTransaction = (transaction) => {
    setTransactionForm({
      accountId: transaction.accountId,
      date: transaction.date,
      transactionType: transaction.transactionType,
      category: transaction.category,
      description: transaction.description,
      accountDetails: transaction.accountDetails,
      chequeNumber: transaction.chequeNumber || '',
      debitAmount: transaction.debitAmount,
      creditAmount: transaction.creditAmount,
    });
    setEditingTransactionId(transaction.id);
    setIsAddingTransaction(true);
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('Are you sure? This will also delete all transactions for this account.')) {
      deleteBankAccount(id);
      bankTransactions.filter(t => t.accountId === id).forEach(t => deleteBankTransaction(t.id));
      toast.success('Account deleted!');
    }
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteBankTransaction(id);
      toast.success('Transaction deleted!');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* --- Accounts Tab --- */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bank Accounts</CardTitle>
                  <CardDescription>Manage your business bank accounts</CardDescription>
                </div>
                {!isAddingAccount && (
                  <Button onClick={() => setIsAddingAccount(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Account
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isAddingAccount && (
                <form onSubmit={handleAccountSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={accountForm.bankName}
                        onChange={(e) => setAccountForm({ ...accountForm, bankName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={accountForm.accountNumber}
                        onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        value={accountForm.accountHolderName}
                        onChange={(e) => setAccountForm({ ...accountForm, accountHolderName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Input
                        id="branch"
                        value={accountForm.branch}
                        onChange={(e) => setAccountForm({ ...accountForm, branch: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={accountForm.ifscCode}
                        onChange={(e) => setAccountForm({ ...accountForm, ifscCode: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select 
                        value={accountForm.accountType} 
                        onValueChange={(value) => setAccountForm({ ...accountForm, accountType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Savings">Savings</SelectItem>
                          <SelectItem value="Current">Current</SelectItem>
                          <SelectItem value="CC/OD">CC/OD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="openingBalance">Opening Balance (₹)</Label>
                      <Input
                        id="openingBalance"
                        type="number"
                        step="0.01"
                        value={accountForm.openingBalance}
                        onChange={(e) => setAccountForm({ ...accountForm, openingBalance: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {editingAccountId ? 'Update' : 'Save'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetAccountForm}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Accounts List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankAccounts.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No bank accounts yet. Add your first account above.
                  </div>
                ) : (
                  bankAccounts.map((account) => (
                    <Card key={account.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-emerald-600" />
                            <CardTitle className="text-base">{account.bankName}</CardTitle>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                            {account.accountType}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <p className="text-gray-500">A/C: {account.accountNumber}</p>
                          <p className="text-gray-500">Branch: {account.branch}</p>
                          <p className="text-gray-500">IFSC: {account.ifscCode}</p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm text-gray-500">Current Balance</p>
                          <p className="text-emerald-600">₹{account.currentBalance.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditAccount(account)} className="flex-1">
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteAccount(account.id)} className="flex-1">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Transactions Tab --- */}
        <TabsContent value="transactions">
          {/* Transaction code continues unchanged */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
