import React, { useState, useRef } from "react";
import { InstagramProfile } from "../types";
import { 
  Search, 
  Trash2, 
  Download, 
  Upload, 
  Sparkles, 
  Users, 
  Database,
  Plus,
  FileText,
  CheckSquare,
  Bookmark,
  ExternalLink
} from "lucide-react";

interface SidebarProps {
  profiles: InstagramProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
  onOpenAddModal: () => void;
  onExportDB: () => void;
  onImportDB: (file: File) => void;
}

const getInstagramUrl = (username: string) => {
  const cleanUsername = username.replace(/^@/, "").trim();
  if (cleanUsername.startsWith("http://") || cleanUsername.startsWith("https://")) {
    return cleanUsername;
  }
  return `https://instagram.com/${cleanUsername}`;
};

const getDaysRemaining = (profile: InstagramProfile) => {
  if (!profile.contacted || profile.replied) return "";
  const referenceTime = profile.contactedAt ? new Date(profile.contactedAt) : new Date(profile.updatedAt);
  const diffMs = new Date().getTime() - referenceTime.getTime();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const remainingMs = Math.max(0, sevenDaysInMs - diffMs);
  
  const remainingDays = remainingMs / (1000 * 60 * 60 * 24);
  if (remainingDays <= 1) {
    const hours = Math.round(remainingMs / (1000 * 60 * 60));
    return `${hours}ч`;
  }
  return `${Math.ceil(remainingDays)}д`;
};

export default function Sidebar({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onDeleteProfile,
  onOpenAddModal,
  onExportDB,
  onImportDB
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "no_reply" | "replied" | "agreed">("All");
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtering filter logic
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch = 
      profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.bio && profile.bio.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesCategory = true;
    if (selectedCategory === "no_reply") {
      matchesCategory = !!profile.contacted && !profile.replied;
    } else if (selectedCategory === "replied") {
      matchesCategory = !!profile.replied && !profile.agreed;
    } else if (selectedCategory === "agreed") {
      matchesCategory = !!profile.agreed;
    }

    return matchesSearch && matchesCategory;
  });

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportDB(file);
      // Reset input value to allow importing the same file again
      e.target.value = "";
    }
  };

  return (
    <div className="bg-[#15151A] text-[#E0E0E6] rounded-3xl overflow-hidden p-6 border border-[#2A2A30] shadow-2xl flex flex-col h-full min-h-[500px]">
      
      {/* DB LOGO HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6 shrink-0 border-b border-[#2A2A30] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#4F46E5] rounded-xl border border-[#3F3F46]">
            <Database size={18} className="text-white fill-indigo-200" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-1.5 leading-tight">
              InstaDB 
              <span className="text-[10px] py-0.5 px-1.5 bg-indigo-500/30 text-indigo-300 font-mono rounded">v1.0</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wider">База инфлюенсеров</p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="p-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl border border-transparent flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Добавить новый аккаунт"
        >
          <Plus size={16} className="stroke-[3]" />
        </button>
      </div>

      {/* SEARCH CARD INPUT */}
      <div className="relative mb-4 shrink-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по имени, нику, био..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
        />
        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
      </div>

      {/* CONTEXTUAL WATERFALL FUNNEL CATEGORIES */}
      <div className="flex gap-1.5 overflow-x-auto pb-4 mb-4 select-none shrink-0 border-b border-[#2A2A30] scrollbar-none">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold text-[10px] rounded-lg transition-all whitespace-nowrap cursor-pointer border ${
            selectedCategory === "All"
              ? "bg-[#4F46E5] text-white border-[#4F46E5]"
              : "bg-[#1C1C22] text-[#A1A1AA] hover:text-white hover:bg-[#25252E] border-[#2A2A30]"
          }`}
        >
          <span>Все ({profiles.length})</span>
        </button>

        <button
          onClick={() => setSelectedCategory("no_reply")}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold text-[10px] rounded-lg transition-all whitespace-nowrap cursor-pointer border ${
            selectedCategory === "no_reply"
              ? "bg-rose-950/40 text-rose-300 border-rose-500/20 shadow-[0_2px_8px_rgba(244,63,94,0.08)]"
              : "bg-[#1C1C22] text-[#A1A1AA] hover:text-white hover:bg-[#25252E] border-[#2A2A30]"
          }`}
          title="Написали, но ответа нет. Будут стерты через 7 дней."
        >
          <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
          <span>Не ответили ({profiles.filter(p => p.contacted && !p.replied).length})</span>
        </button>

        <button
          onClick={() => setSelectedCategory("replied")}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold text-[10px] rounded-lg transition-all whitespace-nowrap cursor-pointer border ${
            selectedCategory === "replied"
              ? "bg-purple-950/40 text-purple-300 border-purple-500/20"
              : "bg-[#1C1C22] text-[#A1A1AA] hover:text-white hover:bg-[#25252E] border-[#2A2A30]"
          }`}
        >
          <span className="w-1 h-1 rounded-full bg-purple-500" />
          <span>Ответили ({profiles.filter(p => p.replied && !p.agreed).length})</span>
        </button>

        <button
          onClick={() => setSelectedCategory("agreed")}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold text-[10px] rounded-lg transition-all whitespace-nowrap cursor-pointer border ${
            selectedCategory === "agreed"
              ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/20"
              : "bg-[#1C1C22] text-[#A1A1AA] hover:text-white hover:bg-[#25252E] border-[#2A2A30]"
          }`}
        >
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          <span>Согласилась ({profiles.filter(p => p.agreed).length})</span>
        </button>
      </div>

      {/* DATABASE ACCOUNT LIST CONTAINER */}
      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 pr-1">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-850/40 border border-slate-800 rounded-2xl">
            <Bookmark size={32} className="mx-auto text-slate-700 mb-2" />
            <h5 className="font-bold text-slate-400 text-xs uppercase tracking-wider">База пуста</h5>
            <p className="text-[11px] text-slate-500 mt-1">
              {searchTerm ? "Ничего не найдено по фильтрам." : "Добавьте аккаунт вставив его инстаграм ссылку!"}
            </p>
          </div>
        ) : (
          filteredProfiles.map((profile) => {
            const isSelected = selectedProfileId === profile.id;
            return (
              <div 
                key={profile.id}
                onClick={() => onSelectProfile(profile.id)}
                className={`relative group/row rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected 
                    ? "bg-[#25252E] border-[#3F3F46] text-white shadow-lg"
                    : "bg-[#15151A]/60 hover:bg-[#1C1C22] border-[#2A2A30]/60 hover:border-[#2A2A30] text-[#A1A1AA]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Photo Thumbnail */}
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-[#2A2A30] shrink-0 bg-[#2A2A30]">
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.username} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0">
                    <h4 className={`font-bold text-sm truncate font-display text-white`}>
                      {profile.fullName}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 max-w-full">
                      <p className={`text-xs truncate ${isSelected ? "text-indigo-300 font-semibold" : "text-[#4F46E5] font-medium"}`}>
                        @{profile.username}
                      </p>
                      {profile.contacted && !profile.replied && (
                        <span 
                          className="px-1 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-bold font-mono rounded flex items-center gap-0.5 shrink-0"
                          title="Осталось времени до автоматического удаления аккаунта из базы"
                        >
                          ⌛ {getDaysRemaining(profile)}
                        </span>
                      )}
                      {profile.replied && !profile.agreed && (
                        <span className="px-1 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold font-mono rounded shrink-0">
                          Ответила
                        </span>
                      )}
                      {profile.agreed && (
                        <span className="px-1 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold font-mono rounded shrink-0">
                          🤝 Да
                        </span>
                      )}
                    </div>
                    
                    {/* Metrics indicators */}
                    <div className="flex items-center gap-2.5 mt-1 text-slate-400">
                      <span className="text-[10px] font-bold font-mono flex items-center gap-0.5">
                        <Users size={10} />
                        {profile.followersCount}
                      </span>
                      
                      <span className="text-[10px] font-bold font-mono flex items-center gap-0.5">
                        <FileText size={10} />
                        {profile.notesCount} замя.
                      </span>

                      {profile.tasksCount > 0 && (
                        <span className="text-[10px] font-bold font-mono flex items-center gap-0.5">
                          <CheckSquare size={10} />
                          {profile.tasksCount} зад.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions group */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Visit real profile link */}
                  <a
                    href={getInstagramUrl(profile.username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#1C1C22] border border-[#2A2A30] hover:border-[#4F46E5] hover:text-white shrink-0 transition-colors cursor-pointer text-slate-400"
                    title="Зайти на аккаунт (в новой вкладке)"
                  >
                    <ExternalLink size={13} />
                  </a>

                  {/* Delete Button with inline confirmation */}
                  {deletingProfileId === profile.id ? (
                    <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 p-1 rounded-xl">
                      <button
                        onClick={() => {
                          onDeleteProfile(profile.id);
                          setDeletingProfileId(null);
                        }}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Да
                      </button>
                      <button
                        onClick={() => setDeletingProfileId(null)}
                        className="px-2 py-1 bg-[#1C1C22] hover:bg-[#25252E] text-[#A1A1AA] hover:text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer border border-[#2A2A30]"
                      >
                        Нет
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingProfileId(profile.id)}
                      className="p-2 rounded-lg bg-[#1C1C22] border border-[#2A2A30] hover:border-rose-500 hover:text-rose-500 shrink-0 transition-colors cursor-pointer text-slate-550"
                      title="Удалить из базы"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EXPORT IMPORT FILE ACTIONS BAR */}
      <div className="grid grid-cols-2 gap-2.5 pt-5 border-t border-[#2A2A30] mt-4 shrink-0">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          className="hidden" 
        />
        
        <button
          onClick={handleImportClick}
          className="px-3 py-2.5 bg-[#1C1C22] hover:bg-[#25252E] border border-[#2A2A30] rounded-xl text-xs font-bold font-mono text-[#A1A1AA] hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
          title="Загрузить резервную копию базы"
        >
          <Upload size={14} />
          Импорт JSON
        </button>

        <button
          onClick={onExportDB}
          className="px-3 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors"
          title="Скачать все аккаунты и заметки"
        >
          <Download size={14} />
          Экспорт JSON
        </button>
      </div>

    </div>
  );
}
