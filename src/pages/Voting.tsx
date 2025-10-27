import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HymnCard from "@/components/HymnCard";
import Logo from "@/components/Logo";

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
  const [searchParams] = useSearchParams();
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Congresso de Homens 2025");
  const [pageSubtitle, setPageSubtitle] = useState("Escolha o Hino que Mais Tocou Seu Coração!");
  const [pageDescription, setPageDescription] = useState("Vote no seu hino favorito e ajude-nos a celebrar a fé e a música.");
  const [votingEnabled, setVotingEnabled] = useState(true);
  const [currentCampaignId, setCurrentCampaignId] = useState<string>("");
  const [campaignSupported, setCampaignSupported] = useState<boolean>(true);

  useEffect(() => {
    // Get campaign ID from URL parameters
    const campaignId = searchParams.get('campaign') || 'default';
    setCurrentCampaignId(campaignId);
    
    loadData();
    checkIfVoted(campaignId);
  }, [searchParams]);

  // Obtém o IP público do usuário
  const getPublicIP = async (): Promise<string | null> => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data?.ip || null;
    } catch (e) {
      console.error('Erro ao obter IP público:', e);
      return null;
    }
  };

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

  // Verifica no banco se o IP já votou nesta campanha
  const checkIfVoted = async (campaignId: string) => {
    try {
      const ip = await getPublicIP();
      if (!ip) {
        const voted = localStorage.getItem(`hasVoted_${campaignId}`);
        setHasVoted(voted === "true");
        return;
      }

      if (!campaignSupported) {
        const { count: legacyCount, error: legacyError } = await supabase
          .from("votes")
          .select("id", { count: "exact" })
          .eq("voter_ip", ip)
          .limit(1);
        if (legacyError) throw legacyError;
        const voted = (legacyCount || 0) > 0;
        setHasVoted(voted);
        if (voted) localStorage.setItem(`hasVoted_${campaignId}`, "true");
        return;
      }

      const { count, error } = await supabase
        .from("votes")
        .select("id", { count: "exact" })
        .eq("voter_ip", ip)
        .eq("campaign_id", campaignId)
        .limit(1);

      if (error) {
        const code = (error as any)?.code;
        const message = (error as any)?.message || "";
        if (code === '42703' || message.includes('column') && message.includes('campaign_id')) {
          setCampaignSupported(false);
          const { count: legacyCount, error: legacyError } = await supabase
            .from("votes")
            .select("id", { count: "exact" })
            .eq("voter_ip", ip)
            .limit(1);
          if (legacyError) throw legacyError;
          const voted = (legacyCount || 0) > 0;
          setHasVoted(voted);
          if (voted) localStorage.setItem(`hasVoted_${campaignId}`, "true");
          return;
        }
        // Other errors: fallback to localStorage
        throw error;
      }

      const voted = (count || 0) > 0;
      setHasVoted(voted);
      if (voted) localStorage.setItem(`hasVoted_${campaignId}`, "true");
    } catch (error) {
      console.error("Error checking vote by IP for campaign:", error);
      const voted = localStorage.getItem(`hasVoted_${campaignId}`);
      setHasVoted(voted === "true");
    }
  };

  const handleVote = async (hymnId: string) => {
    if (hasVoted) {
      toast({
        title: "Você já votou!",
        description: "Cada pessoa pode votar apenas uma vez nesta campanha.",
        variant: "destructive",
      });
      return;
    }

    if (!votingEnabled) {
      toast({
        title: "Votação encerrada",
        description: "A votação foi encerrada pelo administrador.",
        variant: "destructive",
      });
      return;
    }

    try {
      const ip = await getPublicIP();
      const voterIp = ip || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Verificar novamente se já votou nesta campanha (double-check)
      if (!campaignSupported) {
        const { count: ipOnlyCount, error: ipOnlyError } = await supabase
          .from("votes")
          .select("id", { count: "exact" })
          .eq("voter_ip", voterIp)
          .limit(1);
        if (ipOnlyError) throw ipOnlyError;
        if ((ipOnlyCount || 0) > 0) {
          setHasVoted(true);
          localStorage.setItem(`hasVoted_${currentCampaignId}`, "true");
          toast({
            title: "Você já votou!",
            description: "Cada pessoa pode votar apenas uma vez nesta campanha.",
            variant: "destructive",
          });
          return;
        }
      } else {
        const { count: existingVotes, error: checkError } = await supabase
          .from("votes")
          .select("id", { count: "exact" })
          .eq("voter_ip", voterIp)
          .eq("campaign_id", currentCampaignId)
          .limit(1);
        if (checkError) {
          const code = (checkError as any)?.code;
          const message = (checkError as any)?.message || "";
          if (code === '42703' || message.includes('column') && message.includes('campaign_id')) {
            setCampaignSupported(false);
            const { count: ipOnlyCount, error: ipOnlyError } = await supabase
              .from("votes")
              .select("id", { count: "exact" })
              .eq("voter_ip", voterIp)
              .limit(1);
            if (ipOnlyError) throw ipOnlyError;
            if ((ipOnlyCount || 0) > 0) {
              setHasVoted(true);
              localStorage.setItem(`hasVoted_${currentCampaignId}`, "true");
              toast({
                title: "Você já votou!",
                description: "Cada pessoa pode votar apenas uma vez nesta campanha.",
                variant: "destructive",
              });
              return;
            }
          } else {
            throw checkError;
          }
        } else if ((existingVotes || 0) > 0) {
          setHasVoted(true);
          localStorage.setItem(`hasVoted_${currentCampaignId}`, "true");
          toast({
            title: "Você já votou!",
            description: "Cada pessoa pode votar apenas uma vez nesta campanha.",
            variant: "destructive",
          });
          return;
        }
      }

      // Inserção
      if (!campaignSupported) {
        const { error: legacyInsertError } = await supabase.from("votes").insert({
          hymn_id: hymnId,
          voter_ip: voterIp,
        });
        if (legacyInsertError) throw legacyInsertError;
      } else {
        const { error: insertError } = await supabase.from("votes").insert({
          hymn_id: hymnId,
          voter_ip: voterIp,
          campaign_id: currentCampaignId,
        });
        if (insertError) {
          const code = (insertError as any)?.code;
          const message = (insertError as any)?.message || "";
          if (code === '42703' || message.includes('column') && message.includes('campaign_id')) {
            setCampaignSupported(false);
            const { error: legacyInsertError } = await supabase.from("votes").insert({
              hymn_id: hymnId,
              voter_ip: voterIp,
            });
            if (legacyInsertError) throw legacyInsertError;
          } else {
            throw insertError;
          }
        }
      }

      setHasVoted(true);
      localStorage.setItem(`hasVoted_${currentCampaignId}`, "true");

      toast({
        title: "Voto registrado!",
        description: "Obrigado por participar da votação!",
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Erro ao votar",
        description: "Não foi possível registrar seu voto. Tente novamente.",
        variant: "destructive",
      });
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
            <Logo width={80} height={80} />
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
      <main className="container mx-auto px-4 py-8">
        {!votingEnabled && (
          <Card className="p-6 mb-8 bg-destructive/10 border-destructive">
            <h2 className="text-xl font-bold text-destructive mb-2">Votação Encerrada</h2>
            <p className="text-destructive/80">
              A votação foi encerrada pelo administrador. Obrigado por participar!
            </p>
          </Card>
        )}

        {currentCampaignId !== 'default' && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Campanha:</span> {currentCampaignId}
            </p>
          </Card>
        )}

        {hasVoted && (
          <Card className="p-6 mb-8 bg-green-50 border-green-200">
            <h2 className="text-xl font-bold text-green-800 mb-2">✅ Voto Registrado!</h2>
            <p className="text-green-700">
              Obrigado por participar! Seu voto foi registrado com sucesso nesta campanha.
            </p>
          </Card>
        )}

        {hymns.length === 0 ? (
          <Card className="p-8 text-center">
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