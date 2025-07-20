import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '../store/appStore';

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right', user: User) => void;
  isTop?: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onSwipe, isTop = false }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const zodiacEmojis = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  };

  const handlePhotoTap = (side: 'left' | 'right') => {
    if (side === 'right' && currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    } else if (side === 'left' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  return (
    <motion.div
      className={`absolute w-80 h-[500px] bg-card-gradient rounded-2xl overflow-hidden shadow-2xl border border-galactic-purple/30 ${
        isTop ? 'z-20' : 'z-10'
      }`}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        if (!isTop) return;
        
        const threshold = 150;
        if (info.offset.x > threshold) {
          onSwipe('right', user);
        } else if (info.offset.x < -threshold) {
          onSwipe('left', user);
        }
      }}
      whileDrag={{ rotate: isTop ? 5 : 0 }}
    >
      {/* Photo Section */}
      <div className="relative h-80">
        <img
          src={user.photos[currentPhotoIndex] || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'}
          alt={user.name}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        
        {/* Photo Navigation */}
        <div className="absolute inset-0 flex">
          <button 
            className="flex-1 bg-transparent"
            onClick={() => handlePhotoTap('left')}
          />
          <button 
            className="flex-1 bg-transparent"
            onClick={() => handlePhotoTap('right')}
          />
        </div>

        {/* Photo Indicators */}
        {user.photos.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex space-x-1">
            {user.photos.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Zodiac Badge */}
        <div className="absolute top-4 right-4 bg-galactic-purple/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
          <span className="text-lg">{zodiacEmojis[user.sunSign as keyof typeof zodiacEmojis]}</span>
          <span className="text-sm font-medium text-white">{user.sunSign}</span>
        </div>

        {/* Distance */}
        {user.distance && (
          <div className="absolute bottom-4 left-4 bg-cosmic-card/80 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs text-white">{user.distance} km away</span>
          </div>
        )}

        {/* Online Status */}
        {user.isOnline && (
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-galactic-teal rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-5 flex-1">
        <div className="mb-2">
          <h3 className="text-xl font-heading text-galactic-white font-bold">
            {user.name}, {user.age}
          </h3>
        </div>
        
        <p className="text-sm text-galactic-white/80 font-body mb-4 line-clamp-3">
          {user.bio}
        </p>

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {user.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="bg-galactic-purple/30 text-galactic-white px-2 py-1 rounded-full text-xs font-body"
              >
                {interest}
              </span>
            ))}
            {user.interests.length > 3 && (
              <span className="text-galactic-white/60 text-xs font-body">
                +{user.interests.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCard;
