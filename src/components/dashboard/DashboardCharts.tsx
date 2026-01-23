import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Booking, Room } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardChartsProps {
  bookings: Booking[];
  rooms: Room[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ bookings, rooms }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Revenue Chart */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="border-border/50 shadow-md h-full bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-serif">Revenue Overview</CardTitle>
            <CardDescription>Monthly earnings distribution for the current year.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(() => {
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const currentYear = new Date().getFullYear();
                  const monthlyData = new Array(12).fill(0);

                  bookings.forEach(booking => {
                    const date = new Date(booking.checkIn);
                    if (date.getFullYear() === currentYear && booking.status !== "Cancelled") {
                      monthlyData[date.getMonth()] += booking.totalPrice;
                    }
                  });

                  return months.map((month, index) => ({
                    name: month,
                    revenue: monthlyData[index]
                  }));
                })()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A192F', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#D4AF37' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#D4AF37"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Occupancy & Goal */}
      <motion.div variants={itemVariants} className="space-y-8">
        {/* Occupancy Donut */}
        <Card className="border-border/50 shadow-md bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-serif">Occupancy Rate</CardTitle>
            <CardDescription>Real-time room availability status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Occupied', value: rooms.filter(r => !r.available).length },
                      { name: 'Available', value: rooms.filter(r => r.available).length }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell key="cell-occupied" fill="#D4AF37" /> {/* Gold */}
                    <Cell key="cell-available" fill="#1E293B" /> {/* Slate-800 */}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A192F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-foreground">
                  {rooms.length > 0 ? ((rooms.filter(r => !r.available).length / rooms.length) * 100).toFixed(0) : 0}%
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Occupied</span>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span className="text-sm text-muted-foreground">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-800" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Goal Progress */}
        <Card className="border-border/50 shadow-md bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif">Monthly Goal</CardTitle>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <CardDescription>Revenue target for {new Date().toLocaleString('default', { month: 'long' })}</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const currentMonthRevenue = bookings.reduce((sum, b) => {
                const date = new Date(b.checkIn);
                const now = new Date();
                return (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && b.status !== "Cancelled")
                  ? sum + b.totalPrice
                  : sum;
              }, 0);
              const goal = 150000; // Updated Goal
              const percentage = Math.min((currentMonthRevenue / goal) * 100, 100);

              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-foreground">₹{currentMonthRevenue.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">of ₹{goal.toLocaleString()}</span>
                  </div>
                  <Progress value={percentage} className="h-2 bg-muted" />
                  <p className="text-xs text-muted-foreground text-center">
                    {percentage.toFixed(1)}% of your monthly target achieved
                  </p>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;