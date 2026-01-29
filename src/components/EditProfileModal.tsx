import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Camera, 
  User, 
  Heart, 
  X, 
  Check,
  Plane, 
  Utensils,
  Music,
  Dumbbell,
  Wine,
  Book,
  Film
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Interesses disponíveis
const INTERESTS = [
  { id: "viagens", label: "Viagens", icon: Plane },
  { id: "gastronomia", label: "Gastronomia", icon: Utensils },
  { id: "musica", label: "Música", icon: Music },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "vinhos", label: "Vinhos", icon: Wine },
  { id: "leitura", label: "Leitura", icon: Book },
  { id: "cinema", label: "Cinema", icon: Film },
  { id: "romantico", label: "Romântico", icon: Heart },
];

interface ProfileData {
  photo: string | null;
  bio: string;
  interests: string[];
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: ProfileData) => void;
}

const EditProfileModal = ({ isOpen, onClose, onSave }: EditProfileModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userName = localStorage.getItem("userName") || "Usuário";
  
  // Load existing profile data
  const [photo, setPhoto] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load profile from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem("userProfile");
        if (stored) {
          const profile = JSON.parse(stored);
          setPhoto(profile.photo || null);
          setBio(profile.bio || "");
          setSelectedInterests(profile.interests || []);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }
  }, [isOpen]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const profileData: ProfileData = {
      photo,
      bio,
      interests: selectedInterests,
    };

    // Save to localStorage
    const existingProfile = localStorage.getItem("userProfile");
    const existing = existingProfile ? JSON.parse(existingProfile) : {};
    localStorage.setItem("userProfile", JSON.stringify({
      ...existing,
      ...profileData,
      updatedAt: new Date().toISOString(),
    }));

    setIsLoading(false);
    onSave?.(profileData);
    
    toast.success("✅ Perfil atualizado!", {
      description: "Suas alterações foram salvas com sucesso."
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="font-display text-xl sm:text-2xl text-center flex items-center justify-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Editar Perfil
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Atualize suas informações para atrair mais coroas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-3">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-primary/50 hover:border-primary cursor-pointer transition-colors flex items-center justify-center overflow-hidden bg-card/50"
            >
              {photo ? (
                <img 
                  src={photo} 
                  alt="Foto do perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            {photo && (
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Remover foto
              </button>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Sobre você
            </label>
            <Textarea
              placeholder="Conte um pouco sobre você..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[80px] resize-none text-base"
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/300
            </p>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Seus interesses
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map((interest) => {
                const Icon = interest.icon;
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`
                      p-2.5 rounded-lg border transition-all duration-200 flex items-center gap-2
                      ${isSelected 
                        ? "bg-primary/20 border-primary text-primary" 
                        : "bg-card/50 border-border hover:border-primary/50 text-muted-foreground"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate">{interest.label}</span>
                    {isSelected && <Check className="w-3 h-3 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="seductive"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Salvando...
              </div>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
