import {
  TrendingUp,
  DollarSign,
  Film,
  Users,
  Star,
  Calendar,
  Clock,
  ArrowUpRight,
  Activity
} from "lucide-react";
import React, { useEffect, useState } from "react";
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
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Tổng Đặt Vé",
      value: dashboardData.totalBookings || "0",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      change: "+12.5%"
    },
    {
      title: "Tổng Doanh Thu",
      value: `${currency} ${dashboardData.totalRevenue || "0"}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
      change: "+8.2%"
    },
    {
      title: "Phim Đang Chiếu",
      value: dashboardData.activeShows.length || "0",
      icon: Film,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      change: "+3"
    },
    {
      title: "Tổng Người Dùng",
      value: dashboardData.totalUsers || "0",
      icon: Users,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-400",
      change: "+24"
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu dashboard");
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return !loading ? (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Title text1="Quản Trị" text2="Dashboard" />
          <p className="text-zinc-400 text-sm mt-2">
            Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium">Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <BlurCircle top="-100px" left="0" color="rgba(248, 69, 101, 0.1)" />
        
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden ${card.bgColor} ${card.borderColor} border rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10`}
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />
            
            <div className="relative">
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl ${card.bgColor} ${card.borderColor} border mb-4`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>

              {/* Title */}
              <p className="text-zinc-400 text-sm font-medium mb-2">
                {card.title}
              </p>

              {/* Value */}
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white">
                  {card.value}
                </h3>
                
                {/* Change Indicator */}
                <div className={`flex items-center gap-1 ${card.textColor} text-sm font-semibold`}>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Shows Section */}
      <div className="relative">
        <BlurCircle bottom="200px" right="-10%" color="rgba(248, 69, 101, 0.08)" />
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Film className="w-7 h-7 text-primary" />
              Phim Đang Chiếu
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              {dashboardData.activeShows.length} phim đang được công chiếu
            </p>
          </div>
          
          <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
            Xem tất cả
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Shows Grid */}
        {dashboardData.activeShows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardData.activeShows.map((show) => (
              <div
                key={show._id}
                className="group relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
              >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={image_base_url + show.movie.poster_path}
                    alt={show.movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-zinc-950/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-zinc-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-white">
                      {show.movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-bold text-white text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {show.movie.title}
                  </h3>

                  {/* Info Row */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Price */}
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">
                        {currency} {show.showPrice}
                      </span>
                    </div>

                    {/* Genre Badge */}
                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg border border-primary/30">
                      {show.movie.genres?.[0]?.name || "Movie"}
                    </span>
                  </div>

                  {/* Showtime */}
                  <div className="flex items-center gap-2 text-sm text-zinc-400 pt-3 border-t border-zinc-800">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <span>{timeFormat(show.showDateTime)}</span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Film className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-400 mb-2">
              Chưa có phim đang chiếu
            </h3>
            <p className="text-zinc-500 text-sm">
              Hãy thêm phim mới vào hệ thống
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-zinc-400 text-sm font-medium">Hôm nay</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {dashboardData.totalBookings || 0}
          </p>
          <p className="text-zinc-500 text-xs mt-1">Vé đã đặt</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-zinc-400 text-sm font-medium">Doanh thu</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {currency} {dashboardData.totalRevenue || 0}
          </p>
          <p className="text-zinc-500 text-xs mt-1">Tổng thu nhập</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-zinc-400 text-sm font-medium">Người dùng</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {dashboardData.totalUsers || 0}
          </p>
          <p className="text-zinc-500 text-xs mt-1">Đã đăng ký</p>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default DashBoard;