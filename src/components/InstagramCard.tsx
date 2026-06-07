import React, { useState } from "react";
import { 
  InstagramProfile, 
  SharedPost 
} from "../types";
import { 
  Users, 
  UserPlus, 
  Image as ImageIcon, 
  MapPin, 
  Mail, 
  TrendingUp,
  Calendar,
  Layers,
  Heart,
  MessageCircle,
  Edit2,
  Trash2,
  ExternalLink
} from "lucide-react";

interface InstagramCardProps {
  profile: InstagramProfile;
  onEdit: () => void;
  onDeleteProfile: (id: string) => void;
}

const getInstagramUrl = (username: string) => {
  const cleanUsername = username.replace(/^@/, "").trim();
  if (cleanUsername.startsWith("http://") || cleanUsername.startsWith("https://")) {
    return cleanUsername;
  }
  return `https://instagram.com/${cleanUsername}`;
};

export default function InstagramCard({ profile, onEdit, onDeleteProfile }: InstagramCardProps) {
  const [activeTab, setActiveTab] = useState<"info" | "posts">("info");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [lastProfileId, setLastProfileId] = useState(profile.id);

  if (profile.id !== lastProfileId) {
    setLastProfileId(profile.id);
    setShowConfirmDelete(false);
  }

  return (
    <div 
      id={`instagram-card-${profile.id}`}
      className="bg-[#15151A] border border-[#2A2A30] rounded-[32px] overflow-hidden shadow-2xl"
    >
      {/* 
        TOP SECTION: Custom visual photo matching the user sketch.
        We provide a large photo representing the profile picture.
      */}
      <div className="relative h-72 md:h-80 w-full overflow-hidden border-b border-[#2A2A30] bg-[#1C1C22] group">
        <img 
          src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"} 
          alt={profile.fullName} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Neon style gradient cover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="px-3 py-1 bg-[#4F46E5] text-white text-xs font-semibold rounded-full border border-[#3F3F46] tracking-wide uppercase">
                {profile.category || "Lifestyle"}
              </span>
              <h2 className="text-2xl font-bold font-display text-white mt-2 leading-tight drop-shadow-md">
                {profile.fullName}
              </h2>
              <p className="text-indigo-200 text-sm font-semibold tracking-wide flex items-center gap-1 drop-shadow-sm mt-0.5 animate-fade-in">
                @{profile.username}
              </p>
              
              <div className="mt-3 flex items-center">
                <a
                  href={getInstagramUrl(profile.username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_16px_rgba(79,70,229,0.5)] cursor-pointer tracking-wide active:scale-95 border-none"
                  title={`Открыть профиль @${profile.username} в Instagram`}
                >
                  <ExternalLink size={12} className="stroke-[2.5]" />
                  <span>Зайти на аккаунт</span>
                </a>
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0 items-center">
              {showConfirmDelete ? (
                <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 p-1.5 rounded-xl">
                  <span className="text-[10px] text-rose-300 font-bold px-1 select-none">Удалить аккаунт?</span>
                  <button
                    onClick={() => onDeleteProfile(profile.id)}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Да
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-2.5 py-1 bg-[#2A2A30] hover:bg-[#32323A] text-[11px] text-zinc-300 font-semibold rounded-lg transition-colors cursor-pointer border border-[#3F3F46]"
                  >
                    Нет
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={onEdit}
                    className="p-2.5 bg-[#2A2A30] hover:bg-[#32323A] text-white rounded-xl border border-[#3F3F46] transition-colors cursor-pointer"
                    title="Редактировать карточку"
                  >
                    <Edit2 size={16} className="font-bold" />
                  </button>
                  
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="p-2.5 bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-transparent text-rose-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="Удалить карточку из базы"
                  >
                    <Trash2 size={16} className="font-bold" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABS SELECTOR FOR EXTRA INTERACTION */}
      <div className="flex border-b border-[#2A2A30] bg-[#1C1C22] font-display">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-3 text-center text-sm font-bold border-r border-[#2A2A30] transition-colors ${
            activeTab === "info" 
              ? "bg-[#25252E] text-white font-extrabold border-b-2 border-[#4F46E5]" 
              : "text-[#A1A1AA] hover:bg-[#25252E] hover:text-white"
          }`}
        >
          Основная инфо
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 text-center text-sm font-bold transition-colors ${
            activeTab === "posts" 
              ? "bg-[#25252E] text-white font-extrabold border-b-2 border-[#4F46E5]" 
              : "text-[#A1A1AA] hover:bg-[#25252E] hover:text-white"
          }`}
        >
          Примеры постов (AI)
        </button>
      </div>

      {/* 
        BOTTOM SECTION: Detailed Info Below the photo.
        Matches the lines list of statistics and data shown in the user sketch.
      */}
      {activeTab === "info" ? (
        <div className="p-6 space-y-6">
          {/* Key Metrics Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center bg-[#1C1C22] border border-[#2A2A30] p-3 rounded-2xl">
            <div className="border-r border-[#2A2A30] py-1">
              <div className="text-lg font-bold font-display text-white flex justify-center items-center gap-1.5">
                <Users size={16} className="text-[#4F46E5]" />
                {profile.followersCount}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Подписчики</div>
            </div>
            
            <div className="border-r border-[#2A2A30] py-1">
              <div className="text-lg font-bold font-display text-white flex justify-center items-center gap-1.5">
                <UserPlus size={16} className="text-[#4F46E5]" />
                {profile.followingCount}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Подписки</div>
            </div>

            <div className="py-1">
              <div className="text-lg font-bold font-display text-white flex justify-center items-center gap-1.5">
                <ImageIcon size={16} className="text-[#4F46E5]" />
                {profile.postsCount}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Посты</div>
            </div>
          </div>

          {/* BIO DESCRIPTION CARD */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest flex items-center gap-1.5">
              <Layers size={14} />
              Биография / Описание
            </div>
            <div className="bg-[#1C1C22] border border-[#2A2A30] p-4 rounded-2xl text-[#E0E0E6] text-sm whitespace-pre-wrap leading-relaxed">
              {profile.bio || "Описание био отсутствует."}
            </div>
          </div>

          {/* Metadata info rows */}
          <div className="space-y-3 pt-2">
            {profile.location && (
              <div className="flex items-center gap-3 text-[#E0E0E6] bg-[#1C1C22]/60 border border-[#2A2A30]/80 p-2.5 rounded-xl text-sm">
                <div className="p-1.5 bg-[#1C1C22] rounded-lg text-slate-300">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Локация</div>
                  <div className="font-semibold">{profile.location}</div>
                </div>
              </div>
            )}

            {profile.contactEmail && (
              <div className="flex items-center gap-3 text-[#E0E0E6] bg-[#1C1C22]/60 border border-[#2A2A30]/80 p-2.5 rounded-xl text-sm">
                <div className="p-1.5 bg-[#1C1C22] rounded-lg text-slate-300">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Контакты</div>
                  <div className="font-semibold break-all">{profile.contactEmail}</div>
                </div>
              </div>
            )}

            {profile.engagementRate && (
              <div className="flex items-center gap-3 text-[#E0E0E6] bg-[#1C1C22]/60 border border-[#2A2A30]/80 p-2.5 rounded-xl text-sm">
                <div className="p-1.5 bg-[#1C1C22] rounded-lg text-slate-300">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Вовлеченность ER</div>
                  <div className="font-semibold">{profile.engagementRate}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* POSTS TAB - SHOW RECENTS SIMULATED GRAPHICS */
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#4F46E5] flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon size={16} />
              Публикации в ленте
            </h3>
            <span className="text-xs bg-[#1C1C22] border border-[#2A2A30] px-2 py-0.5 rounded-md font-mono text-[#A1A1AA]">
              Generated by AI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Create nice layout for simulated recent posts */}
            {profile.id ? (
              /* Hardcode or get simulated posts inside target profile */
              [1, 2, 3].map((idx) => {
                const imgKey = `post_${idx}`;
                // Select curated post matching our images list
                const postUrl = idx === 1 
                  ? "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=400"
                  : idx === 2
                  ? "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=400"
                  : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400";
                
                return (
                  <div key={idx} className="bg-[#1C1C22] border border-[#2A2A30] rounded-xl overflow-hidden group/post flex flex-col justify-between">
                    <div className="relative aspect-square bg-slate-800 overflow-hidden">
                      <img 
                        src={postUrl} 
                        alt="Пост" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/post:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/post:opacity-100 flex items-center justify-center gap-4 text-white font-bold transition-opacity duration-200">
                        <span className="flex items-center gap-1"><Heart size={16} fill="currentColor" /> {idx * 4 + 1.2}K</span>
                        <span className="flex items-center gap-1"><MessageCircle size={16} fill="currentColor" /> {idx * 12 + 15}</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar size={10} />
                        {idx === 1 ? "1 день назад" : idx === 2 ? "3 дня назад" : "1 неделя назад"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : null}
          </div>

          <div className="mt-4 p-3.5 bg-[#1D123B] border border-[#3C2480] rounded-xl">
            <p className="text-xs text-[#D2C9F3] leading-relaxed font-semibold">
              💡 <strong>Совет аналитика:</strong> Опубликованный контент гармонирует с тематикой <strong>{profile.category}</strong>. Высокие охваты обусловлены регулярным постингом и живым общением с аудиторией в комментариях.
            </p>
          </div>
        </div>
      )}

      {/* CARD FOOTER */}
      <div className="px-6 py-4 border-t border-[#2A2A30] bg-[#1C1C22] text-[10px] font-bold text-slate-400 font-mono flex justify-between items-center">
        <span>ID: {profile.id.substring(0, 8)}</span>
        <span>ОБНОВЛЕН: {new Date(profile.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
