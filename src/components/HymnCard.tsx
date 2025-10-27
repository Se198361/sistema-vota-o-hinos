import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface HymnCardProps {
  id: string;
  title: string;
  artist: string;
  videoUrl: string;
  authorImage: string;
  onVote: (id: string) => void;
  hasVoted: boolean;
}

const HymnCard = ({
  id,
  title,
  artist,
  videoUrl,
  authorImage,
  onVote,
  hasVoted,
}: HymnCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleVideoClick = () => {
    if (!videoUrl) {
      alert("Link do vídeo não disponível");
      return;
    }
    
    // Ensure the URL has a protocol
    let url = videoUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-card/80 border-2 border-border hover:border-primary group">
      {/* Author Image */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <img
          src={imageError ? "https://via.placeholder.com/400x300?text=Imagem+Indisponível" : authorImage}
          alt={artist}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm font-medium">{artist}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleVideoClick}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Play className="w-4 h-4" />
            Ver Vídeo
          </Button>
          
          <Button
            onClick={() => onVote(id)}
            disabled={hasVoted}
            className="flex-1"
            variant={hasVoted ? "secondary" : "default"}
          >
            {hasVoted ? "Votado" : "Votar"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HymnCard;
