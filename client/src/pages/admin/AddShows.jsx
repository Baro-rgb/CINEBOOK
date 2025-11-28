import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { Star, Check, Trash2, Plus, Calendar, Clock, DollarSign, Film, Zap } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user, image_base_url } = useAppContext();
  
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]); // ⭐ Multiple selection
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle movie selection
  const toggleMovieSelection = (movieId) => {
    setSelectedMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  // Select all visible movies
  const selectAllMovies = () => {
    const visibleMovieIds = filteredMovies.map(m => m.id);
    setSelectedMovies(visibleMovieIds);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedMovies([]);
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) {
      return toast.error("Vui lòng chọn ngày và giờ");
    }
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) {
      return toast.error("Định dạng thời gian không hợp lệ");
    }

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
    setDateTimeInput(""); // Clear input after adding
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/now-playing", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error("error fetching movies:", error);
      toast.error("Không thể tải danh sách phim");
    }
  };

  const handleSubmit = async () => {
    try {
      setAddingShow(true);

      // Validation
      if (selectedMovies.length === 0) {
        toast.error("Vui lòng chọn ít nhất 1 phim");
        return;
      }
      if (Object.keys(dateTimeSelection).length === 0) {
        toast.error("Vui lòng chọn ít nhất 1 lịch chiếu");
        return;
      }
      if (!showPrice) {
        toast.error("Vui lòng nhập giá vé");
        return;
      }

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, time]) => ({ date, time })
      );

      // Add shows for all selected movies
      let successCount = 0;
      let errorCount = 0;

      for (const movieId of selectedMovies) {
        try {
          const payload = {
            movieId,
            showsInput,
            showPrice: Number(showPrice),
          };

          const { data } = await axios.post("/api/show/add", payload, {
            headers: { Authorization: `Bearer ${await getToken()}` },
          });

          if (data.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(`Error adding show for movie ${movieId}:`, error);
          errorCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Đã thêm thành công ${successCount} phim!`);
        // Reset form
        setSelectedMovies([]);
        setDateTimeSelection({});
        setShowPrice("");
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} phim thêm thất bại`);
      }

    } catch (error) {
      console.error("Submission error: ", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setAddingShow(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  // Filter movies by search
  const filteredMovies = nowPlayingMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return nowPlayingMovies.length > 0 ? (
    <div className="pb-20">
      <Title text1="Thêm" text2="Lịch Chiếu" />

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mt-8 mb-6">
        <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
          <span className="text-zinc-400 text-sm">Tổng phim: </span>
          <span className="text-white font-semibold">{nowPlayingMovies.length}</span>
        </div>
        <div className="px-4 py-2 bg-primary/10 rounded-lg border border-primary/30">
          <span className="text-zinc-400 text-sm">Đã chọn: </span>
          <span className="text-primary font-semibold">{selectedMovies.length}</span>
        </div>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-zinc-500"
        />
        <button
          onClick={selectAllMovies}
          disabled={filteredMovies.length === 0}
          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
        >
          <Check className="w-4 h-4" />
          Chọn tất cả
        </button>
        {selectedMovies.length > 0 && (
          <button
            onClick={clearSelection}
            className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-all flex items-center gap-2 justify-center border border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Bỏ chọn
          </button>
        )}
      </div>

      {/* Movie Grid */}
      <p className="text-lg font-medium mb-4 flex items-center gap-2">
        <Film className="w-5 h-5 text-primary" />
        Phim Đang Chiếu
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
        {filteredMovies.map((movie) => {
          const isSelected = selectedMovies.includes(movie.id);
          return (
            <div
              key={movie.id}
              onClick={() => toggleMovieSelection(movie.id)}
              className={`relative cursor-pointer group transition-all duration-300 ${
                isSelected 
                  ? "ring-2 ring-primary scale-105" 
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={image_base_url + movie.poster_path}
                  alt={movie.title}
                  className={`w-full aspect-[2/3] object-cover transition-all duration-300 ${
                    isSelected ? "brightness-100" : "brightness-75"
                  }`}
                />
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="text-zinc-400">
                      {kConverter(movie.vote_count)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="font-medium truncate mt-2 text-sm">{movie.title}</p>
              <p className="text-zinc-400 text-xs">{movie.release_date}</p>
            </div>
          );
        })}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          Không tìm thấy phim nào
        </div>
      )}

      {/* Configuration Section */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        
        {/* Show Price */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <label className="flex items-center gap-2 text-base font-semibold mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            Giá Vé
          </label>
          <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
            <span className="text-zinc-400 font-medium">{currency}</span>
            <input
              min={0}
              type="number"
              value={showPrice}
              onChange={(e) => setShowPrice(e.target.value)}
              placeholder="Nhập giá vé"
              className="flex-1 bg-transparent outline-none text-white"
            />
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <label className="flex items-center gap-2 text-base font-semibold mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            Lịch Chiếu
          </label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 text-white"
            />
            <button
              onClick={handleDateTimeAdd}
              className="px-4 py-2.5 bg-primary hover:bg-primary-dull rounded-lg transition-all flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm
            </button>
          </div>
        </div>
      </div>

      {/* Selected Times Display */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-8 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="flex items-center gap-2 text-base font-semibold mb-4">
            <Clock className="w-5 h-5 text-primary" />
            Lịch Chiếu Đã Chọn ({Object.keys(dateTimeSelection).length} ngày)
          </h3>
          <div className="space-y-4">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <div key={date} className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                <div className="font-medium mb-2 text-primary">
                  {new Date(date).toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-primary/50 rounded-lg text-sm"
                    >
                      <span>{time}</span>
                      <button
                        onClick={() => handleRemoveTime(date, time)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={addingShow || selectedMovies.length === 0}
          className="px-8 py-3 bg-primary hover:bg-primary-dull rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
        >
          {addingShow ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang thêm...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Thêm {selectedMovies.length} phim
            </>
          )}
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default AddShows;