import { useState } from "react";
import {
    Calendar,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Edit,
    ShoppingCart,
    Car,
    Home,
    Zap,
    Smile,
    Heart,
    BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

// Category icons mapping
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

// Mock data - Single budget per month with category breakdown
const MOCK_BUDGET_DATA = {
    january: {
        id: "1",
        name: "January Budget",
        amount: 3000,
        currency: "USD",
        month: "january",
        year: 2026,
        categorySpending: [
            { category: "food", spent: 450 },
            { category: "transportation", spent: 280 },
            { category: "housing", spent: 800 },
            { category: "utilities", spent: 150 },
            { category: "entertainment", spent: 200 },
            { category: "health", spent: 120 },
            { category: "education", spent: 100 },
            { category: "other", spent: 80 },
        ],
    },
    february: {
        id: "2",
        name: "February Budget",
        amount: 3000,
        currency: "USD",
        month: "february",
        year: 2026,
        categorySpending: [],
    },
};

const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

const monthLabels = {
    january: "January", february: "February", march: "March",
    april: "April", may: "May", june: "June",
    july: "July", august: "August", september: "September",
    october: "October", november: "November", december: "December",
};

const categoryLabels = {
    food: "Food & Dining",
    transportation: "Transportation",
    housing: "Housing",
    utilities: "Utilities",
    entertainment: "Entertainment",
    health: "Healthcare",
    education: "Education",
    other: "Other",
};

const currencySymbols = {
    USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥", INR: "₹",
};

export default function Budget() {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // January
    const [budgetData, setBudgetData] = useState(MOCK_BUDGET_DATA);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editAmount, setEditAmount] = useState("");

    const currentMonth = monthNames[currentMonthIndex];
    const budget = budgetData[currentMonth];

    const formatAmount = (amount, currency = "USD") => {
        const symbol = currencySymbols[currency] || currency;
        const formatted = amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `${symbol}${formatted}`;
    };

    const totalSpent = budget?.categorySpending?.reduce((sum, cat) => sum + cat.spent, 0) || 0;
    const remaining = (budget?.amount || 0) - totalSpent;
    const percentage = budget?.amount ? Math.min((totalSpent / budget.amount) * 100, 100) : 0;

    const getBudgetStatus = () => {
        if (percentage >= 100) return { status: "over", color: "text-red-600", bgColor: "bg-red-500", icon: AlertCircle };
        if (percentage >= 80) return { status: "warning", color: "text-orange-600", bgColor: "bg-orange-500", icon: AlertCircle };
        return { status: "good", color: "text-green-600", bgColor: "bg-green-500", icon: CheckCircle };
    };

    const status = getBudgetStatus();
    const StatusIcon = status.icon;

    const handlePrevMonth = () => {
        setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
    };

    const handleUpdateBudget = () => {
        if (editAmount && parseFloat(editAmount) > 0) {
            const newBudget = {
                ...budget,
                id: budget?.id || Date.now().toString(),
                name: `${monthLabels[currentMonth]} Budget`,
                amount: parseFloat(editAmount),
                currency: "USD",
                month: currentMonth,
                year: 2026,
                categorySpending: budget?.categorySpending || [],
            };
            setBudgetData({ ...budgetData, [currentMonth]: newBudget });
            setIsEditDialogOpen(false);
            setEditAmount("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget</h1>
                    <p className="text-gray-600">
                        Manage your monthly budget and track spending
                    </p>
                </div>

                {/* Month Selector */}
                <Card className="mb-6 border-0 shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevMonth}
                                className="h-10 w-10"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-gray-600" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {monthLabels[currentMonth]} 2026
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNextMonth}
                                className="h-10 w-10"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {budget ? (
                    <>
                        {/* Budget Overview Card */}
                        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                            <CardContent className="pt-8 pb-8">
                                <div className="text-white space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium opacity-90 mb-2">
                                                Monthly Budget
                                            </p>
                                            <p className="text-5xl font-bold mb-1">
                                                {formatAmount(budget.amount, budget.currency)}
                                            </p>
                                        </div>
                                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-white hover:bg-white/20"
                                                    onClick={() => setEditAmount(budget.amount.toString())}
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Update Budget</DialogTitle>
                                                    <DialogDescription>
                                                        Set your budget for {monthLabels[currentMonth]} 2026
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="amount">Budget Amount</Label>
                                                        <Input
                                                            id="amount"
                                                            type="number"
                                                            step="0.01"
                                                            value={editAmount}
                                                            onChange={(e) => setEditAmount(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleUpdateBudget}>Update</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm opacity-75 mb-1">Spent</p>
                                            <p className="text-2xl font-semibold">
                                                {formatAmount(totalSpent, budget.currency)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm opacity-75 mb-1">Remaining</p>
                                            <p className={`text-2xl font-semibold ${remaining < 0 ? 'text-red-200' : ''}`}>
                                                {formatAmount(remaining, budget.currency)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-90">{percentage.toFixed(0)}% used</span>
                                            <StatusIcon className="h-5 w-5" />
                                        </div>
                                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${status.bgColor} transition-all duration-300`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Breakdown */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Spending by Category
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {budget.categorySpending.map((cat) => {
                                    const Icon = categoryIcons[cat.category];
                                    const catPercentage = budget.amount ? (cat.spent / budget.amount) * 100 : 0;

                                    return (
                                        <Card key={cat.category} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                            <CardContent className="pt-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 rounded-lg bg-gray-100">
                                                        <Icon className="h-5 w-5 text-gray-700" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900">
                                                            {categoryLabels[cat.category]}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {formatAmount(cat.spent, budget.currency)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Progress value={catPercentage} className="h-2" />
                                                    <p className="text-xs text-gray-500 text-right">
                                                        {catPercentage.toFixed(1)}% of budget
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                ) : (
                    <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="pt-12 pb-12 text-center">
                            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No Budget Set
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Set a budget for {monthLabels[currentMonth]} to start tracking your spending
                            </p>
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>Set Budget</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Set Budget</DialogTitle>
                                        <DialogDescription>
                                            Create a budget for {monthLabels[currentMonth]} 2026
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="amount">Budget Amount</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={editAmount}
                                                onChange={(e) => setEditAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleUpdateBudget}>Set Budget</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
