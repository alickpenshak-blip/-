import React, { useState, useEffect } from "react";
import { 
  InstagramProfile, 
  AccountNote, 
  AccountTask 
} from "./types";
import Sidebar from "./components/Sidebar";
import InstagramCard from "./components/InstagramCard";
import NotesSection from "./components/NotesSection";
import AccountEditor from "./components/AccountEditor";
import { 
  Sparkles, 
  Plus, 
  Bookmark, 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  Smile, 
  Zap,
  Info
} from "lucide-react";

// Pre-populated high-quality initial data so the database is rich out-of-the-box
const INITIAL_PROFILES: InstagramProfile[] = [
  {
    id: "profile_ronaldo",
    username: "cristiano",
    fullName: "Cristiano Ronaldo",
    followersCount: "631M",
    followingCount: "586",
    postsCount: "3,695",
    bio: "Join my CR7 list. Professional football player, entrepreneur, and global icon. ⚽️✨\n\nBusiness inquiries: contact@cristianoronaldo.com",
    category: "Спортсмен / Бизнес",
    avatarUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    location: "Мадрид / Эр-Рияд",
    contactEmail: "contact@cristianoronaldo.com",
    engagementRate: "2.4%",
    tags: ["Спорт", "Амбассадор", "Звезда"],
    notesCount: 2,
    tasksCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "profile_selena",
    username: "selenagomez",
    fullName: "Selena Gomez",
    followersCount: "429M",
    followingCount: "280",
    postsCount: "1,980",
    bio: "Founder of @rarebeauty 💄\nKindness is everything. Watch My Mind & Me on Apple TV+.\n\nRare Beauty Community 🌸",
    category: "Блогер / Косметика",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    location: "Лос-Анджелес, США",
    contactEmail: "info@rarebeauty.com",
    engagementRate: "3.1%",
    tags: ["Красота", "Тренды", "Инфлюенсер"],
    notesCount: 1,
    tasksCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "profile_techcrunch",
    username: "techcrunch",
    fullName: "TechCrunch",
    followersCount: "1.5M",
    followingCount: "852",
    postsCount: "12,400",
    bio: "Technology news and analysis with a focus on founders and startup teams. 🚀🖥️\n\nSubmit your startup pitch to startup@techcrunch.com",
    category: "Техноблог / IT",
    avatarUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop",
    location: "Кремниевая долина, США",
    contactEmail: "tips@techcrunch.com",
    engagementRate: "1.1%",
    tags: ["Медиа", "Стартапы", "Бизнес"],
    notesCount: 1,
    tasksCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_NOTES: AccountNote[] = [
  {
    id: "note_1",
    accountId: "profile_ronaldo",
    title: "Идея рекламы бренда спортивного питания",
    content: "Предложить совместный пост или спонсорскую сторис с презентацией новой линейки протеина. Роналду делает фокус на дисциплине и преданности своему делу. Ценовой сегмент крайне высокий, нужен крупный бюджет.",
    category: "Strategy",
    priority: "high",
    updatedAt: new Date().toISOString()
  },
  {
    id: "note_2",
    accountId: "profile_ronaldo",
    title: "Контакты его менеджера",
    content: "Связаться через официальный офис в Лиссабоне. Email-ответ поступает в течение 10 рабочих дней. Работают только со 100% предоплатой через официальные агентские договора.",
    category: "Contract",
    priority: "medium",
    updatedAt: new Date().toISOString()
  },
  {
    id: "note_3",
    accountId: "profile_selena",
    title: "Запуск коллаборации с Rare Beauty",
    content: "Рассмотреть интеграцию косметического бренда в СНГ регионе. Нужен полный обзор палеток румян от бьюти-инфлюенсеров с общим охватом от 10 млн человек.",
    category: "Sponsorship",
    priority: "medium",
    updatedAt: new Date().toISOString()
  },
  {
    id: "note_4",
    accountId: "profile_techcrunch",
    title: "Питч нашего стартапа",
    content: "Подготовить презентацию на 5 слайдов и отправить Алану на почту. Фокус на уникальности технологии искусственного интеллекта и темпах роста за последний квартал.",
    category: "Content Idea",
    priority: "high",
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_TASKS: AccountTask[] = [
  {
    id: "task_1",
    accountId: "profile_ronaldo",
    text: "Запросить медиакит и стоимость одного рекламного поста у агента Роналду",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "task_2",
    accountId: "profile_selena",
    text: "Проверить статистику вовлеченности (engagement rate) Rare Beauty в Instagram за май",
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "task_3",
    accountId: "profile_selena",
    text: "Отправить коммерческое предложение маркетологу Rare Beauty",
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [profiles, setProfiles] = useState<InstagramProfile[]>([]);
  const [notes, setNotes] = useState<AccountNote[]>([]);
  const [tasks, setTasks] = useState<AccountTask[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<InstagramProfile | null>(null);

  // Tracks if the automatic 7-day cleanup has executed on launch
  const [isInitialCleanupDone, setIsInitialCleanupDone] = useState(false);

  // Automatic cleanup of unresponsive profiles (contacted 7+ days ago with no reply)
  useEffect(() => {
    if (profiles.length === 0 || isInitialCleanupDone) return;

    const now = new Date();
    // 7 days in milliseconds
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    
    const profilesToDelete = profiles.filter(p => {
      if (p.contacted && !p.replied) {
        // Fallback to p.updatedAt if contactedAt is not set, to clean up legacy data retrospectively
        const referenceTime = p.contactedAt ? new Date(p.contactedAt) : new Date(p.updatedAt);
        const diffMs = now.getTime() - referenceTime.getTime();
        return diffMs >= sevenDaysInMs;
      }
      return false;
    });

    if (profilesToDelete.length > 0) {
      const deleteIds = new Set(profilesToDelete.map(p => p.id));
      const updatedProfiles = profiles.filter(p => !deleteIds.has(p.id));
      const updatedNotes = notes.filter(n => !deleteIds.has(n.accountId));
      const updatedTasks = tasks.filter(t => !deleteIds.has(t.accountId));

      setProfiles(updatedProfiles);
      setNotes(updatedNotes);
      setTasks(updatedTasks);

      localStorage.setItem("instadb_profiles", JSON.stringify(updatedProfiles));
      localStorage.setItem("instadb_notes", JSON.stringify(updatedNotes));
      localStorage.setItem("instadb_tasks", JSON.stringify(updatedTasks));

      const deletedList = profilesToDelete.map(p => `@${p.username}`).join(", ");
      alert(`Автоматическая очистка:\nСледующие аккаунты не ответили в течение 7 дней и были автоматически удалены из базы согласно правилам воронки:\n${deletedList}`);
      
      if (selectedProfileId && deleteIds.has(selectedProfileId)) {
        setSelectedProfileId(updatedProfiles.length > 0 ? updatedProfiles[0].id : null);
      }
    }
    setIsInitialCleanupDone(true);
  }, [profiles, notes, tasks, isInitialCleanupDone, selectedProfileId]);

  // Load database from localStorage or seed initial data
  useEffect(() => {
    const cachedProfiles = localStorage.getItem("instadb_profiles");
    const cachedNotes = localStorage.getItem("instadb_notes");
    const cachedTasks = localStorage.getItem("instadb_tasks");

    if (cachedProfiles && cachedNotes && cachedTasks) {
      try {
        setProfiles(JSON.parse(cachedProfiles));
        setNotes(JSON.parse(cachedNotes));
        setTasks(JSON.parse(cachedTasks));
      } catch (err) {
        console.error("Error reading localStorage cache. Recalibrating...", err);
        setProfiles(INITIAL_PROFILES);
        setNotes(INITIAL_NOTES);
        setTasks(INITIAL_TASKS);
      }
    } else {
      setProfiles(INITIAL_PROFILES);
      setNotes(INITIAL_NOTES);
      setTasks(INITIAL_TASKS);
    }
  }, []);

  // Save changes to localStorage on any state change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem("instadb_profiles", JSON.stringify(profiles));
    }
  }, [profiles]);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("instadb_notes", JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("instadb_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Handle selected Profile fallback
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfileId) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  // Sync profile counters
  const syncProfileCounters = (
    profileId: string, 
    currentNotes: AccountNote[], 
    currentTasks: AccountTask[]
  ) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return {
          ...p,
          notesCount: currentNotes.filter(n => n.accountId === profileId).length,
          tasksCount: currentTasks.filter(t => t.accountId === profileId && !t.completed).length,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const handleSelectProfile = (id: string) => {
    setSelectedProfileId(id);
  };

  const handleDeleteProfile = (id: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== id);
    const updatedNotes = notes.filter(n => n.accountId !== id);
    const updatedTasks = tasks.filter(t => t.accountId !== id);

    setProfiles(updatedProfiles);
    setNotes(updatedNotes);
    setTasks(updatedTasks);

    // Update in localStorage immediately to prevent stale states
    localStorage.setItem("instadb_profiles", JSON.stringify(updatedProfiles));
    localStorage.setItem("instadb_notes", JSON.stringify(updatedNotes));
    localStorage.setItem("instadb_tasks", JSON.stringify(updatedTasks));

    if (selectedProfileId === id) {
      setSelectedProfileId(updatedProfiles.length > 0 ? updatedProfiles[0].id : null);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = () => {
    const profile = profiles.find(p => p.id === selectedProfileId);
    if (profile) {
      setEditingProfile(profile);
      setIsEditorOpen(true);
    }
  };

  const handleSaveProfile = (profile: InstagramProfile) => {
    let updatedProfiles;
    
    if (editingProfile) {
      // Edit Mode
      updatedProfiles = profiles.map(p => p.id === profile.id ? profile : p);
    } else {
      // Add Mode
      updatedProfiles = [profile, ...profiles];
      setSelectedProfileId(profile.id);
    }

    setProfiles(updatedProfiles);
  };

  const handleUpdateProfileFunnel = (
    profileId: string, 
    funnel: { contacted: boolean; replied: boolean; agreed: boolean }
  ) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        // Record precise timestamp when status becomes contacted
        let contactedAt = p.contactedAt;
        if (funnel.contacted && !p.contacted) {
          contactedAt = new Date().toISOString();
        } else if (!funnel.contacted) {
          contactedAt = undefined;
        }

        return {
          ...p,
          ...funnel,
          contactedAt,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Notes operations
  const handleAddNote = (noteData: Omit<AccountNote, "id" | "updatedAt">) => {
    const newNote: AccountNote = {
      ...noteData,
      id: `note_${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    syncProfileCounters(noteData.accountId, updatedNotes, tasks);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    if (selectedProfileId) {
      syncProfileCounters(selectedProfileId, updatedNotes, tasks);
    }
  };

  // Tasks operations
  const handleAddTask = (taskText: string) => {
    if (!selectedProfileId) return;

    const newTask: AccountTask = {
      id: `task_${Date.now()}`,
      accountId: selectedProfileId,
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    syncProfileCounters(selectedProfileId, notes, updatedTasks);
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    if (selectedProfileId) {
      syncProfileCounters(selectedProfileId, notes, updatedTasks);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    if (selectedProfileId) {
      syncProfileCounters(selectedProfileId, notes, updatedTasks);
    }
  };

  // Native Database Backup / Exporter utilities
  const handleExportDB = () => {
    const fullDatabaseBackup = {
      profiles,
      notes,
      tasks,
      version: "1.0",
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDatabaseBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `instadb_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportDB = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const backup = JSON.parse(json);
        
        if (backup.profiles && backup.notes && backup.tasks) {
          setProfiles(backup.profiles);
          setNotes(backup.notes);
          setTasks(backup.tasks);
          
          if (backup.profiles.length > 0) {
            setSelectedProfileId(backup.profiles[0].id);
          }
          alert("База данных успешно импортирована из файла резервной копии!");
        } else {
          alert("Неверный формат файла бекапа. Не найдены обязательные сегменты таблицы.");
        }
      } catch (err) {
        console.error("Failed to parse imported json file:", err);
        alert("Произошла ошибка при парсинге JSON файла. Убедитесь, что файл не поврежден.");
      }
    };
    reader.readAsText(file);
  };

  // Find active profile
  const activeProfile = profiles.find(p => p.id === selectedProfileId) || null;
  const activeNotes = notes.filter(n => n.accountId === selectedProfileId);
  const activeTasks = tasks.filter(t => t.accountId === selectedProfileId);

  // Statistics calculation for the header banners
  const totalFollowersCount = () => {
    let totals = 0;
    profiles.forEach(p => {
      const numStr = p.followersCount.toLowerCase();
      if (numStr.includes("m")) totals += parseFloat(numStr) * 1000000;
      else if (numStr.includes("k")) totals += parseFloat(numStr) * 1000;
      else totals += parseFloat(numStr) || 0;
    });
    
    if (totals >= 1000000000) return (totals / 1000000000).toFixed(1) + "B";
    if (totals >= 1000000) return (totals / 1000000).toFixed(1) + "M";
    if (totals >= 1000) return (totals / 1000).toFixed(1) + "K";
    return totals.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#0F0F12] flex flex-col font-sans text-[#E0E0E6]">
      
      {/* 
        GORGEOUS APP HERO HEADER BOARD 
        Presents a high impact title bar with statistical counters of the database
      */}
      <header className="bg-[#15151A] border-b border-[#2A2A30] px-6 py-4 shrink-0 shadow-lg sticky top-0 z-40 text-[#E0E0E6]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#4F46E5] rounded-2xl border border-[#2A2A30]">
              <Sparkles size={20} className="text-white fill-amber-200" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                База Instagram Аккаунтов & Заметок
              </h1>
              <p className="text-xs text-[#A1A1AA] font-semibold tracking-wider flex items-center gap-1.5 uppercase">
                <Smile size={12} className="text-slate-500" />
                Специализированная offline-первые CRM для работы с блогерами
              </p>
            </div>
          </div>

          {/* Quick Metrics Dashboard Banner counters */}
          <div className="flex gap-4 self-stretch md:self-auto overflow-x-auto py-1 scrollbar-none select-none">
            
            <div className="px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl flex items-center gap-3">
              <div className="p-1 px-1.5 bg-[#25252E] text-indigo-400 border border-[#3F3F46] rounded-lg text-xs font-bold font-mono">
                {profiles.length}
              </div>
              <div>
                <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Блогеры</div>
                <div className="text-xs font-extrabold text-slate-300 font-display">в базе</div>
              </div>
            </div>

            <div className="px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl flex items-center gap-3">
              <div className="p-1 px-1.5 bg-[#25252E] text-amber-400 border border-[#3F3F46] rounded-lg text-xs font-bold font-mono">
                {notes.length}
              </div>
              <div>
                <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Заметки</div>
                <div className="text-xs font-extrabold text-slate-300 font-display">контракты</div>
              </div>
            </div>

            <div className="px-4 py-2 bg-[#1C1C22] border border-[#2A2A30] rounded-xl flex items-center gap-3 hidden sm:flex">
              <div className="p-1 px-1.5 bg-[#25252E] text-rose-400 border border-[#3F3F46] rounded-lg text-xs font-bold font-mono">
                {totalFollowersCount()}
              </div>
              <div>
                <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Охват</div>
                <div className="text-xs font-extrabold text-slate-300 font-display">суммарный</div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN LAYOUT GRID COLUMN */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* SIDEBAR BLOCK (COL 4) */}
        <section id="database-sidebar" className="lg:col-span-4 h-full flex flex-col min-h-0">
          <Sidebar
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelectProfile={handleSelectProfile}
            onDeleteProfile={handleDeleteProfile}
            onOpenAddModal={handleOpenAddModal}
            onExportDB={handleExportDB}
            onImportDB={handleImportDB}
          />
        </section>

        {/* DETAILS GRID VISUAL CARD VIEW (COL 8) */}
        <section id="details-view" className="lg:col-span-8 flex flex-col min-h-0">
          {activeProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start h-full">
              
              {/* INSTAGRAM PORTRAIT/INFO SKETCH CARD DESIGN (COL 5) */}
              <div className="md:col-span-5 h-full flex flex-col min-h-0">
                <InstagramCard
                  profile={activeProfile}
                  onEdit={handleOpenEditModal}
                  onDeleteProfile={handleDeleteProfile}
                />
              </div>

              {/* CRM SCRATCHPAD NOTES & ACTION ITEMS (COL 7) */}
              <div className="md:col-span-7 h-full flex flex-col min-h-0">
                <NotesSection
                  accountId={activeProfile.id}
                  profile={activeProfile}
                  notes={activeNotes}
                  tasks={activeTasks}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onUpdateProfileFunnel={handleUpdateProfileFunnel}
                />
              </div>

            </div>
          ) : (
            /* EMPTY PLACEHOLDER IN BASE SCREEN */
            <div className="flex-1 bg-[#15151A] border border-[#2A2A30] rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-2xl select-none">
              <div className="p-4 bg-[#1C1C22] border border-[#2A2A30] rounded-2xl mb-4 text-[#4F46E5]">
                <Bookmark size={48} className="fill-[#1C1C22]" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Нет выбранного инстаграм аккаунта
              </h3>
              <p className="text-[#A1A1AA] font-semibold text-sm max-w-sm mt-2">
                Пожалуйста, выберите существующий аккаунт из базы в левой панели или импортируйте новый с помощью AI-парсинга по одной ссылке.
              </p>
              
              <button
                onClick={handleOpenAddModal}
                className="mt-6 px-5 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={16} />
                Добавить первый аккаунт
              </button>
            </div>
          )}
        </section>

      </main>

      {/* ACCOUNT IMPORT AND MODIFY modal */}
      <AccountEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        editingProfile={editingProfile}
        onSave={handleSaveProfile}
      />
      
      {/* COMPACT FOOTER info */}
      <footer className="bg-slate-900 border-t-2 border-slate-950 py-4 px-6 text-center text-xs font-bold font-mono text-slate-500 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Сделано с заботой о красивом UX • © 2026 InstaDB</span>
          <span className="flex items-center gap-1.5 text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
            <Info size={12} />
            Для импорта используется Gemini 3.5 Flash с умным подбором контента
          </span>
        </div>
      </footer>

    </div>
  );
}
