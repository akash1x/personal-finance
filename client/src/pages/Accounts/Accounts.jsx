import { useState } from "react";
import {
    Wallet,
    CreditCard,
    Banknote,
    TrendingUp,
    HandCoins,
    DollarSign,
    Plus,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useGetAccountsQuery, useCreateAccountMutation } from "@/api/accountApi";

const accountTypeConfig = {
    bank: {
        icon: Wallet,
        label: "Bank",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        gradient: "from-blue-50 to-blue-100",
    },
    cash: {
        icon: Banknote,
        label: "Cash",
        color: "bg-green-50 text-green-700 border-green-200",
        gradient: "from-green-50 to-green-100",
    },
    credit_card: {
        icon: CreditCard,
        label: "Credit Card",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        gradient: "from-purple-50 to-purple-100",
    },
    debit_card: {
        icon: CreditCard,
        label: "Debit Card",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        gradient: "from-indigo-50 to-indigo-100",
    },
    investment: {
        icon: TrendingUp,
        label: "Investment",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        gradient: "from-emerald-50 to-emerald-100",
    },
    loan: {
        icon: HandCoins,
        label: "Loan",
        color: "bg-red-50 text-red-700 border-red-200",
        gradient: "from-red-50 to-red-100",
    },
    other: {
        icon: DollarSign,
        label: "Other",
        color: "bg-gray-50 text-gray-700 border-gray-200",
        gradient: "from-gray-50 to-gray-100",
    },
};

const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
};

export default function Accounts() {
    const { data, isLoading, error } = useGetAccountsQuery();
    const accounts = data?.accounts || [];
    const totalBalance = data?.totalBalance || 0;
    const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({
        name: "",
        type: "bank",
        balance: "",
        currency: "USD",
    });

    const handleAddAccount = async () => {
        if (newAccount.name && newAccount.balance) {
            try {
                await createAccount({
                    name: newAccount.name,
                    type: newAccount.type,
                    balance: parseFloat(newAccount.balance),
                    currency: newAccount.currency,
                }).unwrap();
                setNewAccount({ name: "", type: "bank", balance: "", currency: "USD" });
                setIsDialogOpen(false);
            } catch (err) {
                console.error("Failed to create account:", err);
            }
        }
    };

    const formatBalance = (balance, currency = "USD") => {
        const symbol = currencySymbols[currency] || currency;
        const absBalance = Math.abs(balance);
        const formatted = absBalance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return balance < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
    };

    // totalBalance is already provided by the API

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Accounts</h1>
                    <p className="text-gray-600">
                        Manage your financial accounts and track your wealth
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        Failed to load accounts. Please try again. You can still add a new account.
                    </div>
                )}

                {/* Total Balance Card */}
                <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                    <CardContent className="pt-6">
                        <div className="text-white">
                            <p className="text-sm font-medium opacity-90 mb-1">
                                Total Balance
                            </p>
                            <p className="text-4xl font-bold">
                                {formatBalance(totalBalance, "USD")}
                            </p>
                            <p className="text-xs opacity-75 mt-2">
                                Across {accounts.length} accounts
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Accounts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account) => {
                        const config = accountTypeConfig[account.type] || accountTypeConfig.other;
                        const Icon = config.icon;

                        return (
                            <Card
                                key={account.id}
                                className={`border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br ${config.gradient}`}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg ${config.color} border`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-gray-900">
                                                    {account.name}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <Badge
                                                variant="secondary"
                                                className={`${config.color} border`}
                                            >
                                                {config.label}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Balance</p>
                                            <p
                                                className={`text-2xl font-bold ${account.balance < 0
                                                    ? "text-red-600"
                                                    : "text-gray-900"
                                                    }`}
                                            >
                                                {formatBalance(account.balance, account.currency)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {/* Add Account Card */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer hover:bg-gray-50 transition-all duration-200 flex items-center justify-center min-h-[200px]">
                                <CardContent className="flex flex-col items-center justify-center text-center p-8">
                                    <div className="rounded-full bg-gray-100 p-4 mb-4">
                                        <Plus className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-700">
                                        Add Account
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Create a new account
                                    </p>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Account</DialogTitle>
                                <DialogDescription>
                                    Create a new account to track your finances
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Account Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Main Checking"
                                        value={newAccount.name}
                                        onChange={(e) =>
                                            setNewAccount({ ...newAccount, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Account Type</Label>
                                    <select
                                        id="type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={newAccount.type}
                                        onChange={(e) =>
                                            setNewAccount({ ...newAccount, type: e.target.value })
                                        }
                                    >
                                        <option value="bank">Bank</option>
                                        <option value="cash">Cash</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="investment">Investment</option>
                                        <option value="loan">Loan</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="balance">Initial Balance</Label>
                                    <Input
                                        id="balance"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={newAccount.balance}
                                        onChange={(e) =>
                                            setNewAccount({ ...newAccount, balance: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <select
                                        id="currency"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={newAccount.currency}
                                        onChange={(e) =>
                                            setNewAccount({ ...newAccount, currency: e.target.value })
                                        }
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="JPY">JPY (¥)</option>
                                        <option value="CNY">CNY (¥)</option>
                                        <option value="INR">INR (₹)</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleAddAccount} disabled={isCreating}>
                                    {isCreating ? "Adding..." : "Add Account"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
