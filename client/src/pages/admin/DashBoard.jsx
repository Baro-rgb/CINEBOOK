import React, { useEffect, useState } from "react";
import { 
  ChartLine as ChartLineIcon,
  CircleDollarSign as CircleDollarSignIcon,
  PlayCircle as PlayCircleIcon,
  Star as StarIcon,
  User as UserIcon,
  TrendingUp as TrendingUpIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import timeFormat from "../../lib/timeFormat";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const DashBoard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUsers: 0,
    monthlyRevenue: [],
    movieRevenue: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  // Format tiền VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const dashboardCards = [
    {
      title: "Tổng số lượt đặt chỗ",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
      color: "from-[#F84565] to-[#D63854]",
    },
    {
      title: "Tổng doanh thu",
      value: `${currency} ${formatVND(dashboardData.totalRevenue || 0)}`,
      icon: CircleDollarSignIcon,
      color: "from-[#D63854] to-[#F84565]",
    },
    {
      title: "Phim đang chiếu",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
      color: "from-[#F84565] to-pink-600",
    },
    {
      title: "Tổng người dùng",
      value: dashboardData.totalUsers || "0",
      icon: UserIcon,
      color: "from-pink-600 to-[#F84565]",
    },
  ];

  const COLORS = ['#F84565', '#D63854', '#ec4899', '#ff6b8a', '#ff5273', '#d91f42', '#ff4d6d', '#c9184a'];

  // Tính toán dữ liệu thật từ activeShows
  const calculateRealData = (shows) => {
    // Tính doanh thu theo phim
    const movieRevenueMap = {};
    
    shows.forEach(show => {
      const movieTitle = show.movie.title;
      const bookings = Object.keys(show.occupiedSeats || {}).length;
      const revenue = bookings * show.showPrice;
      
      if (movieRevenueMap[movieTitle]) {
        movieRevenueMap[movieTitle].revenue += revenue;
        movieRevenueMap[movieTitle].bookings += bookings;
      } else {
        movieRevenueMap[movieTitle] = {
          name: movieTitle.length > 15 ? movieTitle.substring(0, 15) + '...' : movieTitle,
          fullName: movieTitle,
          revenue: revenue,
          bookings: bookings,
          rating: show.movie.vote_average,
        };
      }
    });

    // Chuyển thành array và sắp xếp theo doanh thu
    const movieRevenue = Object.values(movieRevenueMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    // Tính doanh thu theo tháng (group theo tháng từ showDateTime)
    const monthlyRevenueMap = {};
    const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    
    shows.forEach(show => {
      if (show.showDateTime) {
        const date = new Date(show.showDateTime);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const monthLabel = monthNames[date.getMonth()];
        
        const bookings = Object.keys(show.occupiedSeats || {}).length;
        const revenue = bookings * show.showPrice;
        
        if (monthlyRevenueMap[monthKey]) {
          monthlyRevenueMap[monthKey].revenue += revenue;
          monthlyRevenueMap[monthKey].bookings += bookings;
        } else {
          monthlyRevenueMap[monthKey] = {
            month: monthLabel,
            revenue: revenue,
            bookings: bookings,
            date: date,
          };
        }
      }
    });

    // Chuyển thành array và sắp xếp theo thời gian
    const monthlyRevenue = Object.values(monthlyRevenueMap)
      .sort((a, b) => a.date - b.date)
      .slice(-12); // Lấy 12 tháng gần nhất

    return { movieRevenue, monthlyRevenue };
  };

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        // Tính toán dữ liệu thật từ activeShows
        const { movieRevenue, monthlyRevenue } = calculateRealData(data.dashboardData.activeShows);
        
        const enhancedData = {
          ...data.dashboardData,
          monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue : [],
          movieRevenue: movieRevenue.length > 0 ? movieRevenue : [],
        };
        
        setDashboardData(enhancedData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu dashboard");
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#09090B]/95 border border-[#F84565]/30 rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Doanh thu') 
                ? `${currency} ${formatVND(entry.value)}` 
                : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format Y axis cho chart
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  return !loading ? (
    <div className="pb-10">
      <Title text1="Tổng" text2="Quan" />

      {/* Statistics Cards */}
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-6 py-5 bg-gradient-to-br ${card.color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-w-[280px] flex-1`}
          >
            <div>
              <h1 className="text-sm text-white/80 font-medium">{card.title}</h1>
              <p className="text-2xl font-bold mt-2 text-white">{card.value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <card.icon className="w-7 h-7 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
        {/* Monthly Revenue Chart */}
        <div className="relative bg-[#09090B]/50 border border-[#F84565]/20 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <BlurCircle top="50px" left="-5%" />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#F84565]/20 p-2 rounded-lg">
                <TrendingUpIcon className="w-5 h-5 text-[#F84565]" />
              </div>
              <h2 className="text-lg font-semibold">Doanh thu theo tháng</h2>
            </div>
            <select 
              className="bg-[#F84565]/10 border border-[#F84565]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F84565]/50"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="6months">6 tháng</option>
              <option value="12months">12 tháng</option>
            </select>
          </div>
          {dashboardData.monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.monthlyRevenue.slice(selectedPeriod === "6months" ? -6 : -12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F84565" 
                  strokeWidth={3}
                  name="Doanh thu"
                  dot={{ fill: '#F84565', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  name="Lượt đặt"
                  dot={{ fill: '#ec4899', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Chưa có dữ liệu doanh thu
            </div>
          )}
        </div>

        {/* Movie Revenue Chart */}
        <div className="relative bg-[#09090B]/50 border border-[#F84565]/20 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <BlurCircle top="50px" right="-5%" />
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#F84565]/20 p-2 rounded-lg">
              <CircleDollarSignIcon className="w-5 h-5 text-[#F84565]" />
            </div>
            <h2 className="text-lg font-semibold">Doanh thu theo phim</h2>
          </div>
          {dashboardData.movieRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.movieRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu" radius={[8, 8, 0, 0]}>
                  {dashboardData.movieRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Chưa có dữ liệu doanh thu phim
            </div>
          )}
        </div>
      </div>

      {/* Top Movies Performance Table */}
      {dashboardData.movieRevenue.length > 0 && (
        <div className="relative bg-[#09090B]/50 border border-[#F84565]/20 rounded-xl p-6 shadow-lg backdrop-blur-sm mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#F84565]/20 p-2 rounded-lg">
              <StarIcon className="w-5 h-5 text-[#F84565] fill-[#F84565]" />
            </div>
            <h2 className="text-lg font-semibold">Top phim có doanh thu cao</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F84565]/20">
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Xếp hạng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Tên phim</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">Doanh thu</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">Lượt đặt</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.movieRevenue.slice(0, 5).map((movie, index) => (
                  <tr key={index} className="border-b border-[#F84565]/10 hover:bg-[#F84565]/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0 ? 'bg-[#F84565]/30 text-[#F84565]' :
                        index === 1 ? 'bg-[#D63854]/30 text-[#D63854]' :
                        index === 2 ? 'bg-pink-600/30 text-pink-600' :
                        'bg-[#F84565]/20 text-[#F84565]'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{movie.fullName || movie.name}</td>
                    <td className="py-3 px-4 text-right font-semibold text-[#F84565]">
                      {currency} {formatVND(movie.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right">{movie.bookings}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-yellow-500">
                        <StarIcon className="w-4 h-4 fill-yellow-500" />
                        {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Shows Section */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#F84565]/20 p-2 rounded-lg">
            <PlayCircleIcon className="w-5 h-5 text-[#F84565]" />
          </div>
          <h2 className="text-lg font-semibold">Phim đang chiếu</h2>
        </div>
        <span className="text-sm text-gray-400">{dashboardData.activeShows.length} phim</span>
      </div>

      <div className="relative flex flex-wrap gap-6">
        <BlurCircle top="100px" left="-10%" />
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-64 rounded-xl overflow-hidden bg-[#09090B]/50 border border-[#F84565]/20 hover:border-[#F84565]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#F84565]/20 transition-all duration-300 group"
          >
            <div className="relative overflow-hidden">
              <img
                src={image_base_url + show.movie.poster_path}
                alt={show.movie.title}
                className="h-80 w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-base truncate mb-2">{show.movie.title}</p>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xl font-bold text-[#F84565]">
                  {currency} {formatVND(show.showPrice)}
                </p>
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                  <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-yellow-500">
                    {show.movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CalendarIcon className="w-4 h-4" />
                <span>{timeFormat(show.showDateTime)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default DashBoard;