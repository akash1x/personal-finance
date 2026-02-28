import { useState, useRef, useCallback } from "react";
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
    Sparkles,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
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
import { Loader2 } from "lucide-react";
import { useGetTransactionsQuery, useCreateTransactionMutation } from "@/api/transactionApi";
import { useGetAccountsQuery } from "@/api/accountApi";
import { useScanReceiptMutation } from "@/api/receiptScanApi";

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

const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

// Mock transactions removed

const currencySymbols = {
    USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥", INR: "₹",
};

const categoryLabels = {
    food: "Food", transportation: "Transportation", housing: "Housing",
    utilities: "Utilities", entertainment: "Entertainment", health: "Health",
    education: "Education", other: "Other",
};

export default function Transactions() {
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

    // AI Scan state
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const [scanReceipt, { isLoading: isScanning, error: scanError }] = useScanReceiptMutation();

    const handleFileSelect = useCallback((file) => {
        if (!file) return;
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) return;
        if (file.size > 5 * 1024 * 1024) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    }, []);

    const handleScan = async () => {
        if (!selectedFile) return;
        try {
            const result = await scanReceipt(selectedFile).unwrap();
            setNewTransaction(prev => ({
                ...prev,
                description: result.description || prev.description,
                amount: result.amount?.toString() || prev.amount,
                category: result.category || prev.category,
                date: result.date || prev.date,
                type: "expense",
            }));
            // Clear scan UI after successful populate
            setSelectedFile(null);
            setPreview(null);
        } catch (err) {
            console.error("Scan failed:", err);
        }
    };

    const resetScanState = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    const currentDate = new Date();
    const queryMonth = filterMonth !== "all" ? monthNames[parseInt(filterMonth) - 1] : monthNames[currentDate.getMonth()];
    const queryYear = filterYear !== "all" ? parseInt(filterYear) : currentDate.getFullYear();

    const { data: transactionData, isLoading } = useGetTransactionsQuery({
        month: queryMonth,
        year: queryYear
    });

    const { data: accountsData } = useGetAccountsQuery();
    const accounts = accountsData?.accounts || [];

    // Helper to get account name
    const getAccountName = (txn) => {
        if (txn.account && typeof txn.account === 'object' && txn.account.name) return txn.account.name;
        if (txn.account && typeof txn.account === 'string') return txn.account; // fallback for strings
        if (txn.accountId && accounts.length > 0) {
            const acc = accounts.find(a => a.id === txn.accountId);
            return acc ? acc.name : "Unknown Account";
        }
        return "Unknown Account";
    };

    const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();

    const transactions = transactionData?.transactions || [];
    const totalIncome = transactionData?.totalIncome || 0;
    const totalExpense = transactionData?.totalExpense || 0;
    const netBalance = transactionData?.netBalance || 0;

    const [newTransaction, setNewTransaction] = useState({
        description: "",
        amount: "",
        type: "expense",
        status: "completed",
        category: "food",
        date: new Date().toISOString().split("T")[0],
        isRecurring: false,
        recurrencePattern: "monthly",
        accountId: "",
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

    const handleAddTransaction = async () => {
        if (newTransaction.description && newTransaction.amount && newTransaction.accountId) {
            try {
                await createTransaction({
                    ...newTransaction,
                    amount: parseFloat(newTransaction.amount),
                    currency: "usd", // Default currency
                }).unwrap();

                setNewTransaction({
                    description: "",
                    amount: "",
                    type: "expense",
                    status: "completed",
                    category: "food",
                    date: new Date().toISOString().split("T")[0],
                    isRecurring: false,
                    recurrencePattern: "monthly",
                    accountId: "",
                });
                setIsDialogOpen(false);
            } catch (err) {
                console.error("Failed to create transaction:", err);
            }
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

    // Totals are calculated by API
    // const totalIncome = ... (already from API)

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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Transactions</h1>
                        <p className="text-gray-600">Track your income, expenses, and transfers</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetScanState(); }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Transaction</DialogTitle>
                                <DialogDescription>Create a new transaction record or scan a receipt with AI</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* AI Scan Section */}
                                <div className="border border-dashed border-violet-200 rounded-lg p-3 bg-violet-50/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-violet-600" />
                                            <span className="text-sm font-medium text-violet-800">Scan Receipt with AI</span>
                                        </div>
                                    </div>
                                    {!preview ? (
                                        <div
                                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); }}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${
                                                isDragging ? "border-violet-500 bg-violet-100" : "border-violet-300 hover:border-violet-400 hover:bg-violet-100/50"
                                            }`}
                                        >
                                            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFileSelect(e.target.files[0])} className="hidden" />
                                            <Upload className="h-5 w-5 text-violet-500 mx-auto mb-1" />
                                            <p className="text-xs text-violet-600">Drop receipt or click to upload</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <img src={preview} alt="Receipt" className="h-16 w-16 object-cover rounded-md shadow-sm" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-600 truncate">{selectedFile?.name}</p>
                                                    <p className="text-xs text-gray-400">{(selectedFile?.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <button onClick={() => resetScanState()} className="p-1 text-gray-400 hover:text-red-500">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <Button onClick={handleScan} disabled={isScanning} size="sm" className="w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                                                {isScanning ? (<><Loader2 className="h-3 w-3 animate-spin" /> Scanning...</>) : (<><Sparkles className="h-3 w-3" /> Scan & Fill Fields</>)}
                                            </Button>
                                        </div>
                                    )}
                                    {scanError && (
                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                                            <AlertCircle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-red-600">{scanError?.data?.message || "Scan failed. Try a clearer image."}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Transaction Form Fields */}
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="account">Account</Label>
                                            <select
                                                id="account"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={newTransaction.accountId}
                                                onChange={(e) => setNewTransaction({ ...newTransaction, accountId: e.target.value })}
                                            >
                                                <option value="">Select Account</option>
                                                {accounts.map((acc) => (
                                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                ))}
                                            </select>
                                        </div>
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
                                <Button onClick={handleAddTransaction} disabled={isCreating}>
                                    {isCreating ? "Adding..." : "Add Transaction"}
                                </Button>
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
                                                    <span>{txn.date ? new Date(txn.date).toLocaleDateString() : 'No date'}</span>
                                                    <span>•</span>
                                                    <span>{getAccountName(txn)}</span>
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
