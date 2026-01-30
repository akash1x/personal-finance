import { useState } from "react";
import {
    Plus,
    ArrowUpCircle,
    ArrowDownCircle,
    ArrowRightLeft,
    ShoppingCart,
    Car,
    Home,
    Zap,
    Smile,
    Heart,
    BookOpen,
    DollarSign,
    Filter,
    Search,
    Repeat,
    ChevronDown,
    ChevronUp,
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
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Category icons
const categoryIcons = {
    food: ShoppingCart,
    transportation: Car,
    housing: Home,
    utilities: Zap,
    entertainment: Smile,
    health: Heart,
    education: BookOpen,
    other: DollarSign,
};

// Mock transactions data
const MOCK_TRANSACTIONS = [
    {
        id: "1",
        description: "Salary - January",
        amount: 5000,
        currency: "USD",
        type: "income",
        status: "completed",
        category: "other",
        date: "2026-01-25",
        isRecurring: true,
        recurrencePattern: "monthly",
        account: "Main Checking",
    },
    {
        id: "2",
        description: "Grocery Store",
        amount: 85.5,
        currency: "USD",
        type: "expense",
        status: "completed",
        category: "food",
        date: "2026-01-24",
        isRecurring: false,
        recurrencePattern: "daily",
        account: "Credit Card",
    },
    {
        id: "3",
        description: "Gas Station",
        amount: 45,
        currency: "USD",
        type: "expense",
        status: "completed",
        category: "transportation",
        date: "2026-01-23",
        isRecurring: false,
        recurrencePattern: "daily",
        account: "Debit Card",
    },
    {
        id: "4",
        description: "Rent Payment",
        amount: 1200,
        currency: "USD",
        type: "expense",
        status: "pending",
        category: "housing",
        date: "2026-01-30",
        isRecurring: true,
        recurrencePattern: "monthly",
        account: "Main Checking",
    },
    {
        id: "5",
        description: "Electric Bill",
        amount: 75,
        currency: "USD",
        type: "expense",
        status: "completed",
        category: "utilities",
        date: "2026-01-20",
        isRecurring: true,
        recurrencePattern: "monthly",
        account: "Main Checking",
    },
    {
        id: "6",
        description: "Transfer to Savings",
        amount: 500,
        currency: "USD",
        type: "transfer",
        status: "completed",
        category: "other",
        date: "2026-01-15",
        isRecurring: false,
        recurrencePattern: "daily",
        account: "Main Checking",
    },
    {
        id: "7",
        description: "Netflix Subscription",
        amount: 15.99,
        currency: "USD",
        type: "expense",
        status: "completed",
        category: "entertainment",
        date: "2026-01-10",
        isRecurring: true,
        recurrencePattern: "monthly",
        account: "Credit Card",
    },
];

const currencySymbols = {
    USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥", INR: "₹",
};

const categoryLabels = {
    food: "Food", transportation: "Transportation", housing: "Housing",
    utilities: "Utilities", entertainment: "Entertainment", health: "Health",
    education: "Education", other: "Other",
};

export default function Transactions() {
    const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMonth, setFilterMonth] = useState("all");
    const [filterYear, setFilterYear] = useState("all");
    const [filterRecurring, setFilterRecurring] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [newTransaction, setNewTransaction] = useState({
        description: "",
        amount: "",
        type: "expense",
        status: "completed",
        category: "food",
        date: new Date().toISOString().split("T")[0],
        isRecurring: false,
        recurrencePattern: "monthly",
        account: "Main Checking",
    });

    const formatAmount = (amount, currency) => {
        const symbol = currencySymbols[currency] || currency;
        const formatted = amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `${symbol}${formatted}`;
    };

    const getTypeConfig = (type) => {
        const configs = {
            income: {
                icon: ArrowUpCircle,
                color: "text-green-600",
                bgColor: "bg-green-50",
                badgeColor: "bg-green-100 text-green-700 border-green-200",
                label: "Income",
            },
            expense: {
                icon: ArrowDownCircle,
                color: "text-red-600",
                bgColor: "bg-red-50",
                badgeColor: "bg-red-100 text-red-700 border-red-200",
                label: "Expense",
            },
            transfer: {
                icon: ArrowRightLeft,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
                label: "Transfer",
            },
        };
        return configs[type] || configs.expense;
    };

    const getStatusBadge = (status) => {
        const badges = {
            completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
            pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
            cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-700 border-gray-200" },
        };
        return badges[status] || badges.completed;
    };

    const handleAddTransaction = () => {
        if (newTransaction.description && newTransaction.amount) {
            const transaction = {
                id: Date.now().toString(),
                ...newTransaction,
                amount: parseFloat(newTransaction.amount),
                currency: "USD",
            };
            setTransactions([transaction, ...transactions]);
            setNewTransaction({
                description: "",
                amount: "",
                type: "expense",
                status: "completed",
                category: "food",
                date: new Date().toISOString().split("T")[0],
                isRecurring: false,
                recurrencePattern: "monthly",
                account: "Main Checking",
            });
            setIsDialogOpen(false);
        }
    };

    // Filter and search transactions
    const filteredTransactions = transactions.filter((txn) => {
        const matchesType = filterType === "all" || txn.type === filterType;
        const matchesStatus = filterStatus === "all" || txn.status === filterStatus;
        const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Date filters
        const txnDate = new Date(txn.date);
        const txnMonth = txnDate.getMonth() + 1; // 1-12
        const txnYear = txnDate.getFullYear();

        const matchesMonth = filterMonth === "all" || txnMonth === parseInt(filterMonth);
        const matchesYear = filterYear === "all" || txnYear === parseInt(filterYear);

        // Date range filter
        const matchesDateFrom = !dateFrom || txnDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || txnDate <= new Date(dateTo);

        // Recurring filter
        const matchesRecurring = filterRecurring === "all" ||
            (filterRecurring === "recurring" && txn.isRecurring) ||
            (filterRecurring === "one-time" && !txn.isRecurring);

        return matchesType && matchesStatus && matchesSearch && matchesMonth &&
            matchesYear && matchesDateFrom && matchesDateTo && matchesRecurring;
    });

    // Calculate totals
    const totalIncome = transactions
        .filter((t) => t.type === "income" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === "expense" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Transactions</h1>
                        <p className="text-gray-600">Track your income, expenses, and transfers</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Transaction</DialogTitle>
                                <DialogDescription>Create a new transaction record</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Input
                                        id="desc"
                                        placeholder="e.g., Grocery shopping"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={newTransaction.amount}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Type</Label>
                                        <select
                                            id="type"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={newTransaction.type}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                            <option value="transfer">Transfer</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <select
                                            id="category"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={newTransaction.category}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                        >
                                            {Object.entries(categoryLabels).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={newTransaction.status}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
                                        >
                                            <option value="completed">Completed</option>
                                            <option value="pending">Pending</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newTransaction.date}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="recurring"
                                        checked={newTransaction.isRecurring}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, isRecurring: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="recurring" className="cursor-pointer">Recurring transaction</Label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddTransaction}>Add Transaction</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600">
                        <CardContent className="pt-6">
                            <div className="text-white">
                                <p className="text-sm font-medium opacity-90 mb-1">Total Income</p>
                                <p className="text-3xl font-bold">{formatAmount(totalIncome, "USD")}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600">
                        <CardContent className="pt-6">
                            <div className="text-white">
                                <p className="text-sm font-medium opacity-90 mb-1">Total Expenses</p>
                                <p className="text-3xl font-bold">{formatAmount(totalExpense, "USD")}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={`border-0 shadow-lg bg-gradient-to-br ${netBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'}`}>
                        <CardContent className="pt-6">
                            <div className="text-white">
                                <p className="text-sm font-medium opacity-90 mb-1">Net Balance</p>
                                <p className="text-3xl font-bold">{formatAmount(netBalance, "USD")}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6 border-0 shadow-md">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* First Row: Search, Type, Status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search transactions..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Toggle Advanced Filters Button */}
                            <div className="flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="gap-2 text-gray-600"
                                >
                                    <Filter className="h-4 w-4" />
                                    {showFilters ? "Hide" : "Show"} Advanced Filters
                                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                            </div>

                            {/* Advanced Filters - Conditionally Rendered */}
                            {showFilters && (
                                <>
                                    {/* Second Row: Date Range, Month, Year */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-xs text-gray-600">Date From</Label>
                                            <Input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-xs text-gray-600">Date To</Label>
                                            <Input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-xs text-gray-600">Month</Label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={filterMonth}
                                                onChange={(e) => setFilterMonth(e.target.value)}
                                            >
                                                <option value="all">All Months</option>
                                                <option value="1">January</option>
                                                <option value="2">February</option>
                                                <option value="3">March</option>
                                                <option value="4">April</option>
                                                <option value="5">May</option>
                                                <option value="6">June</option>
                                                <option value="7">July</option>
                                                <option value="8">August</option>
                                                <option value="9">September</option>
                                                <option value="10">October</option>
                                                <option value="11">November</option>
                                                <option value="12">December</option>
                                            </select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-xs text-gray-600">Year</Label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={filterYear}
                                                onChange={(e) => setFilterYear(e.target.value)}
                                            >
                                                <option value="all">All Years</option>
                                                <option value="2026">2026</option>
                                                <option value="2025">2025</option>
                                                <option value="2024">2024</option>
                                                <option value="2023">2023</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Third Row: Recurring Filter */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-xs text-gray-600">Transaction Type</Label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={filterRecurring}
                                                onChange={(e) => setFilterRecurring(e.target.value)}
                                            >
                                                <option value="all">All Transactions</option>
                                                <option value="recurring">Recurring Only</option>
                                                <option value="one-time">One-Time Only</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 flex items-end">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setFilterType("all");
                                                    setFilterStatus("all");
                                                    setFilterMonth("all");
                                                    setFilterYear("all");
                                                    setFilterRecurring("all");
                                                    setDateFrom("");
                                                    setDateTo("");
                                                }}
                                                className="w-full md:w-auto"
                                            >
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions List */}
                <div className="space-y-3">
                    {filteredTransactions.map((txn) => {
                        const typeConfig = getTypeConfig(txn.type);
                        const TypeIcon = typeConfig.icon;
                        const CategoryIcon = categoryIcons[txn.category];
                        const statusBadge = getStatusBadge(txn.status);

                        return (
                            <Card key={txn.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-3 rounded-lg ${typeConfig.bgColor}`}>
                                                <TypeIcon className={`h-6 w-6 ${typeConfig.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900">{txn.description}</h3>
                                                    {txn.isRecurring && <Repeat className="h-4 w-4 text-gray-400" />}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <CategoryIcon className="h-3 w-3" />
                                                        <span>{categoryLabels[txn.category]}</span>
                                                    </div>
                                                    <span>•</span>
                                                    <span>{new Date(txn.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{txn.account}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className={`${statusBadge.className} border`}>
                                                {statusBadge.label}
                                            </Badge>
                                            <div className="text-right">
                                                <p className={`text-xl font-bold ${typeConfig.color}`}>
                                                    {txn.type === "expense" ? "-" : "+"}{formatAmount(txn.amount, txn.currency)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {filteredTransactions.length === 0 && (
                    <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="pt-12 pb-12 text-center">
                            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No transactions found</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
