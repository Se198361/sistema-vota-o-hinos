import { useState, useEffect } from "react";
import HymnCard from "@/components/HymnCard";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bannerImage from "@/assets/banner-congresso.jpg";

interface Hymn {
  id: number;
  title: string;
  artist: string;
  videoUrl: string;
  authorImage: string;
  votes: number;
}

const Voting = () => {
  const navigate = useNavigate();
  const [hymns, setHymns] = useState<Hymn[]>([
    {
      id: 1,
      title: "Ele chegou",
      artist: "Anderson Freire",
      videoUrl: "https://www.youtube.com/watch?v=exemplo1",
      authorImage: "",
      votes: 0,
    },
    {
      id: 2,
      title: "Confiança Inabalável",
      artist: "Autor Desconhecido",
      videoUrl: "https://www.youtube.com/watch?v=exemplo2",
      authorImage: "",
      votes: 0,
    },
    {
      id: 3,
      title: "O HOMEM E A TEMPESTADE",
      artist: "Chagas Sobrinho",
      videoUrl: "https://www.youtube.com/watch?v=exemplo3",
      authorImage: "",
      votes: 0,
    },
    {
      id: 4,
      title: "Fé Inabalável",
      artist: "Israel Salazar",
      videoUrl: "https://www.youtube.com/watch?v=exemplo4",
      authorImage: "",
      votes: 0,
    },
  ]);

  const [hasVoted, setHasVoted] = useState(false);
  const [congressBanner, setCongressBanner] = useState<string | null>(null);
  const [congressTitle, setCongressTitle] = useState("ESCOLHA DE HINOS PARA O 4º CONGRESSO DE HOMENS");
  const [congressTheme, setCongressTheme] = useState("HOMENS INABALÁVEIS, FIRMES EM CRISTO EM UM MUNDO CAÍDO");
  const [congressVerse, setCongressVerse] = useState("1º CORÍNTIOS 15:58");

  useEffect(() => {
    // Carregar votos do localStorage
    const savedVotes = localStorage.getItem("hymnVotes");
    const userVoted = localStorage.getItem("hasVoted");
    const savedBanner = localStorage.getItem("congressBanner");
    const savedTitle = localStorage.getItem("congressTitle");
    const savedTheme = localStorage.getItem("congressTheme");
    const savedVerse = localStorage.getItem("congressVerse");
    
    if (savedVotes) {
      setHymns(JSON.parse(savedVotes));
    }
    
    if (userVoted === "true") {
      setHasVoted(true);
    }
    
    if (savedBanner) {
      setCongressBanner(savedBanner);
    }
    
    if (savedTitle) {
      setCongressTitle(savedTitle);
    }
    
    if (savedTheme) {
      setCongressTheme(savedTheme);
    }
    
    if (savedVerse) {
      setCongressVerse(savedVerse);
    }
  }, []);

  const handleVote = (id: number) => {
    if (hasVoted) return;

    const updatedHymns = hymns.map(hymn =>
      hymn.id === id ? { ...hymn, votes: hymn.votes + 1 } : hymn
    );

    setHymns(updatedHymns);
    setHasVoted(true);
    
    // Salvar no localStorage
    localStorage.setItem("hymnVotes", JSON.stringify(updatedHymns));
    localStorage.setItem("hasVoted", "true");
  };

  // Função para sair do painel administrativo
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    // Não é necessário redirecionar, apenas atualizar o estado
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground py-12 px-4 shadow-xl">
        <div className="container mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-in fade-in slide-in-from-top duration-700">
            {congressTitle}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary animate-in fade-in slide-in-from-top duration-700 delay-100">
            TEMA: {congressTheme}
          </h2>
          <p className="text-lg md:text-xl opacity-90 animate-in fade-in slide-in-from-top duration-700 delay-200">
            DIVISA: {congressVerse}
          </p>
        </div>
      </header>

      {/* Admin Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          onClick={() => {
            handleLogout();
            navigate("/login");
          }}
          variant="outline"
          className="gap-2 border-2"
        >
          <Lock className="w-4 h-4" />
          Painel Administrativo
        </Button>
      </div>

      {/* Voting Cards */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {hymns.map((hymn) => (
            <HymnCard
              key={hymn.id}
              {...hymn}
              onVote={handleVote}
              hasVoted={hasVoted}
            />
          ))}
        </div>

        {hasVoted && (
          <div className="text-center bg-secondary/10 border-2 border-secondary rounded-lg p-6 animate-in fade-in slide-in-from-bottom duration-500">
            <p className="text-lg font-semibold text-foreground">
              ✓ Obrigado pelo seu voto! Os resultados estão sendo atualizados em tempo real.
            </p>
          </div>
        )}
      </main>

      {/* Footer Banner */}
      <footer className="mt-12 w-full">
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          {congressBanner ? (
            <img
              src={congressBanner}
              alt="Banner do 4º Congresso de Homens"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={bannerImage}
              alt="Banner do 4º Congresso de Homens"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
            <div className="container mx-auto px-4 py-6">
              <p className="text-white text-center text-sm md:text-base font-medium">
                4º Congresso de Homens - {congressTheme}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Voting;