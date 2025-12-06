import React, { useState, useEffect } from "react";
import { Film, Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setShows(data.shows);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  // Calculate statistics
  const totalBookings = shows.reduce((sum, show) => sum + Object.keys(show.occupiedSeats).length, 0);
  const totalEarnings = shows.reduce((sum, show) => sum + (Object.keys(show.occupiedSeats).length * show.showPrice), 0);
  const averageOccupancy = shows.length > 0 ? (totalBookings / shows.length).toFixed(1) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return !loading ? (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Title text1="List" text2="Shows" />
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Tổng số phim</p>
                <p className="text-2xl font-bold text-white mt-1">{shows.length}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <Film className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Tổng số vé</p>
                <p className="text-2xl font-bold text-white mt-1">{totalBookings}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Công suất sử dụng trung bình</p>
                <p className="text-2xl font-bold text-white mt-1">{averageOccupancy}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Tổng thu nhập</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalEarnings)}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Shows Table */}
        <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/20 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      Tên phim
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Thời gian chiếu
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Chỗ
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Thu nhập
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {shows.map((show, index) => {
                  const bookings = Object.keys(show.occupiedSeats).length;
                  const earnings = bookings * show.showPrice;
                  
                  return (
                    <tr
                      key={index}
                      className="bg-primary/5 even:bg-primary/10 hover:bg-primary/15 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{show.movie.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400">{dateFormat(show.showDateTime)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                          {bookings} chỗ
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">
                          {currency} {formatCurrency(earnings)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {shows.length === 0 && (
            <div className="text-center py-12">
              <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No shows available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ListShows;