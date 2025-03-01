import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import dayjs from "dayjs";
import { getSubscription } from "../../services/adminService";
import SideBar from "./SideBar";
import StatCard from "./StatCard";
import { 
  CreditCard, 
  Users, 
  DollarSign, 
  TrendingUp,
  ChevronDown,
  Filter
} from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  price: number;
  validity: string;
  status: string;
  features: string[];
  usersCount: number;
  totalRevenue: number;
  createdAt: string;
}

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [salesData, setSalesData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("revenue");

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.totalRevenue, 0);
  const totalSubscriptions = subscriptions.length;
  const totalUsers = subscriptions.reduce((sum, sub) => sum + sub.usersCount, 1);
  const avgPrice = totalSubscriptions > 0 
    ? subscriptions.reduce((sum, sub) => sum + sub.price, 0) / totalSubscriptions 
    : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const distributionData = subscriptions
    .filter(sub => sub.price > 0)
    .map((sub) => ({
      name: sub.name,
      value: sub.price,
    }));

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await getSubscription();
        
        if (!Array.isArray(response)) {
          console.error("Expected an array but got:", response);
          return;
        }
    
        const processedSubscriptions = response.map((sub: any) => ({
          id: sub._id,
          name: sub.name,
          price: sub.price,
          validity: sub.validity,
          status: sub.status,
          features: sub.features,
          usersCount: Array.isArray(sub.users) ? sub.users.length : 0,
          totalRevenue: sub.price * (Array.isArray(sub.users) ? sub.users.length : 0),
          createdAt: sub.createdAt,
        }));
    
        setSubscriptions(processedSubscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const processSalesData = () => {
      const today = dayjs();
      const sampleData: Record<string, number> = {};
      
      if (timeRange === "month") {
        for (let i = 0; i < 6; i++) {
          const date = today.subtract(i, 'month');
          sampleData[date.format("MMM YYYY")] = Math.floor(Math.random() * 5000) + 1000;
        }
      } else if (timeRange === "quarter") {
        for (let i = 0; i < 4; i++) {
          const date = today.subtract(i * 3, 'month');
          const quarter = Math.ceil((date.month() + 1) / 3);
          sampleData[`Q${quarter} ${date.year()}`] = Math.floor(Math.random() * 15000) + 5000;
        }
      } else {
        for (let i = 0; i < 5; i++) {
          const year = today.subtract(i, 'year').year();
          sampleData[year.toString()] = Math.floor(Math.random() * 50000) + 20000;
        }
      }
      
      subscriptions.forEach((sub) => {
        const date = dayjs(sub.createdAt);
        let key = "";

        if (timeRange === "month") {
          key = date.format("MMM YYYY");
        } else if (timeRange === "quarter") {
          key = `Q${Math.ceil((date.month() + 1) / 3)} ${date.year()}`;
        } else {
          key = date.format("YYYY");
        }

        if (sampleData[key]) {
          sampleData[key] += sub.totalRevenue;
        }
      });

      const processedData = Object.entries(sampleData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => {
          if (timeRange === "year") {
            return parseInt(a.name) - parseInt(b.name);
          }
          return -1; 
        });

      setSalesData(processedData);
    };

    processSalesData();
  }, [subscriptions, timeRange]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      );
    }

    if (activeTab === "revenue") {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (activeTab === "growth") {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, "Growth"]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ r: 6, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <Pie
              data={distributionData.length > 0 ? distributionData : [{ name: "No data", value: 1 }]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {distributionData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
formatter={(value) => [
    typeof value === "number" ? `$${value.toFixed(2)}` : `$${Number(value).toFixed(2)}`,
    "Price"
  ]}              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="flex">
      <SideBar />
      
      <div className="p-8 w-full">
        <div className="flex justify-between items-center ">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, Admin</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>
           
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`$${totalRevenue.toLocaleString()}`}
            change="12.5% from last month"
            positive={true}
            icon={<DollarSign size={20} className="text-white" />}
            color="bg-blue-600"
          />
          <StatCard 
            title="Subscriptions" 
            value={totalSubscriptions}
            change="4 new this month"
            positive={true}
            icon={<CreditCard size={20} className="text-white" />}
            color="bg-purple-600"
          />
          <StatCard 
            title="Total Users" 
            value={totalUsers}
            change="8.3% increase"
            positive={true}
            icon={<Users size={20} className="text-white" />}
            color="bg-green-600"
          />
          <StatCard 
            title="Average Price" 
            value={`$${avgPrice.toFixed(2)}`}
            change="No change"
            positive={true}
            icon={<TrendingUp size={20} className="text-white" />}
            color="bg-orange-600"
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">Analytics Overview</h3>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setActiveTab("revenue")}
                  className={`px-4 py-2 text-sm ${
                    activeTab === "revenue" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Revenue
                </button>
                <button 
                  onClick={() => setActiveTab("growth")}
                  className={`px-4 py-2 text-sm ${
                    activeTab === "growth" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Growth
                </button>
                <button 
                  onClick={() => setActiveTab("distribution")}
                  className={`px-4 py-2 text-sm ${
                    activeTab === "distribution" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Distribution
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span>{timeRange === "month" ? "Monthly" : timeRange === "quarter" ? "Quarterly" : "Yearly"}</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden">
                  {["month", "quarter", "year"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {range === "month" ? "Monthly" : range === "quarter" ? "Quarterly" : "Yearly"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {renderChart()}
        </div>
        
        
      </div>
    </div>
  );
};

export default Dashboard;