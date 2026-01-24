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
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-card group">
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* VIP Badge */}
      {isVip && (
        <div className="absolute top-4 right-4 badge-vip">
          <Crown className="w-3 h-3" />
          VIP
        </div>
      )}

      {/* Online indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <span className="badge-online" />
        <span className="text-xs text-foreground">Online agora</span>
      </div>

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="mb-4">
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            {name}, <span className="text-primary">{age}</span>
          </h2>
          
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>

          {/* Interests */}
          <div className="flex flex-wrap gap-2 mb-3">
            {interests.slice(0, 3).map((interest, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30"
              >
                {interest}
              </span>
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <Button
            onClick={onDislike}
            size="icon"
            variant="glass"
            className="w-14 h-14 rounded-full border-destructive/50 hover:border-destructive hover:bg-destructive/20"
          >
            <X className="w-6 h-6 text-destructive" />
          </Button>
          
          <Button
            onClick={onLike}
            size="icon"
            variant="hero"
            className="w-14 h-14 rounded-full"
          >
            <Heart className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
