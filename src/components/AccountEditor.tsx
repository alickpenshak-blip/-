import React, { useState, useEffect } from "react";
import { InstagramProfile } from "../types";
import { 
  Sparkles, 
  X, 
  Instagram, 
  Search, 
  HelpCircle, 
  Layers, 
  FileText, 
  Globe, 
  TrendingUp, 
  Users, 
  Image as ImageIcon,
  Check
} from "lucide-react";

interface AccountEditorProps {
  isOpen: boolean;
  onClose: () => void;
  // If editing, pass current profile, otherwise it's in Add Mode
  editingProfile: InstagramProfile | null;
  onSave: (profile: InstagramProfile) => void;
}

export default function AccountEditor({
  isOpen,
  onClose,
  editingProfile,
  onSave
}: AccountEditorProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "manual">("ai");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // URL Input
  const [urlOrUsername, setUrlOrUsername] = useState("");

  // Edit / Manual Add fields
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const [posts, setPosts] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("Личный блог");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [engagementRate, setEngagementRate] = useState("");

  // Populate fields if editing
  useEffect(() => {
    if (editingProfile) {
      setActiveTab("manual");
      setUsername(editingProfile.username);
      setFullName(editingProfile.fullName);
      setFollowers(editingProfile.followersCount);
      setFollowing(editingProfile.followingCount);
      setPosts(editingProfile.postsCount);
      setBio(editingProfile.bio || "");
      setCategory(editingProfile.category || "Личный блог");
      setAvatarUrl(editingProfile.avatarUrl || "");
      setLocation(editingProfile.location || "");
      setEmail(editingProfile.contactEmail || "");
      setEngagementRate(editingProfile.engagementRate || "");
    } else {
      setActiveTab("ai");
      // Reset inputs
      setUrlOrUsername("");
      setUsername("");
      setFullName("");
      setFollowers("12.5K");
      setFollowing("420");
      setPosts("150");
      setBio("");
      setCategory("Личный блог");
      setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600");
      setLocation("Москва, Россия");
      setEmail("");
      setEngagementRate("3.5%");
    }
    setErrorMsg("");
  }, [editingProfile, isOpen]);

  if (!isOpen) return null;

  // Handle Fetch Profile based on AI API endpoint
  const handleAIFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlOrUsername.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/instagram/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlOrUsername: urlOrUsername.trim() }),
      });

      if (!response.ok) {
        throw new Error("Не удалось получить данные с сервера. Попробуйте еще раз.");
      }

      const data = await response.json();
      
      if (!data || !data.profile) {
        throw new Error("Ошибка в формате ответа сервера.");
      }

      // We got back the generated profile, let's switch tab to verify & save it!
      const fetched: any = data.profile;
      setUsername(fetched.username);
      setFullName(fetched.fullName);
      setFollowers(fetched.followersCount);
      setFollowing(fetched.followingCount);
      setPosts(fetched.postsCount);
      setBio(fetched.bio);
      setCategory(fetched.category);
      setAvatarUrl(fetched.avatarUrl);
      setLocation(fetched.location || "Москва, Россия");
      setEmail(fetched.contactEmail || "");
      setEngagementRate(fetched.engagementRate || "2.8%");
      
      setActiveTab("manual");
      setErrorMsg("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Произошла непредвиденная ошибка при запросе.");
    } finally {
      setLoading(false);
    }
  };

  // Submit profile save
  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !fullName.trim()) {
      setErrorMsg("Имя пользователя и Полное имя обязательны к заполнению");
      return;
    }

    const savedProfile: InstagramProfile = {
      id: editingProfile ? editingProfile.id : `profile_${Date.now()}`,
      username: username.replace(/[@]/g, "").trim(),
      fullName: fullName.trim(),
      followersCount: followers.trim() || "0",
      followingCount: following.trim() || "0",
      postsCount: posts.trim() || "0",
      bio: bio.trim(),
      category: category.trim(),
      avatarUrl: avatarUrl.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
      contactEmail: email.trim() || undefined,
      location: location.trim() || undefined,
      engagementRate: engagementRate.trim() || undefined,
      tags: [],
      notesCount: editingProfile ? editingProfile.notesCount : 0,
      tasksCount: editingProfile ? editingProfile.tasksCount : 0,
      createdAt: editingProfile ? editingProfile.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#15151A] border border-[#2A2A30] rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col transition-all text-[#E0E0E6]">
        {/* MODAL HEADER */}
        <div className="bg-[#1C1C22] text-[#E0E0E6] p-5 flex items-center justify-between border-b border-[#2A2A30]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#4F46E5] rounded-lg">
              <Instagram size={18} />
            </div>
            <h3 className="font-bold text-lg font-display text-white">
              {editingProfile ? "Редактировать аккаунт" : "Добавить аккаунт в базу"}
            </h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#15151A] rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* TABS FOR ADD MODE ONLY */}
        {!editingProfile && (
          <div className="flex border-b border-[#2A2A30] bg-[#121217] font-display">
            <button
              onClick={() => { if (!loading) setActiveTab("ai"); }}
              className={`flex-1 py-3 text-center text-xs font-bold border-r border-[#2A2A30] cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "ai" 
                  ? "bg-[#1C1C22] text-white font-extrabold border-b-2 border-[#4F46E5]" 
                  : "text-slate-400 hover:bg-[#1C1C22]/50"
              }`}
            >
              <Sparkles size={14} className="text-amber-500" />
              Импорт черновика через ИИ
            </button>
            <button
              onClick={() => { if (!loading) setActiveTab("manual"); }}
              className={`flex-1 py-3 text-center text-xs font-bold cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "manual" 
                  ? "bg-[#1C1C22] text-white font-extrabold border-b-2 border-[#4F46E5]" 
                  : "text-slate-400 hover:bg-[#1C1C22]/50"
              }`}
            >
              <Layers size={14} className="text-[#4F46E5]" />
              Заполнить вручную
            </button>
          </div>
        )}

        {/* MODAL CONTENT SCROLL CONTAINER */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#15151A]">
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
              {errorMsg}
            </div>
          )}

          {/* AI FETCH TAB VIEW */}
          {activeTab === "ai" ? (
            <form onSubmit={handleAIFetch} className="space-y-4">
              <div className="p-4 bg-[#1D123B] border border-[#3C2480] rounded-2xl text-[#D2C9F3]">
                <p className="text-xs leading-relaxed font-semibold">
                  🚀 <strong>Умный импорт:</strong> Вставьте ссылку на профиль или просто никнейм инстаграма. Наша нейросеть Gemini проанализирует открытые данные, соберёт актуальную био, подберет качественные иллюстрации и сформирует готовую карточку!
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Ссылка или никнейм
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={urlOrUsername}
                      onChange={(e) => setUrlOrUsername(e.target.value)}
                      placeholder="https://instagram.com/cristiano или @cristiano"
                      className="w-full pl-10 pr-4 py-3 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-[#4F46E5]"
                      disabled={loading}
                      required
                    />
                    <Search className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                  </div>
                  
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer border-none"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Анализ...
                      </span>
                    ) : (
                      <>
                        <Sparkles size={14} className="font-bold text-amber-300" />
                        Анализ
                      </>
                    )}
                  </button>
                </div>
              </div>

              {loading && (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs font-mono font-bold text-indigo-400 animate-pulse">
                    ⚡️ Опрашиваем Gemini AI базы данных...
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    (Это займет около 2-4 секунд. Настраиваем темы картинок, достаем охваты и структурируем био)
                  </p>
                </div>
              )}
            </form>
          ) : (
            /* MANUAL EDIT / REVIEW FORM VIEW */
            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Никнейм @username *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="cristiano"
                    className="w-full px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-[#4F46E5]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Полное Имя / Бренд *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Cristiano Ronaldo"
                    className="w-full px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-[#4F46E5]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Категория аккаунта
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Блогер, Бренд одежды, Ресторан, IT-Блог..."
                  className="w-full px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Подписчики
                  </label>
                  <input
                    type="text"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="50K"
                    className="w-full px-3 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Подписки
                  </label>
                  <input
                    type="text"
                    value={following}
                    onChange={(e) => setFollowing(e.target.value)}
                    placeholder="420"
                    className="w-full px-3 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Посты
                  </label>
                  <input
                    type="text"
                    value={posts}
                    onChange={(e) => setPosts(e.target.value)}
                    placeholder="128"
                    className="w-full px-3 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Ссылка на фото (Avatar)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Описание био (Bio)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Биография профиля, ссылки из описания..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Локация
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Москва, Россия"
                    className="w-full px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Email-контакт
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@cristiano.com"
                    className="w-full px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Вовлеченность ER (%)
                </label>
                <input
                  type="text"
                  value={engagementRate}
                  onChange={(e) => setEngagementRate(e.target.value)}
                  placeholder="3.2%"
                  className="w-full px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] text-white rounded-xl text-sm focus:outline-none"
                />
              </div>

              {/* SAVE FOR ACTIONS */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#2A2A30]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#2A2A30] text-slate-400 text-xs font-bold rounded-xl hover:bg-[#1C1C22] cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} className="stroke-[3]" />
                  Сохранить в базу
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
