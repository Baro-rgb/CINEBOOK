import React, { useEffect, useState } from "react";
import { User, Film, Calendar, Armchair, DollarSign, TrendingUp, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "../../components/Loading";
import { dateFormat } from "../../lib/dateFormat";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../context/AppContext";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setBookings(data.bookings);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  const handleDelete = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      console.log("Deleting booking:", bookingId);
      const response = await axios.delete(`/api/admin/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      console.log("Delete response:", response);
      
      // Update state to remove deleted booking
      setBookings(bookings.filter(b => b._id !== bookingId));
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to delete booking: ${error.response?.data?.message || error.message}`);
    }
  };

  // Pagination
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const totalSeats = bookings.reduce((sum, booking) => sum + Object.keys(booking.bookedSeats).length, 0);
  const avgBookingValue = totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return !isLoading ? (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Title text1="List" text2="Bookings" />
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white mt-1">{totalBookings}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <Film className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Seats</p>
                <p className="text-2xl font-bold text-white mt-1">{totalSeats}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <Armchair className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg. Booking</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(avgBookingValue)}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/20 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      Movie Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Show Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Armchair className="w-4 h-4" />
                      Seats
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {currentBookings.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-primary/5 even:bg-primary/10 hover:bg-primary/15 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{item.user.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{item.show.movie.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">{dateFormat(item.show.showDateTime)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        {Object.keys(item.bookedSeats)
                          .map((seat) => item.bookedSeats[seat])
                          .join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">
                        {currency}{formatCurrency(item.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No bookings available</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-zinc-900 rounded-xl shadow-lg border border-primary/20 px-6 py-4">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, bookings.length)} of {bookings.length} bookings
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-primary/20 text-white hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-primary text-white'
                        : 'bg-primary/20 text-gray-300 hover:bg-primary/30'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-primary/20 text-white hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ListBookings;