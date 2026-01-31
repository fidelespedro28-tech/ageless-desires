import { Heart, X, MapPin, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  description: string;
  interests: string[];
  image: string;
  isVip?: boolean;
  onLike: () => void;
  onDislike: () => void;
}

const ProfileCard = ({
  name,
  age,
  location,
  description,
  interests,
  image,
  isVip = false,
  onLike,
  onDislike,
}: ProfileCardProps) => {
  return (
    <div className="profile-card relative aspect-[3/4] rounded-2xl overflow-hidden shadow-card group">
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* VIP Badge */}
      {isVip && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 badge-vip">
          <Crown className="w-3 h-3" />
          VIP
        </div>
      )}

      {/* Online indicator */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
        <span className="badge-online" />
        <span className="text-xs text-foreground">Online agora</span>
      </div>

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1">
            {name}, <span className="text-primary">{age}</span>
          </h2>
          
          <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{location}</span>
          </div>

          {/* Interests */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {interests.slice(0, 3).map((interest, index) => (
              <span 
                key={index}
                className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30"
              >
                {interest}
              </span>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        {/* Action Buttons - Thumb-friendly touch targets */}
        <div className="flex justify-center gap-5 sm:gap-6">
          <Button
            onClick={onDislike}
            size="icon"
            variant="glass"
            className="action-button w-14 h-14 sm:w-16 sm:h-16 rounded-full border-destructive/50 hover:border-destructive hover:bg-destructive/20 active:scale-90 transition-all duration-150"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 text-destructive" />
          </Button>
          
          <Button
            onClick={onLike}
            size="icon"
            variant="hero"
            className="action-button w-14 h-14 sm:w-16 sm:h-16 rounded-full active:scale-90 transition-all duration-150"
          >
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
