import { Link } from "react-router-dom";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    DollarSign,
    ArrowUpCircle,
    ArrowDownCircle,
    ArrowRightLeft,
    ShoppingCart,
    Car,
    Home,
    Zap,
    Eye,
    Smile,
    Heart,
    BookOpen,
    Loader2
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetDashboardSummaryQuery } from "@/api/dashboardApi";
import { useGetAccountsQuery } from "@/api/accountApi";
import { useGetTransactionsQuery } from "@/api/transactionApi";

const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

// Configuration for categories
const categoryConfig = {
    food: { icon: ShoppingCart, color: "bg-green-500", label: "Food" },
    housing: { icon: Home, color: "bg-blue-500", label: "Housing" },
    transportation: { icon: Car, color: "bg-yellow-500", label: "Transportation" },
    utilities: { icon: Zap, color: "bg-purple-500", label: "Utilities" },
    entertainment: { icon: Smile, color: "bg-pink-500", label: "Entertainment" },
    health: { icon: Heart, color: "bg-red-500", label: "Health" },
    education: { icon: BookOpen, color: "bg-indigo-500", label: "Education" },
    other: { icon: DollarSign, color: "bg-gray-500", label: "Other" },
};

export default function Dashboard() {
    const currentDate = new Date();
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    // Fetch Dashboard Summary
    const {
        data: dashboardData,
        isLoading: isDashboardLoading
    } = useGetDashboardSummaryQuery({
        month: currentMonth,
        year: currentYear
    });

    // Fetch Accounts
    const {
        data: accountsData,
        isLoading: isAccountsLoading
    } = useGetAccountsQuery();

    // Fetch Recent Transactions
    const {
        data: transactionsData,
        isLoading: isTransactionsLoading
    } = useGetTransactionsQuery({
        month: currentMonth,
        year: currentYear
    });

    const isLoading = isDashboardLoading || isAccountsLoading || isTransactionsLoading;

    // Derived Data
    const summary = dashboardData ? {
        totalBalance: dashboardData.totalBalance,
        monthlyIncome: dashboardData.monthlyIncome,
        monthlyExpenses: dashboardData.monthlyExpense,
        netSavings: dashboardData.netSavings,
    } : {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        netSavings: 0,
    };

    const accounts = accountsData?.accounts?.slice(0, 3) || [];
    const recentTransactions = transactionsData?.transactions?.slice(0, 5) || [];

    // Map backend categories to frontend config
    const categorySpending = (dashboardData?.expensePercentageByCategory || []).map(cat => ({
        name: categoryConfig[cat.category]?.label || cat.category,
        amount: cat.total,
        icon: categoryConfig[cat.category]?.icon || DollarSign,
        color: categoryConfig[cat.category]?.color || "bg-gray-500",
        // The API returns percentageOfBudget (0-1 range likely or 0-100? User example showed 0.05 for 50/1000 maybe?)
        // User example: "percentageOfBudget": 0.05. So 0.05 * 100 = 5%.
        // But for the visual progress bar in "Spending by Category", we usually want % relative to total expenses or budget.
        // The previous code calculated relative to total displayed expenses.
        // Let's use the provided percentageOfBudget if available, but multiply by 100 if it's < 1.
        // Actually, let's normalize:
        percentage: cat.percentageOfBudget > 1 ? cat.percentageOfBudget : cat.percentageOfBudget * 100
    }));

    const totalSpending = categorySpending.reduce((sum, cat) => sum + cat.amount, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Math.abs(amount || 0));
    };

    const getTransactionIcon = (type) => {
        const icons = {
            income: ArrowUpCircle,
            expense: ArrowDownCircle,
            transfer: ArrowRightLeft,
        };
        return icons[type] || DollarSign;
    };

    const getTransactionColor = (type) => {
        const colors = {
            income: "text-green-600",
            expense: "text-red-600",
            transfer: "text-blue-600",
        };
        return colors[type] || "text-gray-600";
    };

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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your financial overview for {currentMonth} {currentYear}</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-sm font-medium opacity-90 mb-1">Total Balance</p>
                                    <p className="text-3xl font-bold">{formatCurrency(summary.totalBalance)}</p>
                                </div>
                                <Wallet className="h-10 w-10 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-sm font-medium opacity-90 mb-1">Monthly Income</p>
                                    <p className="text-3xl font-bold">{formatCurrency(summary.monthlyIncome)}</p>
                                </div>
                                <TrendingUp className="h-10 w-10 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-sm font-medium opacity-90 mb-1">Monthly Expenses</p>
                                    <p className="text-3xl font-bold">{formatCurrency(summary.monthlyExpenses)}</p>
                                </div>
                                <TrendingDown className="h-10 w-10 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-sm font-medium opacity-90 mb-1">Net Savings</p>
                                    <p className="text-3xl font-bold">{formatCurrency(summary.netSavings)}</p>
                                </div>
                                <DollarSign className="h-10 w-10 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Category Spending */}
                    <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Spending by Category</CardTitle>
                            <CardDescription>Your expenses breakdown for this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {categorySpending.length > 0 ? (
                                    categorySpending.map((category) => {
                                        const Icon = category.icon;
                                        // If using calculated percentage relative to total expenses:
                                        // const percentage = totalSpending > 0 ? (category.amount / totalSpending) * 100 : 0;
                                        // But we have percentageOfBudget from API potentially, let's use what we processed
                                        const percentage = category.percentage;

                                        return (
                                            <div key={category.name} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg bg-gray-100`}>
                                                            <Icon className="h-4 w-4 text-gray-700" />
                                                        </div>
                                                        <span className="font-medium text-gray-900">{category.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                                                        <span className="font-semibold text-gray-900">{formatCurrency(category.amount)}</span>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <Progress value={percentage} className="h-2" />
                                                    <div
                                                        className={`absolute top-0 left-0 h-2 rounded-full ${category.color} transition-all`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No expenses recorded for this month.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Accounts Overview */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Accounts</CardTitle>
                                    <CardDescription>Quick overview</CardDescription>
                                </div>
                                <Link to="/accounts">
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4 mr-1" />
                                        View All
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {accounts.length > 0 ? (
                                    accounts.map((account, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">{account.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{account.type.replace('_', ' ')}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900">{formatCurrency(account.balance)}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No accounts found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>Your latest activity</CardDescription>
                            </div>
                            <Link to="/transactions">
                                <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((txn) => {
                                    const Icon = getTransactionIcon(txn.type);
                                    const colorClass = getTransactionColor(txn.type);

                                    return (
                                        <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-gray-100`}>
                                                    <Icon className={`h-4 w-4 ${colorClass}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{txn.description}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(txn.date).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`font-semibold ${colorClass}`}>
                                                {txn.type === 'expense' ? '-' : '+'}{formatCurrency(txn.amount)}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No recent transactions.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
