import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Printer, BarChart3, Upload, LogOut, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Hymn {
  id: number;
  title: string;
  artist: string;
  votes: number;
  videoUrl: string;
  authorImage: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isPolling, setIsPolling] = useState(true);
  
  // Estados para os campos do formulário
  const [congressTitle, setCongressTitle] = useState("ESCOLHA DE HINOS PARA O 4º CONGRESSO DE HOMENS");
  const [congressTheme, setCongressTheme] = useState("HOMENS INABALÁVEIS, FIRMES EM CRISTO EM UM MUNDO CAÍDO");
  const [congressVerse, setCongressVerse] = useState("1º CORÍNTIOS 15:58");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [newHymn, setNewHymn] = useState({
    title: "",
    artist: "",
    videoUrl: ""
  });

  useEffect(() => {
    const loadVotes = () => {
      const savedVotes = localStorage.getItem("hymnVotes");
      if (savedVotes) {
        const parsedHymns = JSON.parse(savedVotes);
        setHymns(parsedHymns);
        const total = parsedHymns.reduce((sum: number, hymn: Hymn) => sum + hymn.votes, 0);
        setTotalVotes(total);
      }
    };

    // Carregar configurações salvas
    const savedTitle = localStorage.getItem("congressTitle");
    const savedTheme = localStorage.getItem("congressTheme");
    const savedVerse = localStorage.getItem("congressVerse");
    
    if (savedTitle) {
      setCongressTitle(savedTitle);
    }
    
    if (savedTheme) {
      setCongressTheme(savedTheme);
    }
    
    if (savedVerse) {
      setCongressVerse(savedVerse);
    }

    loadVotes();

    // Atualizar a cada 2 segundos para simular tempo real
    const interval = setInterval(() => {
      if (isPolling) {
        loadVotes();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPolling]);

  const handlePrint = () => {
    window.print();
  };

  // Função para carregar html2canvas dinamicamente
  const loadHtml2Canvas = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Verificar se já está carregado
      if (window.html2canvas) {
        resolve(window.html2canvas);
        return;
      }

      // Criar script element
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      script.onload = () => {
        resolve(window.html2canvas);
      };
      script.onerror = () => {
        reject(new Error('Failed to load html2canvas'));
      };
      document.head.appendChild(script);
    });
  };

  // Função para exportar como PNG usando html2canvas
  const handleExportToPng = async () => {
    if (printRef.current) {
      try {
        // Mostrar mensagem de carregamento
        const originalText = (document.querySelector('button[data-export-png]') as HTMLButtonElement)?.innerText;
        const button = document.querySelector('button[data-export-png]') as HTMLButtonElement;
        if (button) {
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin mr-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Exportando...';
          button.disabled = true;
        }

        // Carregar html2canvas
        const html2canvas = await loadHtml2Canvas();
        
        // Capturar o elemento como canvas
        const canvas = await html2canvas(printRef.current, {
          scale: 2, // Melhor qualidade
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        });
        
        // Converter para blob e fazer download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'resultados-enquete.png';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
          
          // Restaurar botão
          if (button) {
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Exportar PNG';
            button.disabled = false;
          }
        }, 'image/png');
      } catch (error) {
        console.error('Erro ao exportar como PNG:', error);
        alert('Erro ao exportar como PNG. Por favor, tente novamente.');
        
        // Restaurar botão
        const button = document.querySelector('button[data-export-png]') as HTMLButtonElement;
        if (button) {
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Exportar PNG';
          button.disabled = false;
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const sortedHymns = [...hymns].sort((a, b) => b.votes - a.votes);

  const handleAddHymn = () => {
    if (newHymn.title && newHymn.artist) {
      const newHymnObj: Hymn = {
        id: hymns.length + 1,
        title: newHymn.title,
        artist: newHymn.artist,
        videoUrl: newHymn.videoUrl,
        authorImage: "",
        votes: 0
      };
      
      const updatedHymns = [...hymns, newHymnObj];
      setHymns(updatedHymns);
      localStorage.setItem("hymnVotes", JSON.stringify(updatedHymns));
      
      // Limpar o formulário
      setNewHymn({
        title: "",
        artist: "",
        videoUrl: ""
      });
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImage(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerClick = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };

  const handleSaveBanner = () => {
    if (bannerImage) {
      // Salvar o banner no localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("congressBanner", reader.result as string);
        alert("Banner salvo com sucesso!");
      };
      reader.readAsDataURL(bannerImage);
    }
  };

  const handleSaveSettings = () => {
    // Salvar todas as configurações no localStorage
    localStorage.setItem("congressTitle", congressTitle);
    localStorage.setItem("congressTheme", congressTheme);
    localStorage.setItem("congressVerse", congressVerse);
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground py-8 px-4 shadow-xl print:bg-primary">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4 print:mb-2">
            <Button
              onClick={() => navigate("/")}
              variant="secondary"
              className="gap-2 print:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <div className="flex gap-2 print:hidden">
              <Button
                onClick={handlePrint}
                variant="secondary"
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir Resultados
              </Button>
              
              <Button
                onClick={handleExportToPng}
                variant="default"
                className="gap-2"
                data-export-png="true"
              >
                <Download className="w-4 h-4" />
                Exportar PNG
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Painel Administrativo - Resultados em Tempo Real
          </h1>
        </div>
      </header>

      <main ref={printRef} className="container mx-auto px-4 py-8">
        {/* Configurações do Congresso */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-card to-card/80 border-2 border-border">
          <h2 className="text-2xl font-bold mb-4">Configurações do Congresso</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título Principal</Label>
                <Input
                  id="title"
                  value={congressTitle}
                  onChange={(e) => setCongressTitle(e.target.value)}
                  placeholder="Digite o título principal"
                />
              </div>
              
              <div>
                <Label htmlFor="theme">Tema do Congresso</Label>
                <Textarea
                  id="theme"
                  value={congressTheme}
                  onChange={(e) => setCongressTheme(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="verse">Divisa do Congresso</Label>
                <Input
                  id="verse"
                  value={congressVerse}
                  onChange={(e) => setCongressVerse(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="banner">Banner do Rodapé</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    ref={bannerInputRef}
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={handleBannerClick}
                    variant="outline" 
                    className="gap-2 flex-1"
                  >
                    <Upload className="w-4 h-4" />
                    Selecionar Imagem
                  </Button>
                  <Button 
                    onClick={handleSaveBanner}
                    variant="default" 
                    className="gap-2"
                    disabled={!bannerImage}
                  >
                    Salvar
                  </Button>
                </div>
                {bannerImage && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Arquivo selecionado: {bannerImage.name}
                  </p>
                )}
                {bannerPreview && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Pré-visualização:</p>
                    <div className="border rounded-lg overflow-hidden max-w-xs">
                      <img 
                        src={bannerPreview} 
                        alt="Pré-visualização do banner" 
                        className="w-full h-auto max-h-32 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Adicionar Novo Hino */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-card to-card/80 border-2 border-border">
          <h2 className="text-2xl font-bold mb-4">Adicionar Novo Hino</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hymnTitle">Título do Hino</Label>
              <Input
                id="hymnTitle"
                value={newHymn.title}
                onChange={(e) => setNewHymn({...newHymn, title: e.target.value})}
                placeholder="Digite o título"
              />
            </div>
            
            <div>
              <Label htmlFor="hymnArtist">Autor do Hino</Label>
              <Input
                id="hymnArtist"
                value={newHymn.artist}
                onChange={(e) => setNewHymn({...newHymn, artist: e.target.value})}
                placeholder="Digite o autor"
              />
            </div>
            
            <div>
              <Label htmlFor="hymnVideo">Link do Vídeo</Label>
              <Input
                id="hymnVideo"
                value={newHymn.videoUrl}
                onChange={(e) => setNewHymn({...newHymn, videoUrl: e.target.value})}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddHymn}>Adicionar Hino</Button>
          </div>
        </Card>

        {/* Status da Enquete */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-card to-card/80 border-2 border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Status da Enquete
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isPolling ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm font-medium print:hidden">
                {isPolling ? 'Atualizando em tempo real' : 'Pausado'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary/10 rounded-lg p-4 border-2 border-secondary">
              <p className="text-sm text-muted-foreground mb-1">Total de Votos</p>
              <p className="text-3xl font-bold text-foreground">{totalVotes}</p>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary">
              <p className="text-sm text-muted-foreground mb-1">Hinos Concorrendo</p>
              <p className="text-3xl font-bold text-foreground">{hymns.length}</p>
            </div>
            
            <div className="bg-accent/10 rounded-lg p-4 border-2 border-accent">
              <p className="text-sm text-muted-foreground mb-1">Líder Atual</p>
              <p className="text-xl font-bold text-foreground truncate">
                {sortedHymns[0]?.title || "Aguardando votos"}
              </p>
            </div>
          </div>
        </Card>

        {/* Resultados Detalhados */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-2 border-border">
          <h2 className="text-2xl font-bold mb-6">Resultados Detalhados</h2>
          
          <div className="space-y-4">
            {sortedHymns.map((hymn, index) => (
              <div 
                key={hymn.id} 
                className="bg-background rounded-lg p-4 border-2 border-border hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                      ${index === 0 ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {index + 1}º
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{hymn.title}</h3>
                      <p className="text-sm text-muted-foreground">{hymn.artist}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{hymn.votes}</p>
                    <p className="text-sm text-muted-foreground">{getPercentage(hymn.votes)}%</p>
                  </div>
                </div>
                
                {/* Barra de Progresso */}
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
                    style={{ width: `${getPercentage(hymn.votes)}%` }}
                  />
                </div>
                
                {/* Informações do vídeo */}
                {hymn.videoUrl && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Vídeo: <a href={hymn.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {hymn.videoUrl}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {hymns.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum voto registrado ainda. Aguardando participação...
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Controles de Enquete */}
        <div className="mt-8 flex justify-center gap-4 print:hidden">
          <Button
            onClick={() => setIsPolling(!isPolling)}
            variant={isPolling ? "destructive" : "default"}
            className="gap-2"
          >
            {isPolling ? "Pausar Atualização" : "Retomar Atualização"}
          </Button>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          header button, .print\\:hidden {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;