import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
<<<<<<< HEAD
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Printer, BarChart3, Plus, Trash2, LogOut, Loader2, Upload, Download, Power, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface Hymn {
  id: string;
  title: string;
  artist: string;
  video_url: string;
  author_image: string | null;
}

interface HymnWithVotes extends Hymn {
  votes: number;
=======
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
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
}

const Admin = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { user, loading, isAdmin, signOut } = useAuth();
  const { toast } = useToast();

  const [hymns, setHymns] = useState<HymnWithVotes[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [bannerUrl, setBannerUrl] = useState("");
  const [isPolling, setIsPolling] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [votingEnabled, setVotingEnabled] = useState(true);
  const [publicVotingLink, setPublicVotingLink] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  // Page content states with initial empty values
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [originalPageContent, setOriginalPageContent] = useState({
    title: "",
    subtitle: "",
    description: ""
  });

  // Novo hino
  const [newHymn, setNewHymn] = useState({
    title: "",
    artist: "",
    video_url: "",
    author_image: "",
  });

  // Editar hino
  const [editingHymn, setEditingHymn] = useState<Hymn | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/auth");
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isPolling || !isAdmin) return;

    const interval = setInterval(() => {
      // Only load data if not editing content
      if (!isEditingContent) {
        loadData();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPolling, isAdmin, isEditingContent]);

  const loadData = async (forceUpdate = false) => {
    try {
      // Load hymns with vote counts
      const { data: hymnsData, error: hymnsError } = await supabase
        .from("hymns")
        .select("*")
        .order("created_at", { ascending: true });

      if (hymnsError) throw hymnsError;

      // Count votes for each hymn
      const hymnsWithVotes = await Promise.all(
        (hymnsData || []).map(async (hymn) => {
          const { count, error } = await supabase
            .from("votes")
            .select("*", { count: "exact", head: true })
            .eq("hymn_id", hymn.id);

          if (error) throw error;

          return {
            ...hymn,
            votes: count || 0,
          };
        })
      );

      setHymns(hymnsWithVotes);

      const total = hymnsWithVotes.reduce((sum, hymn) => sum + hymn.votes, 0);
      setTotalVotes(total);

      // Load all settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("settings")
        .select("key, value");

      if (settingsError) throw settingsError;
      
      if (settingsData) {
        // Only update page content if not in edit mode or forceUpdate is true
        const shouldUpdateContent = forceUpdate || !isEditingContent;
        
        settingsData.forEach((setting) => {
          if (setting.key === "banner_url") setBannerUrl(setting.value);
          if (setting.key === "page_title" && shouldUpdateContent) {
            setPageTitle(setting.value);
            if (!isEditingContent) {
              setOriginalPageContent(prev => ({ ...prev, title: setting.value }));
            }
          }
          if (setting.key === "page_subtitle" && shouldUpdateContent) {
            setPageSubtitle(setting.value);
            if (!isEditingContent) {
              setOriginalPageContent(prev => ({ ...prev, subtitle: setting.value }));
            }
          }
          if (setting.key === "page_description" && shouldUpdateContent) {
            setPageDescription(setting.value);
            if (!isEditingContent) {
              setOriginalPageContent(prev => ({ ...prev, description: setting.value }));
            }
          }
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
      setIsLoadingData(false);
    }
  };

  const handleAddHymn = async () => {
    if (!newHymn.title || !newHymn.artist || !newHymn.video_url) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("hymns").insert([
        {
          title: newHymn.title,
          artist: newHymn.artist,
          video_url: newHymn.video_url,
          author_image: newHymn.author_image || null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Hino adicionado com sucesso!",
      });

      setNewHymn({ title: "", artist: "", video_url: "", author_image: "" });
      loadData();
    } catch (error) {
      console.error("Error adding hymn:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o hino",
        variant: "destructive",
      });
    }
  };

  const handleDeleteHymn = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este hino?")) return;

    try {
      const { error } = await supabase.from("hymns").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Hino excluído com sucesso!",
      });

      loadData();
    } catch (error) {
      console.error("Error deleting hymn:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o hino",
        variant: "destructive",
      });
    }
  };

  const handleUpdateHymn = async () => {
    if (!editingHymn) return;
    
    if (!editingHymn.title || !editingHymn.artist || !editingHymn.video_url) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("hymns")
        .update({
          title: editingHymn.title,
          artist: editingHymn.artist,
          video_url: editingHymn.video_url,
          author_image: editingHymn.author_image || null,
        })
        .eq("id", editingHymn.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Hino atualizado com sucesso!",
      });

      setEditingHymn(null);
      loadData();
    } catch (error) {
      console.error("Error updating hymn:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o hino",
        variant: "destructive",
      });
    }
  };

  const handleUploadBanner = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("banners")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("settings")
        .update({ value: publicUrl })
        .eq("key", "banner_url");

      if (updateError) throw updateError;

      setBannerUrl(publicUrl);
      toast({
        title: "Sucesso",
        description: "Banner enviado com sucesso!",
      });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o banner",
        variant: "destructive",
      });
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleSavePageContent = async () => {
    if (!pageTitle.trim() || !pageSubtitle.trim() || !pageDescription.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates = [
        { key: "page_title", value: pageTitle.trim() },
        { key: "page_subtitle", value: pageSubtitle.trim() },
        { key: "page_description", value: pageDescription.trim() },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("settings")
          .update({ value: update.value })
          .eq("key", update.key);

        if (error) throw error;
      }

      // Update original content and exit edit mode
      setOriginalPageContent({
        title: pageTitle.trim(),
        subtitle: pageSubtitle.trim(),
        description: pageDescription.trim()
      });
      setIsEditingContent(false);

      toast({
        title: "Sucesso",
        description: "Conteúdo da página atualizado com sucesso!",
      });

      // Reload data to reflect changes
      await loadData(true);
    } catch (error) {
      console.error("Error updating page content:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o conteúdo",
        variant: "destructive",
      });
    }
  };

  const generatePublicVotingLink = () => {
    // Check if all required fields are filled
    const isContentComplete = pageTitle.trim() && pageSubtitle.trim() && pageDescription.trim();
    const areHymnsAvailable = hymns.length > 0;
    const isBannerSet = bannerUrl.trim();
    
    if (!isContentComplete || !areHymnsAvailable || !isBannerSet) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos (Hinos Cadastrados, Conteúdo da Página e Banner do Rodapé) para gerar o link público.",
        variant: "destructive",
      });
      return null;
    }
    
    // Generate the public voting link
    const link = `${window.location.origin}`;
    setPublicVotingLink(link);
    return link;
  };

  const copyPublicVotingLink = () => {
    if (!publicVotingLink) {
      const link = generatePublicVotingLink();
      if (!link) return;
    }
    
    navigator.clipboard.writeText(publicVotingLink);
    toast({
      title: "Link copiado!",
      description: "O link público foi copiado para a área de transferência.",
    });
  };

  const handleToggleVoting = async () => {
    try {
      const newValue = !votingEnabled;
      const { error } = await supabase
        .from("settings")
        .update({ value: String(newValue) })
        .eq("key", "voting_enabled");

      if (error) throw error;

      setVotingEnabled(newValue);
      toast({
        title: "Sucesso",
        description: `Votação ${newValue ? "ativada" : "encerrada"}!`,
      });
    } catch (error) {
      console.error("Error toggling voting:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da votação",
        variant: "destructive",
      });
    }
  };

  const handleExportPNG = async () => {
    if (!resultsRef.current) return;

    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `resultados-votacao-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Sucesso",
        description: "Resultados exportados em PNG!",
      });
    } catch (error) {
      console.error("Error exporting PNG:", error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar os resultados",
        variant: "destructive",
      });
    }
  };
=======
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
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8

  const handlePrint = () => {
    window.print();
  };

<<<<<<< HEAD
  const handleSignOut = async () => {
    await signOut();
=======
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
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
    navigate("/");
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const sortedHymns = [...hymns].sort((a, b) => b.votes - a.votes);

<<<<<<< HEAD
  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }
=======
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
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground py-8 px-4 shadow-xl print:bg-primary">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4 print:mb-2">
<<<<<<< HEAD
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/")}
                variant="secondary"
                className="gap-2 print:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="secondary"
                className="gap-2 print:hidden"
=======
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
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
<<<<<<< HEAD
            
            <Button
              onClick={handlePrint}
              variant="secondary"
              className="gap-2 print:hidden"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Painel Administrativo
=======
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Painel Administrativo - Resultados em Tempo Real
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
          </h1>
        </div>
      </header>

<<<<<<< HEAD
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 print:hidden">
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="hymns">Gerenciar Hinos</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Tab: Resultados */}
          <TabsContent value="results" className="space-y-6">
            <div className="flex gap-2 print:hidden mb-4">
              <Button onClick={handleExportPNG} className="gap-2">
                <Download className="w-4 h-4" />
                Exportar PNG
              </Button>
              <Button 
                onClick={handleToggleVoting}
                variant={votingEnabled ? "destructive" : "default"}
                className="gap-2"
              >
                <Power className="w-4 h-4" />
                {votingEnabled ? "Encerrar Votação" : "Reabrir Votação"}
              </Button>
            </div>

            <div ref={resultsRef}>
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-2 border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Status da Enquete
                </h2>
                <div className="flex items-center gap-2 print:hidden">
                  <div className={`w-3 h-3 rounded-full ${isPolling ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">
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
                    
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
                        style={{ width: `${getPercentage(hymn.votes)}%` }}
                      />
                    </div>
                  </div>
                ))}
                
                {hymns.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      Nenhum hino cadastrado ainda.
=======
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
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
                    </p>
                  </div>
                )}
              </div>
<<<<<<< HEAD
            </Card>
            </div>

            <div className="flex justify-center gap-4 print:hidden">
              <Button
                onClick={() => setIsPolling(!isPolling)}
                variant={isPolling ? "destructive" : "default"}
              >
                {isPolling ? "Pausar Atualização" : "Retomar Atualização"}
              </Button>
            </div>
          </TabsContent>

          {/* Tab: Gerenciar Hinos */}
          <TabsContent value="hymns" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Adicionar Novo Hino</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={newHymn.title}
                    onChange={(e) => setNewHymn({ ...newHymn, title: e.target.value })}
                    placeholder="Nome do hino"
                  />
                </div>

                <div>
                  <Label htmlFor="artist">Artista *</Label>
                  <Input
                    id="artist"
                    value={newHymn.artist}
                    onChange={(e) => setNewHymn({ ...newHymn, artist: e.target.value })}
                    placeholder="Nome do artista"
                  />
                </div>

                <div>
                  <Label htmlFor="video_url">Link do Vídeo *</Label>
                  <Input
                    id="video_url"
                    value={newHymn.video_url}
                    onChange={(e) => setNewHymn({ ...newHymn, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <Label htmlFor="author_image">URL da Imagem do Autor</Label>
                  <Input
                    id="author_image"
                    value={newHymn.author_image}
                    onChange={(e) => setNewHymn({ ...newHymn, author_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <Button onClick={handleAddHymn} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Hino
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Hinos Cadastrados</h2>
              
              {editingHymn && (
                <Card className="p-4 mb-6 bg-accent/10 border-accent">
                  <h3 className="text-lg font-bold mb-4">Editando Hino</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Título *</Label>
                      <Input
                        value={editingHymn.title}
                        onChange={(e) => setEditingHymn({ ...editingHymn, title: e.target.value })}
                        placeholder="Nome do hino"
                      />
                    </div>

                    <div>
                      <Label>Artista *</Label>
                      <Input
                        value={editingHymn.artist}
                        onChange={(e) => setEditingHymn({ ...editingHymn, artist: e.target.value })}
                        placeholder="Nome do artista"
                      />
                    </div>

                    <div>
                      <Label>Link do Vídeo *</Label>
                      <Input
                        value={editingHymn.video_url || ""}
                        onChange={(e) => setEditingHymn({ ...editingHymn, video_url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <Label>URL da Imagem do Autor</Label>
                      <Input
                        value={editingHymn.author_image || ""}
                        onChange={(e) => setEditingHymn({ ...editingHymn, author_image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleUpdateHymn} className="flex-1">
                        Salvar Alterações
                      </Button>
                      <Button onClick={() => setEditingHymn(null)} variant="outline" className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              <div className="space-y-4">
                {hymns.map((hymn) => (
                  <div
                    key={hymn.id}
                    className="flex items-center justify-between p-4 border-2 border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold">{hymn.title}</h3>
                      <p className="text-sm text-muted-foreground">{hymn.artist}</p>
                      {!hymn.video_url && (
                        <p className="text-xs text-destructive mt-1">⚠️ Link do vídeo não configurado</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingHymn(hymn)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteHymn(hymn.id)}
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
                
                {hymns.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum hino cadastrado ainda.
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Conteúdo da Página */}
          <TabsContent value="content" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Editar Conteúdo da Página</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="page_title">Título Principal</Label>
                  <Input
                    id="page_title"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="Ex: Congresso de Homens 2025"
                    disabled={!isEditingContent}
                  />
                </div>

                <div>
                  <Label htmlFor="page_subtitle">Subtítulo</Label>
                  <Input
                    id="page_subtitle"
                    value={pageSubtitle}
                    onChange={(e) => setPageSubtitle(e.target.value)}
                    placeholder="Ex: Escolha o Hino que Mais Tocou Seu Coração!"
                    disabled={!isEditingContent}
                  />
                </div>

                <div>
                  <Label htmlFor="page_description">Descrição</Label>
                  <Textarea
                    id="page_description"
                    value={pageDescription}
                    onChange={(e) => setPageDescription(e.target.value)}
                    placeholder="Ex: Vote no seu hino favorito..."
                    disabled={!isEditingContent}
                  />
                </div>

                <div className="flex gap-2">
                  {!isEditingContent ? (
                    <Button onClick={() => setIsEditingContent(true)} className="w-full">
                      Editar Conteúdo
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSavePageContent} className="flex-1">
                        Salvar Conteúdo
                      </Button>
                      <Button 
                        onClick={() => {
                          // Restore original values
                          setPageTitle(originalPageContent.title);
                          setPageSubtitle(originalPageContent.subtitle);
                          setPageDescription(originalPageContent.description);
                          setIsEditingContent(false);
                        }} 
                        variant="outline" 
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Configurar Banner do Rodapé</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="banner_upload">Upload de Imagem</Label>
                  <div className="flex gap-2">
                    <Input
                      id="banner_upload"
                      type="file"
                      accept="image/*"
                      onChange={handleUploadBanner}
                      disabled={isUploadingBanner}
                      className="flex-1"
                    />
                    <Button
                      disabled={isUploadingBanner}
                      size="icon"
                      variant="secondary"
                    >
                      {isUploadingBanner ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Envie uma imagem para o banner do rodapé
                  </p>
                </div>

                {bannerUrl && (
                  <div className="border-2 border-border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Banner Atual:</p>
                    <img
                      src={bannerUrl}
                      alt="Banner atual"
                      className="w-full rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/800x200?text=Erro+ao+carregar+imagem";
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Public Voting Link Section */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Link Público para Votação</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Após preencher todos os campos (Hinos Cadastrados, Conteúdo da Página e Banner do Rodapé), 
                  gere um link público para que os usuários possam votar.
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={generatePublicVotingLink}
                    className="flex-1"
                  >
                    Gerar Link Público
                  </Button>
                  
                  {publicVotingLink && (
                    <Button 
                      onClick={copyPublicVotingLink}
                      variant="outline"
                      className="flex-1"
                    >
                      Copiar Link
                    </Button>
                  )}
                </div>
                
                {publicVotingLink && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Link Público:</p>
                    <p className="text-sm break-all text-primary">{publicVotingLink}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
=======
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
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
<<<<<<< HEAD
          .print\\:hidden {
=======
          header button, .print\\:hidden {
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
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

<<<<<<< HEAD
export default Admin;
=======
export default Admin;
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
