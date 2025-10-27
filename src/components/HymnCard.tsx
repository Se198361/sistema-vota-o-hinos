<<<<<<< HEAD
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface HymnCardProps {
  id: string;
=======
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, ExternalLink, User } from "lucide-react";
import { useState } from "react";

interface HymnCardProps {
  id: number;
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
  title: string;
  artist: string;
  videoUrl: string;
  authorImage: string;
<<<<<<< HEAD
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
=======
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
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
            Ver Vídeo
          </Button>
          
          <Button
            onClick={() => onVote(id)}
            disabled={hasVoted}
<<<<<<< HEAD
            className="flex-1"
            variant={hasVoted ? "secondary" : "default"}
          >
            {hasVoted ? "Votado" : "Votar"}
=======
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold"
          >
            {hasVoted ? "Votado ✓" : "Votar"}
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
          </Button>
        </div>
      </div>
    </Card>
  );
};

<<<<<<< HEAD
export default HymnCard;
=======
export default HymnCard;
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
