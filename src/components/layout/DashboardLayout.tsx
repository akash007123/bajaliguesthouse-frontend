import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BedDouble,
  Calendar,
  History,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Settings,
  ChevronLeft,
  Computer,
  Bed,
  BadgeIndianRupee,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  { name: "Bookings", path: "/admin/dashboard/bookings", icon: Calendar },
  { name: "Rooms", path: "/admin/dashboard/rooms", icon: BedDouble },
  { name: "Add Room", path: "/admin/dashboard/rooms/add", icon: PlusCircle },
  { name: "Custom", path: "/admin/dashboard/rooms/custom", icon: Bed },
  { name: "Staff", path: "/admin/dashboard/rooms/staff", icon: Computer },
  { name: "Revenue", path: "/admin/dashboard/rooms/revenue", icon: BadgeIndianRupee },
  { name: "Profile", path: "/admin/dashboard/profile", icon: User },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Ref for the scrollable container
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  // Store scroll position
  const scrollPositionRef = useRef(0);

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Save scroll position before navigation
  const saveScrollPosition = () => {
    if (scrollableContainerRef.current) {
      scrollPositionRef.current = scrollableContainerRef.current.scrollTop;
    }
  };

  // Restore scroll position after navigation
  const restoreScrollPosition = () => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = scrollPositionRef.current;
    }
  };

  // Handle link click in the bottom section
  const handleBottomLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    saveScrollPosition();
    setMobileOpen(false);
    
    // Small delay to ensure DOM updates before restoring scroll
    setTimeout(restoreScrollPosition, 10);
  };

  // Restore scroll position when sidebar state changes
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.scrollTop = scrollPositionRef.current;
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border flex-shrink-0">
        <Link to="/" className="flex items-center space-x-2">
          <span
            className={cn(
              "font-serif font-bold text-sidebar-foreground transition-all duration-200",
              sidebarOpen ? "text-xl" : "text-sm"
            )}
          >
            {sidebarOpen ? "Shri Balaji " : "SB"}
          </span>
        </Link>
      </div>

      {/* Scrollable Navigation Area - Hidden Scrollbar */}
      <div 
        ref={scrollableContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide"
      >
        <nav className="space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                saveScrollPosition();
                setMobileOpen(false);
              }}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive(item.path)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Section - Fixed at bottom */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        <div
          className={cn(
            "flex items-center mb-4",
            sidebarOpen ? "space-x-3" : "justify-center"
          )}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-sidebar-primary/20 ring-offset-2 ring-offset-sidebar">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-sidebar"></div>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <Badge
                  variant="secondary"
                  className="text-xs capitalize px-1.5 py-0 h-5"
                >
                  {user?.role}
                </Badge>
              </div>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-sidebar-foreground/60 mb-2">
              <span>Account Status</span>
              <Badge
                variant="outline"
                className="text-emerald-500 border-emerald-500/30"
              >
                Active
              </Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Link
            to={
              user?.role === "admin"
                ? "/admin/dashboard/profile"
                : "/user/dashboard/profile"
            }
            onClick={handleBottomLinkClick}
          >
            <Button
              variant="hotel"
              size="sm"
              className={cn(
                "flex-1 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground",
                !sidebarOpen && "px-0"
              )}
            >
              <Settings className="w-4 h-4" />
              {sidebarOpen && <span className="ml-2">Settings</span>}
            </Button>
          </Link>
          <Button
            variant="hotel"
            size="sm"
            onClick={() => {
              // Save scroll position before showing alerts/modal
              saveScrollPosition();
            }}
            className={cn(
              "flex-1 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground relative",
              !sidebarOpen && "px-0"
            )}
          >
            <Bell className="w-4 h-4" />
            {sidebarOpen && <span className="ml-2">Alerts</span>}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </Button>
        </div>

        <Button
          onClick={() => {
            saveScrollPosition();
            handleLogout();
          }}
          variant="ghost"
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground w-full",
            sidebarOpen ? "justify-start" : "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4" />
          {sidebarOpen && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar transition-all duration-300 shadow-lg fixed left-0 top-0 h-screen",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <NavContent />
        {/* Collapse Button */}
        <button
          onClick={() => {
            saveScrollPosition();
            setSidebarOpen(!sidebarOpen);
          }}
          className="absolute top-24 -right-3 w-6 h-6 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground shadow-lg z-10"
          style={{ left: sidebarOpen ? "248px" : "68px" }}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              !sidebarOpen && "rotate-180"
            )}
          />
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar h-16 flex items-center justify-between px-4">
        <Link
          to="/"
          className="font-serif font-bold text-sidebar-foreground text-xl"
        >
          Shri Balaji
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-sidebar-foreground p-2"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-sidebar z-50 flex flex-col shadow-xl"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 mt-16 md:mt-0",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};