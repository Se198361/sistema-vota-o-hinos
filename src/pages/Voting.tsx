import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HymnCard from "@/components/HymnCard";
import { Music, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Hymn {
  id: string;
  title: string;
  artist: string;
  video_url: string;
  author_image: string | null;
}

const Voting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Congresso de Homens 2025");
  const [pageSubtitle, setPageSubtitle] = useState("Escolha o Hino que Mais Tocou Seu Coração!");
  const [pageDescription, setPageDescription] = useState("Vote no seu hino favorito e ajude-nos a celebrar a fé e a música.");
  const [votingEnabled, setVotingEnabled] = useState(true);

  useEffect(() => {
    loadData();
    checkIfVoted();
  }, []);

  const loadData = async () => {
    try {
      // Load hymns
      const { data: hymnsData, error: hymnsError } = await supabase
        .from("hymns")
        .select("*")
        .order("created_at", { ascending: true });

      if (hymnsError) throw hymnsError;
      setHymns(hymnsData || []);

      // Load all settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("settings")
        .select("key, value");

      if (settingsError) throw settingsError;
      
      if (settingsData) {
        settingsData.forEach((setting) => {
          if (setting.key === "banner_url") setBannerUrl(setting.value);
          if (setting.key === "page_title") setPageTitle(setting.value);
          if (setting.key === "page_subtitle") setPageSubtitle(setting.value);
          if (setting.key === "page_description") setPageDescription(setting.value);
          if (setting.key === "voting_enabled") setVotingEnabled(setting.value === "true");
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfVoted = () => {
    const voted = localStorage.getItem("hasVoted");
    setHasVoted(voted === "true");
  };

  const handleVote = async (id: string) => {
    if (!votingEnabled) {
      toast({
        title: "Votação Encerrada",
        description: "A votação foi encerrada.",
        variant: "destructive",
      });
      return;
    }

    if (hasVoted) {
      toast({
        title: "Aviso",
        description: "Você já votou!",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get or create a unique voter identifier
      let voterId = localStorage.getItem("voterId");
      if (!voterId) {
        voterId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("voterId", voterId);
      }

      const { error } = await supabase
        .from("votes")
        .insert({
          hymn_id: id,
          voter_ip: voterId,
        });

      if (error) throw error;

      setHasVoted(true);
      localStorage.setItem("hasVoted", "true");

      toast({
        title: "Voto registrado!",
        description: "Obrigado por participar da nossa enquete.",
      });
    } catch (error: any) {
      console.error("Error voting:", error);
      
      if (error?.message?.includes("duplicate")) {
        toast({
          title: "Aviso",
          description: "Você já votou neste hino!",
          variant: "destructive",
        });
        setHasVoted(true);
        localStorage.setItem("hasVoted", "true");
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível registrar seu voto",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground py-12 px-4 shadow-xl">
        <div className="container mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {pageTitle}
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-medium">
            {pageSubtitle}
          </p>
          <p className="text-sm md:text-base text-primary-foreground/90">
            {pageDescription}
          </p>
          
          {!votingEnabled && (
            <div className="bg-destructive/20 border-2 border-destructive rounded-lg p-4 mt-4">
              <p className="text-lg font-bold text-destructive-foreground">
                🔒 Votação Encerrada
              </p>
            </div>
          )}
          
          <Button
            onClick={() => navigate("/auth")}
            variant="secondary"
            size="sm"
            className="gap-2 mt-4"
          >
            <Lock className="w-4 h-4" />
            Admin
          </Button>
        </div>
      </header>

      {/* Voting Cards */}
      <main className="container mx-auto px-4 py-12">
        {hasVoted && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-secondary/20 to-accent/20 border-2 border-secondary">
            <p className="text-center text-lg font-semibold text-foreground">
              ✅ Obrigado por votar! Seu voto foi registrado com sucesso.
            </p>
          </Card>
        )}

        {hymns.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              Nenhum hino disponível para votação no momento.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hymns.map((hymn) => (
              <HymnCard
                key={hymn.id}
                id={hymn.id}
                title={hymn.title}
                artist={hymn.artist}
                videoUrl={hymn.video_url}
                authorImage={hymn.author_image || "https://via.placeholder.com/150"}
                onVote={handleVote}
                hasVoted={hasVoted}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer Banner */}
      {bannerUrl && (
        <footer className="bg-muted py-8 px-0 mt-12 w-full">
          <div className="container mx-auto text-center space-y-4 px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {pageTitle}
            </h2>
            <img
              src={bannerUrl}
              alt="Banner do Congresso"
              className="w-full max-w-full mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </footer>
      )}
    </div>
  );
};

export default Voting;
