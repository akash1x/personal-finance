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

// Mock consolidated data
const DASHBOARD_DATA = {
    summary: {
        totalBalance: 8245.50,
        monthlyIncome: 5000,
        monthlyExpenses: 2180.49,
        netSavings: 2819.51,
    },
    accounts: [
        { name: "Main Checking", type: "bank", balance: 3200 },
        { name: "Savings Account", type: "bank", balance: 5000 },
        { name: "Cash Wallet", type: "cash", balance: 45.50 },
    ],
    categorySpending: [
        { name: "Housing", amount: 800, icon: Home, color: "bg-blue-500" },
        { name: "Food", amount: 450, icon: ShoppingCart, color: "bg-green-500" },
        { name: "Transportation", amount: 280, icon: Car, color: "bg-yellow-500" },
        { name: "Utilities", amount: 150, icon: Zap, color: "bg-purple-500" },
        { name: "Other", amount: 500.49, icon: DollarSign, color: "bg-gray-500" },
    ],
    recentTransactions: [
        { id: "1", description: "Grocery Store", amount: -85.50, type: "expense", date: "2026-01-28" },
        { id: "2", description: "Salary", amount: 5000, type: "income", date: "2026-01-25" },
        { id: "3", description: "Gas Station", amount: -45, type: "expense", date: "2026-01-27" },
        { id: "4", description: "Electric Bill", amount: -75, type: "expense", date: "2026-01-26" },
        { id: "5", description: "Transfer to Savings", amount: -500, type: "transfer", date: "2026-01-26" },
    ],
};

export default function Dashboard() {
    const { summary, accounts, categorySpending, recentTransactions } = DASHBOARD_DATA;

    const totalSpending = categorySpending.reduce((sum, cat) => sum + cat.amount, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Math.abs(amount));
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your financial overview</p>
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
                                {categorySpending.map((category) => {
                                    const Icon = category.icon;
                                    const percentage = (category.amount / totalSpending) * 100;

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
                                                    <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
                                                    <span className="font-semibold text-gray-900">{formatCurrency(category.amount)}</span>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <Progress value={percentage} className="h-2" />
                                                <div
                                                    className={`absolute top-0 left-0 h-2 rounded-full ${category.color} transition-all`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
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
                                {accounts.map((account, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div>
                                            <p className="font-medium text-gray-900">{account.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">{formatCurrency(account.balance)}</p>
                                    </div>
                                ))}
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
                            {recentTransactions.map((txn) => {
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
                                            {txn.amount > 0 ? "+" : ""}{formatCurrency(txn.amount)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
