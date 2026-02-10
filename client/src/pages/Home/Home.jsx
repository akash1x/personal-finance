import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    PieChart,
    Wallet,
    ArrowRight
} from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center py-24 px-4 bg-gradient-to-b from-white to-gray-50 text-center">
                <div className="max-w-3xl space-y-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                        Master Your Personal <span className="text-primary">Finances</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Track expenses, manage budgets, and gain insights into your spending habits.
                        Take control of your financial future today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto">
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto">
                                Log In
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to manage your money</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful features to help you track, analyze, and optimize your financial life.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <LayoutDashboard className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Intuitive Dashboard</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get a clear overview of your financial health with real-time summaries of your balance, income, and expenses.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <Wallet className="h-7 w-7 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Expense Tracking</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Easily log transactions and categorize them to see exactly where your money is going every month.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <PieChart className="h-7 w-7 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Budgeting</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Set monthly budgets for different categories and track your progress to stay on top of your spending goals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
