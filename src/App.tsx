import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { PublicLayout } from "./components/layout/PublicLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { UnauthenticatedRoute } from "./components/common/UnauthenticatedRoute";

// Public Pages
import Home from "./pages/public/Home";
import Rooms from "./pages/public/Rooms";
import RoomDetails from "./pages/public/RoomDetails";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import UjjainDarshan from "./pages/public/UjjainDarshan";

// Auth Pages
import { UserLogin, AdminLogin } from "./pages/auth/AuthLogin";
import { UserSignup, AdminSignup } from "./pages/auth/AuthSignup";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import BookRoom from "./pages/user/BookRoom";
import BookingHistory from "./pages/user/BookingHistory";
import UserProfile from "./pages/user/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminAddRoom from "./pages/admin/AdminAddRoom";
import AdminEditRoom from "./pages/admin/AdminEditRoom";
import AdminCustomBooking from "./pages/admin/AdminCustomBooking";
import RevenueDashboard from "./pages/admin/RevenueDashboard";
import Staff from "./pages/admin/Staff";
import Users from "./pages/admin/Users";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminDarshans from "./pages/admin/AdminDarshans";
import AdminAddDarshan from "./pages/admin/AdminAddDarshan";
import AdminEditDarshan from "./pages/admin/AdminEditDarshan";
import AdminNewsletters from "./pages/admin/AdminNewsletters";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ujjain-darshan" element={<UjjainDarshan />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<UnauthenticatedRoute><UserLogin /></UnauthenticatedRoute>} />
            <Route path="/signup" element={<UnauthenticatedRoute><UserSignup /></UnauthenticatedRoute>} />
            <Route path="/admin/login" element={<UnauthenticatedRoute><AdminLogin /></UnauthenticatedRoute>} />
            <Route path="/admin/signup" element={<UnauthenticatedRoute><AdminSignup /></UnauthenticatedRoute>} />

            {/* User Dashboard Routes */}
            <Route path="/user/dashboard" element={<ProtectedRoute allowedRole="user"><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<UserDashboard />} />
              <Route path="book" element={<BookRoom />} />
              <Route path="history" element={<BookingHistory />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="rooms" element={<AdminRooms />} />
              <Route path="rooms/add" element={<AdminAddRoom />} />
              <Route path="rooms/edit/:id" element={<AdminEditRoom />} />
              <Route path="rooms/custom" element={<AdminCustomBooking />} />
              <Route path="rooms/revenue" element={<RevenueDashboard />} />
              <Route path="rooms/staff" element={<Staff />} />
              <Route path="users" element={<Users />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="darshans" element={<AdminDarshans />} />
              <Route path="darshans/add" element={<AdminAddDarshan />} />
              <Route path="darshans/edit/:id" element={<AdminEditDarshan />} />
              <Route path="newsletters" element={<AdminNewsletters />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
