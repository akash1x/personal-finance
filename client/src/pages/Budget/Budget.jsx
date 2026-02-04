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
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { useGetBudgetStatusQuery, useCreateBudgetMutation, useUpdateBudgetMutation } from "@/api/budgetApi";

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

export default function Budget() {
    const currentDate = new Date();
    const [currentMonthIndex, setCurrentMonthIndex] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editAmount, setEditAmount] = useState("");

    const currentMonth = monthNames[currentMonthIndex];

    // Fetch budget status from API (same budget for all months, but expenses vary by month)
    const { data: budget, isLoading, error } = useGetBudgetStatusQuery({
        month: currentMonth,
        year: currentYear,
    });
    const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
    const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();

    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return "$0.00";
        return `$${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // API response: { budgetAmount, remainingBudget, expenseByCategory }
    const budgetAmount = budget?.budgetAmount || 0;
    const remaining = budget?.remainingBudget || 0;
    const expenseByCategory = budget?.expenseByCategory || [];
    const totalSpent = budgetAmount - remaining;
    const percentage = budgetAmount ? Math.min((totalSpent / budgetAmount) * 100, 100) : 0;

    const getBudgetStatus = () => {
        if (percentage >= 100) return { status: "over", color: "text-red-600", bgColor: "bg-red-500", icon: AlertCircle };
        if (percentage >= 80) return { status: "warning", color: "text-orange-600", bgColor: "bg-orange-500", icon: AlertCircle };
        return { status: "good", color: "text-green-600", bgColor: "bg-green-500", icon: CheckCircle };
    };

    const status = getBudgetStatus();
    const StatusIcon = status.icon;

    const handlePrevMonth = () => {
        if (currentMonthIndex === 0) {
            setCurrentMonthIndex(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonthIndex(currentMonthIndex - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonthIndex === 11) {
            setCurrentMonthIndex(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonthIndex(currentMonthIndex + 1);
        }
    };

    const handleSaveBudget = async () => {
        if (editAmount && parseFloat(editAmount) > 0) {
            try {
                const payload = {
                    amount: parseFloat(editAmount),
                    currency: "usd",
                };

                if (budget) {
                    await updateBudget(payload).unwrap();
                } else {
                    await createBudget(payload).unwrap();
                }

                setIsEditDialogOpen(false);
                setEditAmount("");
            } catch (err) {
                console.error("Failed to save budget:", err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    // 404 means no budget exists - show "Set Budget" UI
    const hasBudget = budget && !error;

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
                                    {monthLabels[currentMonth]} {currentYear}
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

                {hasBudget ? (
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
                                                {formatAmount(budgetAmount)}
                                            </p>
                                        </div>
                                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="bg-white/10 hover:bg-white/20 text-white border-0"
                                                    onClick={() => setEditAmount(budgetAmount.toString())}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Budget
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Update Budget</DialogTitle>
                                                    <DialogDescription>
                                                        Update your monthly budget amount
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
                                                    <Button onClick={handleSaveBudget} disabled={isUpdating || isCreating}>
                                                        {isUpdating || isCreating ? "Updating..." : "Update Budget"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm opacity-75 mb-1">Spent in {monthLabels[currentMonth]}</p>
                                            <p className="text-2xl font-semibold">
                                                {formatAmount(totalSpent)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm opacity-75 mb-1">Remaining</p>
                                            <p className={`text-2xl font-semibold ${remaining < 0 ? 'text-red-200' : ''}`}>
                                                {formatAmount(remaining)}
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
                        {expenseByCategory.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Spending by Category - {monthLabels[currentMonth]}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {expenseByCategory.map((cat) => {
                                        const Icon = categoryIcons[cat.category] || DollarSign;
                                        const catPercentage = cat.percentageOfBudget || 0;

                                        return (
                                            <Card key={cat.category} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                                <CardContent className="pt-6">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-2 rounded-lg bg-gray-100">
                                                            <Icon className="h-5 w-5 text-gray-700" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">
                                                                {categoryLabels[cat.category] || cat.category}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {formatAmount(cat.total)}
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
                        )}

                        {expenseByCategory.length === 0 && (
                            <Card className="border-2 border-dashed border-gray-300">
                                <CardContent className="pt-8 pb-8 text-center">
                                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No expenses recorded for {monthLabels[currentMonth]}</p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                ) : (
                    <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="pt-12 pb-12 text-center">
                            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No Budget Set
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Set your monthly budget to start tracking your spending
                            </p>
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>Set Budget</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Set Budget</DialogTitle>
                                        <DialogDescription>
                                            Set your monthly budget amount
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
                                        <Button onClick={handleSaveBudget} disabled={isCreating || isUpdating}>
                                            {isCreating || isUpdating ? "Setting..." : "Set Budget"}
                                        </Button>
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
