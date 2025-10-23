import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, ExternalLink, User } from "lucide-react";
import { useState } from "react";

interface HymnCardProps {
  id: number;
  title: string;
  artist: string;
  videoUrl: string;
  authorImage: string;
  votes: number;
  onVote: (id: number) => void;
  hasVoted: boolean;
}

const HymnCard = ({ id, title, artist, videoUrl, authorImage, votes, onVote, hasVoted }: HymnCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-2 border-border">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <Music className="w-16 h-16 text-primary-foreground opacity-50" />
        </div>
        {/* Removido o contador de votos da interface pública */}
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <p className="text-sm">{artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!imageError && authorImage ? (
            <img 
              src={authorImage} 
              alt={artist}
              className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-secondary">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{artist}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => window.open(videoUrl, '_blank')}
            variant="outline"
            className="flex-1 gap-2 border-2"
            disabled={!videoUrl}
          >
            <ExternalLink className="w-4 h-4" />
            Ver Vídeo
          </Button>
          
          <Button
            onClick={() => onVote(id)}
            disabled={hasVoted}
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold"
          >
            {hasVoted ? "Votado ✓" : "Votar"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HymnCard;