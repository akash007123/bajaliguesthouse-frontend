import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  History,
  User,
  LogOut,
  Menu,
  X,
  CreditCard,
  Settings,
  ChevronRight,
  BedDouble,
  Users,
  Package,
  MapPin,
  PlusCircle,
  Star,
  Bell,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import NotificationsModal from "@/components/common/NotificationsModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const userNavItems: NavItem[] = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Book Room", path: "/user/dashboard/book", icon: Calendar },
  { name: "Booking History", path: "/user/dashboard/history", icon: History },
  { name: "Profile", path: "/user/dashboard/profile", icon: User },
];

const adminNavItems: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Contacts", path: "/admin/dashboard/contacts", icon: Package },
  { name: "Bookings", path: "/admin/dashboard/bookings", icon: Calendar },
  { name: "Rooms", path: "/admin/dashboard/rooms", icon: BedDouble },
  { name: "Add Room", path: "/admin/dashboard/rooms/add", icon: PlusCircle },
  { name: "Custom Booking", path: "/admin/dashboard/rooms/custom", icon: BedDouble },
  { name: "Staff", path: "/admin/dashboard/rooms/staff", icon: Users },
  { name: "Revenue", path: "/admin/dashboard/rooms/revenue", icon: CreditCard },
  { name: "Users", path: "/admin/dashboard/users", icon: Users },
  { name: "Reviews", path: "/admin/dashboard/reviews", icon: Star },
  { name: "Darshans", path: "/admin/dashboard/darshans", icon: MapPin },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useSocket();

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;
  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden",
          active
            ? "bg-gradient-to-r from-gold/20 to-gold/5 text-gold-dark font-medium shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {active && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-gold/10 border-l-4 border-gold rounded-r-xl"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <item.icon
          className={cn(
            "w-5 h-5 transition-colors duration-300 z-10",
            active ? "text-gold" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        <span className="z-10 relative">{item.name}</span>
        {active && (
          <ChevronRight className="w-4 h-4 ml-auto text-gold opacity-50 z-10" />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-gold/20 selection:text-gold-dark">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-500 ease-in-out hidden md:block",
          sidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="h-full flex flex-col bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border shadow-2xl overflow-hidden">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-sidebar-border/50">
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold shrink-0">
                <span className="font-serif font-bold text-white text-xl">SB</span>
              </div>
              <div
                className={cn(
                  "transition-all duration-300 flex flex-col",
                  sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 absolute left-20"
                )}
              >
                <span className="font-serif font-bold text-lg text-sidebar-foreground truncate">
                  Shri Balaji
                </span>
                <span className="text-xs text-sidebar-foreground/60 uppercase tracking-wider">
                  Homestay
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
            {/* Small toggle button inside sidebar content area to minimize visual noise */}
            <div className="flex justify-end mb-4 px-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-sidebar-accent/50 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-gold transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
              </Button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                sidebarOpen ? (
                  <NavLink key={item.path} item={item} />
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 mx-auto",
                      isActive(item.path)
                        ? "bg-gold/20 text-gold shadow-sm"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    title={item.name}
                  >
                    <item.icon className="w-5 h-5" />
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-sidebar-border/50 bg-sidebar-accent/5">
            {sidebarOpen ? (
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors cursor-pointer group">
                <Avatar className="w-10 h-10 border-2 border-gold/20 group-hover:border-gold transition-colors">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-gold/10 text-gold-dark font-serif font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-sidebar-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
                </div>
                <Settings className="w-4 h-4 text-sidebar-foreground/40 group-hover:text-gold transition-colors" />
              </div>
            ) : (
              <div className="flex justify-center">
                <Avatar className="w-10 h-10 border-2 border-gold/20 hover:border-gold transition-colors cursor-pointer">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-gold/10 text-gold-dark font-serif font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-500 min-h-screen flex flex-col",
          sidebarOpen ? "md:ml-72" : "md:ml-20"
        )}
      >
        {/* Top Header */}
        <header
          className={cn(
            "sticky top-0 z-30 h-20 px-6 flex items-center justify-between transition-all duration-300",
            scrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50" : "bg-transparent"
          )}
        >
          {/* Mobile Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
              <Menu className="w-6 h-6 text-foreground" />
            </Button>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center w-full max-w-md bg-muted/30 rounded-full border border-border/50 focus-within:border-gold/50 focus-within:bg-background transition-all duration-300 px-4 py-2 ml-4">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-muted-foreground hover:text-gold hover:bg-gold/10 transition-colors"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full pl-2 pr-4 gap-2 hover:bg-gold/10 hover:text-gold-dark hidden md:flex">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className="text-xs">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-border/50 backdrop-blur-xl bg-background/95">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(user?.role === 'admin' ? '/admin/dashboard/profile' : '/user/dashboard/profile')} className="cursor-pointer rounded-lg focus:bg-gold/10 focus:text-gold-dark">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg focus:bg-red-50 focus:text-red-500 text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-background z-50 md:hidden shadow-2xl flex flex-col border-r border-border"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
                    <span className="font-serif font-bold text-white text-xl">SB</span>
                  </div>
                  <span className="font-serif font-bold text-xl text-foreground">Shri Balaji</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} />
                  ))}
                </nav>
              </div>

              <div className="p-4 border-t border-border/50">
                <Button onClick={handleLogout} variant="destructive" className="w-full justify-start gap-2 rounded-xl">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <NotificationsModal
        notifications={notifications}
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onClearAll={clearNotifications}
      />
    </div>
  );
};
