import React, { useState, useEffect } from "react";
import { Film, Calendar, Users, DollarSign, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Số items mỗi trang

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

  // Pagination logic
  const totalPages = Math.ceil(shows.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShows = shows.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return !loading ? (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Title text1="Danh sách" text2="Phim" />
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl shadow-lg border border-primary/20 p-5 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Tổng phim</p>
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
                <p className="text-sm font-medium text-gray-400">Tổng đặt chỗ</p>
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
                <p className="text-sm font-medium text-gray-400">Tỷ lệ lấp đầy trung bình</p>
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
                <p className="text-sm font-medium text-gray-400">Tổng doanh thu</p>
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
          {/* Pagination Info */}
          <div className="px-6 py-3 bg-primary/10 border-b border-primary/20">
            <p className="text-sm text-gray-400">
              Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, shows.length)} của {shows.length} phim
            </p>
          </div>

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
                      Giờ chiếu
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Số chỗ
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Doanh thu
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {currentShows.map((show, index) => {
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
              <p className="text-gray-400">Không có chương trình nào</p>
            </div>
          )}

          {/* Pagination Controls */}
          {shows.length > 0 && (
            <div className="px-6 py-4 bg-primary/10 border-t border-primary/20">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === 1
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dull'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </button>

                <div className="flex items-center gap-2">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          currentPage === pageNum
                            ? 'bg-primary text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === totalPages
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dull'
                  }`}
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
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