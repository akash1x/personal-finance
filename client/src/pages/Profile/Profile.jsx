import { useState } from "react";
import { User, Mail, AtSign, Calendar, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Mock user data
const MOCK_USER = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    createdAt: "2025-06-15T10:30:00Z",
};

export default function Profile() {
    const [user, setUser] = useState(MOCK_USER);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
    });

    const handleEditProfile = () => {
        setUser({
            ...user,
            ...editForm,
        });
        setIsEditDialogOpen(false);
    };

    const getInitials = () => {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getMembershipDuration = () => {
        const created = new Date(user.createdAt);
        const now = new Date();
        const months = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 30));
        if (months < 1) return "Less than a month";
        if (months === 1) return "1 month";
        if (months < 12) return `${months} months`;
        const years = Math.floor(months / 12);
        return years === 1 ? "1 year" : `${years} years`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <Card className="mb-6 border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                                    {getInitials()}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl mb-1">
                                        {user.firstName} {user.lastName}
                                    </CardTitle>
                                    <CardDescription className="text-white/80">
                                        @{user.username}
                                    </CardDescription>
                                </div>
                            </div>
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="text-white hover:bg-white/20"
                                        onClick={() => setEditForm({
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            username: user.username,
                                            email: user.email,
                                        })}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your profile information
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={editForm.firstName}
                                                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={editForm.lastName}
                                                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                value={editForm.username}
                                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleEditProfile}>
                                            <Check className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                                    <p className="font-semibold text-gray-900">{user.email}</p>
                                </div>
                            </div>

                            {/* Username */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-50">
                                    <AtSign className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Username</p>
                                    <p className="font-semibold text-gray-900">@{user.username}</p>
                                </div>
                            </div>

                            {/* Member Since */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-green-50">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                                    <p className="font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>

                            {/* Account Age */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-orange-50">
                                    <User className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Account Age</p>
                                    <p className="font-semibold text-gray-900">{getMembershipDuration()}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-md">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-indigo-600 mb-1">5</p>
                                <p className="text-sm text-gray-600">Active Accounts</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-600 mb-1">47</p>
                                <p className="text-sm text-gray-600">Transactions</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-pink-600 mb-1">1</p>
                                <p className="text-sm text-gray-600">Active Budgets</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
