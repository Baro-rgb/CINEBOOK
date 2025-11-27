import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Heart, X, Bell, RefreshCcw, Calendar, Film, Star } from "lucide-react";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";

// --- DỮ LIỆU GIẢ LẬP ---
const db = [
  {
    id: 1,
    name: 'Dune: Part Two',
    genre: 'Sci-fi / Adventure',
    date: 'Tháng 12/2025',
    rating: 8.5,
    url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Kung Fu Panda 4',
    genre: 'Animation / Comedy',
    date: 'Tết Nguyên Đán',
    rating: 7.8,
    url: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Godzilla x Kong',
    genre: 'Action / Monster',
    date: 'Sắp công bố',
    rating: 8.2,
    url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Deadpool 3',
    genre: 'Action / Marvel',
    date: 'Mùa hè 2026',
    rating: 9.0,
    url: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop'
  },
];

// --- COMPONENT THẺ BÀI ---
const Card = ({ data, onSwipe, isTop }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Always call hooks - fix for conditional hooks error
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (!isTop) return; // Prevent drag on non-top cards
    
    const SWIPE_THRESHOLD = 80;
    const VELOCITY_THRESHOLD = 300;

    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0, 
        opacity: isTop ? 1 : 0.5,
        scale: isTop ? 1 : 0.95,
        zIndex: isTop ? 10 : 1
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ 
        scale: isTop ? 1 : 0.95, 
        opacity: isTop ? 1 : 0.5, 
        y: isTop ? 0 : 20 
      }}
      exit={{ 
        x: x.get() < 0 ? -400 : 400, 
        opacity: 0,
        rotate: x.get() < 0 ? -45 : 45,
        transition: { duration: 0.3 } 
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={`absolute top-0 left-0 w-full h-full ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl bg-zinc-900">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"></div>
        </div>

        {/* Like/Dislike Overlay Indicators */}
        <motion.div 
          style={{ opacity: isTop ? likeOpacity : 0 }}
          className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg rotate-12 border-4 border-white pointer-events-none"
        >
          THÍCH
        </motion.div>
        <motion.div 
          style={{ opacity: isTop ? dislikeOpacity : 0 }}
          className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg -rotate-12 border-4 border-white pointer-events-none"
        >
          BỎ QUA
        </motion.div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary px-4 py-1.5 rounded-full text-sm font-bold">
              Sắp chiếu
            </span>
            {data.rating && (
              <div className="flex items-center gap-1 bg-amber-500/90 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-white text-white" />
                <span className="text-sm font-bold">{data.rating}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-4xl font-bold mb-3 drop-shadow-2xl leading-tight">
            {data.name}
          </h3>
          
          {/* Genre */}
          <div className="flex items-center gap-2 mb-3 text-zinc-300">
            <Film className="w-4 h-4 text-primary" />
            <p className="text-lg">{data.genre}</p>
          </div>

          {/* Release Date */}
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Calendar className="w-5 h-5" />
            <span className="text-base">Dự kiến: {data.date}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENT CHÍNH ---
const Releases = () => {
  const [cards, setCards] = useState(db);
  const [direction, setDirection] = useState(null);

  const handleSwipe = (dir, id, name) => {
    setDirection(dir);
    setCards((prev) => prev.filter((card) => card.id !== id));

    if (dir === "right") {
      toast.success(`Đã thêm "${name}" vào danh sách yêu thích!`, {
        icon: "❤️",
        duration: 2000,
      });
    } else {
      toast("Đã bỏ qua phim này", { 
        icon: "👋",
        duration: 2000,
      });
    }
  };

  const manualSwipe = (dir) => {
    if (cards.length === 0) return;
    const topCard = cards[cards.length - 1];
    handleSwipe(dir, topCard.id, topCard.name);
  };

  const resetCards = () => {
    setCards(db);
    setDirection(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Effects */}
      <BlurCircle top="10%" left="5%" color="rgba(248, 69, 101, 0.15)" />
      <BlurCircle bottom="10%" right="5%" color="rgba(248, 69, 101, 0.1)" />

      {/* Header */}
      <div className="text-center mb-12 relative z-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Phim Sắp Chiếu
          </h1>
          <p className="text-zinc-400 text-lg mb-6">
            Khám phá những bộ phim hot sắp ra mắt
          </p>
          
          {/* Instruction */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-zinc-300">
                Vuốt <span className="text-red-500 font-bold">trái</span> để bỏ qua
              </span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-zinc-300">
                Vuốt <span className="text-green-500 font-bold">phải</span> để thích
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-md h-[600px] mb-12 z-10">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <Card 
              key={card.id} 
              data={card}
              isTop={index === cards.length - 1}
              onSwipe={(dir) => handleSwipe(dir, card.id, card.name)} 
            />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {cards.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl border-2 border-zinc-800 shadow-2xl p-8"
          >
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <Bell className="w-12 h-12 text-primary animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold mb-3">Hết phim rồi! 🎬</h3>
            <p className="text-zinc-400 text-center mb-8 max-w-sm">
              Bạn đã xem hết tất cả phim sắp chiếu. Hãy quay lại sau để khám phá thêm!
            </p>
            <button
              onClick={resetCards}
              className="px-8 py-4 bg-primary text-white rounded-full hover:bg-primary-dull transition-all flex items-center gap-3 font-semibold shadow-lg hover:shadow-primary/50 hover:scale-105"
            >
              <RefreshCcw size={20}/> 
              Xem lại từ đầu
            </button>
          </motion.div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-8 relative z-20">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => manualSwipe('left')}
          disabled={cards.length === 0}
          className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full text-red-500 hover:from-red-500/20 hover:to-red-600/20 transition-all shadow-xl border-2 border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <X size={32} strokeWidth={2.5} />
        </motion.button>

        <div className="text-center px-6">
          <div className="text-4xl font-bold text-white mb-1">
            {cards.length}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">
            Còn lại
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => manualSwipe('right')}
          disabled={cards.length === 0}
          className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full text-green-500 hover:from-green-500/20 hover:to-green-600/20 transition-all shadow-xl border-2 border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Heart size={32} strokeWidth={2.5} fill="currentColor" />
        </motion.button>
      </div>

      {/* Fun Tip */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-zinc-600 text-sm mt-12 text-center max-w-md relative z-20"
      >
        💡 Mẹo: Bạn có thể vuốt nhanh hoặc kéo nhẹ để chọn phim yêu thích
      </motion.p>
    </div>
  );
};

export default Releases;