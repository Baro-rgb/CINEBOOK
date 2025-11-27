import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { ArrowRight, Clock, MapPin, Star, Film, CheckCircle2 } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const navigate = useNavigate();

  const { axios, getToken, user, theaters } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first");
    }
    if (!selectedTheater) {
      return toast("Please select theater first");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 seats");
    }
    if (occupiedSeats.includes(seatId)) {
      return toast("This seat is already booked");
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime.showId}`
      );
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);
          const isDisabled = !selectedTime || !selectedTheater;
          
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isDisabled}
              className={`h-8 w-8 rounded text-xs font-medium transition-all duration-200
                ${isDisabled ? "border border-zinc-700 text-zinc-600 cursor-not-allowed opacity-40" : ""}
                ${!isDisabled && !isSelected && !isOccupied ? "border border-primary/60 text-zinc-300 hover:bg-primary/20 cursor-pointer" : ""}
                ${isSelected ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-110" : ""}
                ${isOccupied && !isDisabled ? "bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed" : ""}
              `}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const bookTickets = async () => {
    try {
      if (!user) {
        return toast.error("Please login to proceed");
      }
      if (!selectedTime || !selectedSeats.length || !selectedTheater) {
        return toast.error("Please select time, theater and seats");
      }
      const { data } = await axios.post(
        "/api/booking/create",
        {
          showId: selectedTime.showId,
          selectedSeats,
          theaterId: selectedTheater._id
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getShow();
  }, []);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
      setSelectedSeats([]);
    }
  }, [selectedTime]);

  useEffect(() => {
    if (selectedTheater) {
      setSelectedSeats([]);
    }
  }, [selectedTheater]);

  return show ? (
    <div className="flex flex-col lg:flex-row px-6 md:px-16 lg:px-40 py-20 md:pt-40 gap-8">
      
      {/* Left Sidebar - Step Selection */}
      <div className="lg:w-80 space-y-6">
        
        {/* Step 1: Available Timings */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedTime ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              1
            </div>
            <p className="text-lg font-semibold">Chọn thời gian</p>
          </div>
          
          <div className="space-y-2">
            {show.dateTime[date].map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center justify-between gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTime?.time === item.time
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm font-medium">{isoTimeFormat(item.time)}</p>
                </div>
                {selectedTime?.time === item.time && (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Select Theater */}
        {selectedTime && (
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedTheater ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                2
              </div>
              <p className="text-lg font-semibold">Chọn Rạp chiếu</p>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {theaters?.slice(0, 4).map((theater) => (
                <div
                  key={theater._id}
                  onClick={() => setSelectedTheater(theater)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTheater?._id === theater._id
                      ? "bg-primary/20 border-2 border-primary shadow-lg shadow-primary/20"
                      : "bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-1">{theater.name}</h3>
                    {theater.rating && (
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-500">{theater.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400 line-clamp-2">{theater.location}</p>
                  </div>

                  {theater.facilities && (
                    <div className="flex items-center gap-1 flex-wrap mt-2">
                      {theater.facilities.slice(0, 2).map((facility, idx) => (
                        <span key={idx} className="text-xs bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded">
                          {facility}
                        </span>
                      ))}
                      {theater.facilities.length > 2 && (
                        <span className="text-xs text-zinc-500">+{theater.facilities.length - 2}</span>
                      )}
                    </div>
                  )}
                  
                  {selectedTheater?._id === theater._id && (
                    <div className="mt-3 flex items-center gap-2 text-primary text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã chọn</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {selectedSeats.length > 0 && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" />
              Vé của bạn
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Số lượng vé:</span>
                <span className="font-semibold">{selectedSeats.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Số ghế:</span>
                <span className="font-medium text-primary">{selectedSeats.join(", ")}</span>
              </div>
              {selectedTheater && (
                <div className="pt-2 border-t border-zinc-700">
                  <p className="text-zinc-400 text-xs mb-1">Rạp chiếu:</p>
                  <p className="font-medium text-sm">{selectedTheater.name}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Main Content - Seats Layout */}
      <div className="relative flex-1 flex flex-col items-center">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Chọn chỗ ngồi cho bạn
          </h1>
          <p className="text-zinc-400 text-sm">
            {!selectedTime && "👈 Bắt đầu bằng cách chọn thời gian chiếu"}
            {selectedTime && !selectedTheater && "👈 Bây giờ hãy chọn rạp chiếu phim bạn thích"}
            {selectedTime && selectedTheater && "Chọn tối đa 5 chỗ ngồi"}
          </p>
        </div>

        {/* Screen */}
        <div className="mb-8">
          <img src={assets.screenImage} alt="screen" className="w-full max-w-2xl" />
          <p className="text-zinc-500 text-sm text-center mt-2 tracking-widest">Màn hình</p>
        </div>

        {/* Seat Legend */}
        <div className="flex items-center gap-6 mb-8 text-sm flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-primary/60 rounded"></div>
            <span className="text-zinc-400">Chỗ trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded"></div>
            <span className="text-zinc-400">Đã chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rounded"></div>
            <span className="text-zinc-400">Đã đặt trước</span>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="flex flex-col items-center text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={bookTickets}
          disabled={!selectedTime || !selectedTheater || selectedSeats.length === 0}
          className="flex items-center gap-2 mt-16 px-10 py-4 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-semibold cursor-pointer active:scale-95 shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          Tiến hành thanh toán
          <ArrowRight strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;