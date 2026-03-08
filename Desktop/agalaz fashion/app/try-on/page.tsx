'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Send,
  RefreshCcw,
  Shirt,
  Star,
  Fingerprint,
  AlertCircle,
  Target,
  Eye,
  ShieldCheck,
  UserSquare2,
  X,
  Loader2,
  ChevronLeft,
  Download,
  Share2,
} from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { onAuthStateChange, type AppUser } from '@/services/authService';
import { Role, type ChatMessage } from '@/types';
import { useLang } from '@/components/LanguageProvider';

const IMAGE_KEYWORDS = [
  'color', 'talla', 'peinado', 'cambia', 'pon', 'ajusta', 'vea', 'prenda',
  'adjuntar', 'mira', 'foto', 'render', 'estilo', 'look', 'quede', 'prueba',
  'cuerpo', 'realista', 'luz', 'change', 'put', 'adjust', 'style', 'try',
  'sleeve', 'manga', 'shorter', 'longer', 'bigger', 'smaller',
];

export default function TryOnPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  const [user, setUser] = useState<AppUser | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderCount, setRenderCount] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((authUser) => {
      if (authUser) setUser(authUser);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  }, [messages, isAnalyzing, isGeneratingImage]);

  const resetApp = () => {
    setFaceImage(null);
    setBodyImage(null);
    setClothingImage(null);
    setMessages([]);
    setInputValue('');
    setError(null);
    setRenderCount(0);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleStartAnalysis = async () => {
    if (!faceImage || !bodyImage || !clothingImage) {
      setError(t.missingPhotos);
      return;
    }
    if (renderCount >= 10) {
      router.push('/paywall');
      return;
    }

    setIsAnalyzing(true);
    setIsGeneratingImage(true);
    setError(null);
    setMessages([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceImage, bodyImage, clothingImage }),
      });
      const data = await res.json();

      if (data.image) {
        setMessages([{
          role: Role.MODEL,
          text: t.segmented,
          image: data.image,
        }]);
        setRenderCount((prev) => prev + 1);
      } else {
        setError(data.error || t.precisionError);
      }
    } catch {
      setError(t.engineError);
    } finally {
      setIsAnalyzing(false);
      setIsGeneratingImage(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAnalyzing || isGeneratingImage) return;

    setMessages((prev) => [...prev, { role: Role.USER, text }]);
    setInputValue('');
    setIsAnalyzing(true);
    setError(null);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      const chatData = await chatRes.json();
      const modelText = chatData.text || 'Adjusting...';

      setMessages((prev) => [...prev, { role: Role.MODEL, text: modelText }]);
      setIsAnalyzing(false);

      const query = text.toLowerCase();
      const needsImage = IMAGE_KEYWORDS.some((k) => query.includes(k));

      if (needsImage) {
        setIsGeneratingImage(true);
        const lastImage = [...messages].reverse().find((m) => m.image)?.image;
        const genRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            faceImage,
            bodyImage,
            clothingImage,
            modificationPrompt: text,
            lastRenderedImage: lastImage,
          }),
        });
        const genData = await genRes.json();

        if (genData.image) {
          setMessages((prev) => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg && lastMsg.role === Role.MODEL) {
              lastMsg.image = genData.image;
            }
            return newMsgs;
          });
        }
        setIsGeneratingImage(false);
      }
    } catch {
      setError(t.updateError);
      setIsAnalyzing(false);
      setIsGeneratingImage(false);
    }
  };

  const handleShareImage = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        const blob = await fetch(imageUrl).then(r => r.blob());
        const file = new File([blob], 'aura-tryon.png', { type: 'image/png' });
        await navigator.share({ files: [file], title: 'Aura Fashion AI' });
      } catch {}
    }
  };

  const handleDownloadImage = (imageUrl: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'aura-tryon.png';
    a.click();
  };

  const isLoading = isAnalyzing || isGeneratingImage;
  const canRender = faceImage && bodyImage && clothingImage && !isLoading;

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <header className="glass-dark px-5 py-3 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors press-scale"
            >
              <ChevronLeft size={22} className="text-white/60" />
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-indigo-500/30">
                  <img
                    src={user.avatar || `https://i.pravatar.cc/100?u=${user.email}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-tight text-white leading-tight">
                    {user.name.split(' ')[0]}
                  </h1>
                  <div className="flex items-center gap-1">
                    <Star size={8} className="text-indigo-400 fill-indigo-400" />
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">
                      Premium
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-lg italic">A</span>
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-tight text-white leading-tight">Aura</h1>
                  <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">
                    Engine V7.0
                  </span>
                </div>
              </div>
            )}
          </div>

          {(faceImage || messages.length > 0) && (
            <div className="flex gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors press-scale"
                >
                  <Shirt size={14} className="text-white/50" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                    {t.editBtn}
                  </span>
                </button>
              )}
              <button
                onClick={resetApp}
                className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors press-scale"
              >
                <RefreshCcw size={16} className="text-white/50" />
              </button>
            </div>
          )}
        </header>

        {/* Render counter */}
        {renderCount > 0 && (
          <div className="flex justify-center py-2">
            <div className="flex items-center gap-2 px-3 py-1 glass rounded-full">
              <Sparkles size={10} className="text-indigo-400" />
              <span className="text-[9px] font-bold text-white/30">
                {renderCount}/10 renders
              </span>
              <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${(renderCount / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar"
          style={{ paddingBottom: messages.length > 0 ? 110 : 20 }}
        >
          {messages.length === 0 ? (
            <div className="max-w-md mx-auto space-y-6 animate-fade-in">
              <div className="text-center space-y-2 px-4 pt-4">
                <h2 className="text-3xl font-black text-white tracking-tight leading-[1.1]">
                  {t.preserveTitle}
                  <br />
                  <span className="text-gradient italic">{t.preserveHighlight}</span>
                </h2>
                <p className="text-white/35 text-sm font-medium">{t.preserveDesc}</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <ImageUploader
                    label={t.faceLabel}
                    type="user"
                    image={faceImage}
                    onImageSelect={setFaceImage}
                    icon={<Fingerprint size={20} className="text-indigo-400" />}
                  />
                  <ImageUploader
                    label={t.bodyLabel}
                    type="user"
                    image={bodyImage}
                    onImageSelect={setBodyImage}
                    icon={<UserSquare2 size={20} className="text-emerald-400" />}
                  />
                </div>
                <ImageUploader
                  label={t.clothingLabel}
                  type="clothing"
                  image={clothingImage}
                  onImageSelect={setClothingImage}
                  icon={<Shirt size={20} className="text-amber-400" />}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center gap-3 animate-fade-in">
                  <AlertCircle size={18} className="text-red-400 shrink-0" />
                  <span className="text-[11px] font-bold text-red-400">{error}</span>
                </div>
              )}

              <button
                onClick={handleStartAnalysis}
                disabled={!canRender}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all press-scale ${
                  canRender
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/20 animate-glow'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {isLoading ? (
                  <Loader2 size={20} className="text-white animate-spin" />
                ) : (
                  <Sparkles size={20} className={canRender ? 'text-white' : 'text-white/20'} />
                )}
                <span className={`font-black uppercase tracking-widest text-xs ${canRender ? 'text-white' : 'text-white/20'}`}>
                  {t.renderBtn}
                </span>
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === Role.USER ? 'items-end' : 'items-start'} animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {msg.image ? (
                    <div className="w-full space-y-2" style={{ maxWidth: '95%' }}>
                      <button
                        onClick={() => setFullscreenImage(msg.image!)}
                        className="block rounded-3xl overflow-hidden border border-white/10 w-full press-scale"
                      >
                        <div className="relative">
                          <img
                            src={msg.image}
                            alt="Try-on result"
                            className="w-full"
                            style={{ aspectRatio: '9 / 16', objectFit: 'cover' }}
                          />
                          <div className="absolute top-3 left-3 space-y-1.5">
                            <div className="glass-dark px-3 py-1.5 rounded-full flex items-center gap-2">
                              <Target size={12} className="text-indigo-400" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-white/80">
                                {t.outfitPreserved}
                              </span>
                            </div>
                            <div className="glass-dark px-3 py-1.5 rounded-full flex items-center gap-2">
                              <ShieldCheck size={12} className="text-emerald-400" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-white/80">
                                {t.seamlessId}
                              </span>
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3 flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDownloadImage(msg.image!); }}
                              className="glass-dark rounded-full p-2.5 hover:bg-white/20 transition-colors"
                            >
                              <Download size={16} className="text-white/80" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleShareImage(msg.image!); }}
                              className="glass-dark rounded-full p-2.5 hover:bg-white/20 transition-colors"
                            >
                              <Share2 size={16} className="text-white/80" />
                            </button>
                            <div className="glass-dark rounded-full p-2.5">
                              <Eye size={16} className="text-white/80" />
                            </div>
                          </div>
                        </div>
                      </button>
                      {msg.text && (
                        <div className="glass p-3 rounded-2xl ml-3">
                          <p className="text-[11px] font-bold text-white/60 leading-tight italic">
                            &ldquo;{msg.text}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] p-4 ${
                        msg.role === Role.USER
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl rounded-br-sm'
                          : 'glass rounded-2xl rounded-bl-sm'
                      }`}
                    >
                      <p className={`text-[13px] font-bold ${
                        msg.role === Role.USER ? 'text-white' : 'text-white/50'
                      }`}>
                        {msg.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="glass px-5 py-3 rounded-full flex items-center gap-3">
                    <Loader2 size={14} className="text-indigo-400 animate-spin" />
                    <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">
                      {t.protectingOutfit}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Input */}
        {messages.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 glass-dark z-20" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="max-w-md mx-auto flex items-center gap-2 p-1.5 glass rounded-2xl">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputValue);
                }}
                placeholder={t.chatPlaceholder}
                className="flex-1 px-4 py-3 text-[13px] font-bold text-white placeholder:text-white/20 bg-transparent outline-none"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className={`p-3 rounded-xl transition-all press-scale ${
                  !inputValue.trim() || isLoading
                    ? 'bg-white/5'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20'
                }`}
              >
                <Send size={18} className={!inputValue.trim() || isLoading ? 'text-white/20' : 'text-white'} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Overlay */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-fade-in-scale"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-3 glass rounded-full hover:bg-white/20 transition-colors z-10 press-scale"
            style={{ top: 'max(1.5rem, env(safe-area-inset-top))' }}
          >
            <X size={22} className="text-white" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3" style={{ bottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
            <button
              onClick={(e) => { e.stopPropagation(); handleDownloadImage(fullscreenImage); }}
              className="glass px-5 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors press-scale"
            >
              <Download size={16} className="text-white/80" />
              <span className="text-xs font-bold text-white/80">Save</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleShareImage(fullscreenImage); }}
              className="glass px-5 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors press-scale"
            >
              <Share2 size={16} className="text-white/80" />
              <span className="text-xs font-bold text-white/80">Share</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
