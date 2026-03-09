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
  ImagePlus,
} from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { onAuthStateChange, type AppUser } from '@/services/authService';
import { Role, type ChatMessage } from '@/types';
import { useLang } from '@/components/LanguageProvider';

export default function TryOnPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();

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
  const [chatAttachment, setChatAttachment] = useState<string | null>(null);
  const chatFileRef = useRef<HTMLInputElement>(null);

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

  const saveToGallery = async (imageUrl: string) => {
    try {
      const blob = await fetch(imageUrl).then(r => r.blob());
      const file = new File([blob], `agalaz-${Date.now()}.png`, { type: 'image/png' });
      const canShare = typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });
      if (canShare) {
        await navigator.share({ files: [file] });
        return;
      }
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `agalaz-${Date.now()}.png`;
      a.click();
    } catch {}
  };

  const handleStartAnalysis = async () => {
    if (!faceImage || !bodyImage) {
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

    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
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
            text: clothingImage ? t.segmented : (t.seamlessId),
            image: data.image,
          }]);
          setRenderCount((prev) => prev + 1);
          saveToGallery(data.image);
          break;
        } else if (retries < maxRetries) {
          retries++;
          continue;
        } else {
          setError(data.error || t.precisionError);
        }
      } catch {
        if (retries < maxRetries) {
          retries++;
          continue;
        }
        setError(t.engineError);
      }
      break;
    }

    setIsAnalyzing(false);
    setIsGeneratingImage(false);
  };

  const handleChatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setChatAttachment(base64);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAnalyzing || isGeneratingImage) return;

    const attachedImage = chatAttachment;
    setChatAttachment(null);

    setMessages((prev) => [...prev, {
      role: Role.USER,
      text: attachedImage ? `${text} [+image]` : text,
      image: attachedImage ? `data:image/jpeg;base64,${attachedImage}` : undefined,
    }]);
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

      // Always attempt image re-generation for any chat message (user is modifying the result)
      const hasExistingImage = messages.some((m) => m.image);
      if (hasExistingImage) {
        setIsGeneratingImage(true);
        const lastImage = [...messages].reverse().find((m) => m.image && m.role === Role.MODEL)?.image;

        // If user attached an image, use it as clothing reference
        const effectiveClothing = attachedImage || clothingImage;

        let genData: any = null;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const genRes = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                faceImage,
                bodyImage,
                clothingImage: effectiveClothing,
                modificationPrompt: text,
                lastRenderedImage: lastImage,
              }),
            });
            genData = await genRes.json();
            if (genData.image) break;
          } catch {
            if (attempt === 1) break;
          }
        }

        if (genData?.image) {
          setMessages((prev) => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg && lastMsg.role === Role.MODEL) {
              lastMsg.image = genData.image;
            }
            return newMsgs;
          });
          saveToGallery(genData.image);
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
        const file = new File([blob], 'agalaz-tryon.png', { type: 'image/png' });
        await navigator.share({ files: [file], title: 'Agalaz Fashion' });
      } catch {}
    }
  };

  const handleDownloadImage = (imageUrl: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'agalaz-tryon.png';
    a.click();
  };

  const isLoading = isAnalyzing || isGeneratingImage;
  const canRender = faceImage && bodyImage && !isLoading;

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
                  <h1 className="text-sm font-black tracking-tight text-white leading-tight">Agalaz</h1>
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
          style={{ paddingBottom: messages.length > 0 ? 140 : 20 }}
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
                  <div>
                    <ImageUploader
                      label={t.bodyLabel}
                      type="user"
                      image={bodyImage}
                      onImageSelect={setBodyImage}
                      icon={<UserSquare2 size={20} className="text-emerald-400" />}
                    />
                    <p className="text-[8px] font-bold text-white/20 text-center mt-1 px-1">
                      {t.bodyHint}
                    </p>
                  </div>
                </div>
                <div>
                  <ImageUploader
                    label={`${t.clothingLabel} (${t.optional})`}
                    type="clothing"
                    image={clothingImage}
                    onImageSelect={setClothingImage}
                    icon={<Shirt size={20} className="text-amber-400" />}
                  />
                </div>
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
                  {msg.role === Role.USER && msg.image ? (
                    <div className="max-w-[85%] space-y-2">
                      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl rounded-br-sm p-4">
                        <p className="text-[13px] font-bold text-white">{msg.text.replace(' [+image]', '')}</p>
                      </div>
                      <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-indigo-500/30 ml-auto">
                        <img src={msg.image} alt="Reference" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ) : msg.image ? (
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
          <div className="fixed bottom-0 left-0 right-0 glass-dark z-20" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            {/* Quick suggestion chips */}
            {!isLoading && messages.some(m => m.image) && (
              <div className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto hide-scrollbar">
                {(lang === 'es'
                  ? ['Manga larga', 'Cambiar color', 'Más oscuro', 'Sin logo', 'Más ajustado']
                  : ['Long sleeves', 'Change color', 'Darker', 'No logo', 'Tighter fit']
                ).map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSendMessage(chip)}
                    className="shrink-0 px-3 py-1.5 glass rounded-full text-[10px] font-bold text-white/40 hover:text-white/60 hover:bg-white/10 transition-all press-scale"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            {/* Attachment preview */}
            {chatAttachment && (
              <div className="px-4 pt-2 flex items-center gap-2">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-indigo-500/50">
                  <img src={`data:image/jpeg;base64,${chatAttachment}`} alt="Attached" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setChatAttachment(null)}
                    className="absolute -top-0.5 -right-0.5 bg-black/80 rounded-full p-0.5"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                  {lang === 'es' ? 'Referencia adjunta' : 'Reference attached'}
                </span>
              </div>
            )}
            <div className="max-w-md mx-auto flex items-center gap-2 p-1.5 px-4">
              <div className="flex-1 flex items-center gap-2 p-1.5 glass rounded-2xl">
                <button
                  onClick={() => chatFileRef.current?.click()}
                  className="p-3 rounded-xl hover:bg-white/10 transition-colors press-scale shrink-0"
                >
                  <ImagePlus size={18} className={chatAttachment ? 'text-indigo-400' : 'text-white/25'} />
                </button>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(inputValue);
                  }}
                  placeholder={t.chatPlaceholder}
                  className="flex-1 px-2 py-3 text-[13px] font-bold text-white placeholder:text-white/20 bg-transparent outline-none"
                  enterKeyHint="send"
                  autoComplete="off"
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
            <input
              ref={chatFileRef}
              type="file"
              accept="image/*"
              onChange={handleChatFileChange}
              className="hidden"
            />
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
