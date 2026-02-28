import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { selectIsAuthenticated, logout } from "@/store/authSlice";
import { useLogoutMutation } from "@/api/authApi";

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const [logoutApi] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch {
            // Clear local state even if server logout fails
        }
        dispatch(logout());
        navigate("/login");
    };

    return (
        <header className="border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-xl font-bold">
                        FinanceApp
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Dashboard
                        </Link>
                        <Link to="/accounts" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Accounts
                        </Link>
                        <Link to="/budget" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Budget
                        </Link>
                        <Link to="/transactions" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Transactions
                        </Link>
                        <Link to="/profile" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Profile
                        </Link>
                    </nav>
                </div>
                <div>
                    {isLoggedIn ? (
                        <Button variant="ghost" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Link to="/login">
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
