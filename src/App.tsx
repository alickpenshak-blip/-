import React, { useState, useEffect, useCallback } from "react";
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
  Smile,
  Info
} from "lucide-react";
import { supabase } from "./lib/supabase";

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

// Map InstagramProfile (camelCase) to DB row (snake_case)
function profileToRow(p: InstagramProfile) {
  return {
    id: p.id,
    username: p.username,
    full_name: p.fullName,
    followers_count: p.followersCount,
    following_count: p.followingCount,
    posts_count: p.postsCount,
    bio: p.bio,
    category: p.category,
    avatar_url: p.avatarUrl,
    contact_email: p.contactEmail ?? null,
    location: p.location ?? null,
    engagement_rate: p.engagementRate ?? null,
    tags: p.tags,
    notes_count: p.notesCount,
    tasks_count: p.tasksCount,
    contacted: p.contacted ?? false,
    replied: p.replied ?? false,
    agreed: p.agreed ?? false,
    contacted_at: p.contactedAt ?? null,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

function rowToProfile(row: any): InstagramProfile {
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    followersCount: row.followers_count,
    followingCount: row.following_count,
    postsCount: row.posts_count,
    bio: row.bio,
    category: row.category,
    avatarUrl: row.avatar_url,
    contactEmail: row.contact_email ?? undefined,
    location: row.location ?? undefined,
    engagementRate: row.engagement_rate ?? undefined,
    tags: row.tags ?? [],
    notesCount: row.notes_count,
    tasksCount: row.tasks_count,
    contacted: row.contacted,
    replied: row.replied,
    agreed: row.agreed,
    contactedAt: row.contacted_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function noteToRow(n: AccountNote) {
  return {
    id: n.id,
    account_id: n.accountId,
    title: n.title,
    content: n.content,
    category: n.category,
    priority: n.priority,
    updated_at: n.updatedAt,
  };
}

function rowToNote(row: any): AccountNote {
  return {
    id: row.id,
    accountId: row.account_id,
    title: row.title,
    content: row.content,
    category: row.category,
    priority: row.priority,
    updatedAt: row.updated_at,
  };
}

function taskToRow(t: AccountTask) {
  return {
    id: t.id,
    account_id: t.accountId,
    text: t.text,
    completed: t.completed,
    created_at: t.createdAt,
  };
}

function rowToTask(row: any): AccountTask {
  return {
    id: row.id,
    accountId: row.account_id,
    text: row.text,
    completed: row.completed,
    createdAt: row.created_at,
  };
}

export default function App() {
  const [profiles, setProfiles] = useState<InstagramProfile[]>([]);
  const [notes, setNotes] = useState<AccountNote[]>([]);
  const [tasks, setTasks] = useState<AccountTask[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<InstagramProfile | null>(null);

  // Load all data from Supabase on mount and seed if empty
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [
        { data: profileRows, error: profileErr },
        { data: noteRows, error: noteErr },
        { data: taskRows, error: taskErr },
      ] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: true }),
        supabase.from("notes").select("*").order("updated_at", { ascending: false }),
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      ]);

      if (profileErr || noteErr || taskErr) {
        console.error("DB load error:", profileErr || noteErr || taskErr);
        setLoading(false);
        return;
      }

      const loadedProfiles = (profileRows ?? []).map(rowToProfile);
      const loadedNotes = (noteRows ?? []).map(rowToNote);
      const loadedTasks = (taskRows ?? []).map(rowToTask);

      if (loadedProfiles.length === 0) {
        // Seed initial data
        await Promise.all([
          supabase.from("profiles").insert(INITIAL_PROFILES.map(profileToRow)),
          supabase.from("notes").insert(INITIAL_NOTES.map(noteToRow)),
          supabase.from("tasks").insert(INITIAL_TASKS.map(taskToRow)),
        ]);
        setProfiles(INITIAL_PROFILES);
        setNotes(INITIAL_NOTES);
        setTasks(INITIAL_TASKS);
        setSelectedProfileId(INITIAL_PROFILES[0].id);
      } else {
        setProfiles(loadedProfiles);
        setNotes(loadedNotes);
        setTasks(loadedTasks);
        setSelectedProfileId(loadedProfiles[0].id);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  // Automatic cleanup: profiles contacted 7+ days ago with no reply
  useEffect(() => {
    if (loading || profiles.length === 0) return;

    const now = new Date();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const toDelete = profiles.filter(p => {
      if (p.contacted && !p.replied) {
        const ref = p.contactedAt ? new Date(p.contactedAt) : new Date(p.updatedAt);
        return now.getTime() - ref.getTime() >= sevenDaysMs;
      }
      return false;
    });

    if (toDelete.length === 0) return;

    const deleteIds = new Set(toDelete.map(p => p.id));

    supabase
      .from("profiles")
      .delete()
      .in("id", [...deleteIds])
      .then(({ error }) => {
        if (error) { console.error("Cleanup error:", error); return; }

        setProfiles(prev => {
          const updated = prev.filter(p => !deleteIds.has(p.id));
          if (selectedProfileId && deleteIds.has(selectedProfileId)) {
            setSelectedProfileId(updated.length > 0 ? updated[0].id : null);
          }
          return updated;
        });
        setNotes(prev => prev.filter(n => !deleteIds.has(n.accountId)));
        setTasks(prev => prev.filter(t => !deleteIds.has(t.accountId)));

        const list = toDelete.map(p => `@${p.username}`).join(", ");
        alert(`Автоматическая очистка:\nСледующие аккаунты не ответили в течение 7 дней и были автоматически удалены:\n${list}`);
      });
  }, [loading]);

  const syncProfileCounters = useCallback(async (
    profileId: string,
    currentNotes: AccountNote[],
    currentTasks: AccountTask[]
  ) => {
    const notesCount = currentNotes.filter(n => n.accountId === profileId).length;
    const tasksCount = currentTasks.filter(t => t.accountId === profileId && !t.completed).length;
    const updatedAt = new Date().toISOString();

    setProfiles(prev => prev.map(p =>
      p.id === profileId ? { ...p, notesCount, tasksCount, updatedAt } : p
    ));

    await supabase
      .from("profiles")
      .update({ notes_count: notesCount, tasks_count: tasksCount, updated_at: updatedAt })
      .eq("id", profileId);
  }, []);

  const handleSelectProfile = (id: string) => setSelectedProfileId(id);

  const handleDeleteProfile = async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) { console.error("Delete profile error:", error); return; }

    setProfiles(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (selectedProfileId === id) {
        setSelectedProfileId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
    setNotes(prev => prev.filter(n => n.accountId !== id));
    setTasks(prev => prev.filter(t => t.accountId !== id));
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

  const handleSaveProfile = async (profile: InstagramProfile) => {
    if (editingProfile) {
      const { error } = await supabase
        .from("profiles")
        .update(profileToRow(profile))
        .eq("id", profile.id);
      if (error) { console.error("Update profile error:", error); return; }
      setProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
    } else {
      const { error } = await supabase
        .from("profiles")
        .insert(profileToRow(profile));
      if (error) { console.error("Insert profile error:", error); return; }
      setProfiles(prev => [profile, ...prev]);
      setSelectedProfileId(profile.id);
    }
  };

  const handleUpdateProfileFunnel = (
    profileId: string,
    funnel: { contacted: boolean; replied: boolean; agreed: boolean }
  ) => {
    setProfiles(prev => prev.map(p => {
      if (p.id !== profileId) return p;

      let contactedAt = p.contactedAt;
      if (funnel.contacted && !p.contacted) {
        contactedAt = new Date().toISOString();
      } else if (!funnel.contacted) {
        contactedAt = undefined;
      }

      const updated = {
        ...p,
        ...funnel,
        contactedAt,
        updatedAt: new Date().toISOString(),
      };

      supabase
        .from("profiles")
        .update({
          contacted: updated.contacted,
          replied: updated.replied,
          agreed: updated.agreed,
          contacted_at: updated.contactedAt ?? null,
          updated_at: updated.updatedAt,
        })
        .eq("id", profileId)
        .then(({ error }) => {
          if (error) console.error("Funnel update error:", error);
        });

      return updated;
    }));
  };

  const handleAddNote = async (noteData: Omit<AccountNote, "id" | "updatedAt">) => {
    const newNote: AccountNote = {
      ...noteData,
      id: `note_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };

    const { error } = await supabase.from("notes").insert(noteToRow(newNote));
    if (error) { console.error("Insert note error:", error); return; }

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    await syncProfileCounters(noteData.accountId, updatedNotes, tasks);
  };

  const handleDeleteNote = async (noteId: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    if (error) { console.error("Delete note error:", error); return; }

    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    if (selectedProfileId) {
      await syncProfileCounters(selectedProfileId, updatedNotes, tasks);
    }
  };

  const handleAddTask = async (taskText: string) => {
    if (!selectedProfileId) return;

    const newTask: AccountTask = {
      id: `task_${Date.now()}`,
      accountId: selectedProfileId,
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const { error } = await supabase.from("tasks").insert(taskToRow(newTask));
    if (error) { console.error("Insert task error:", error); return; }

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    await syncProfileCounters(selectedProfileId, notes, updatedTasks);
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    const { error } = await supabase
      .from("tasks")
      .update({ completed: newCompleted })
      .eq("id", taskId);
    if (error) { console.error("Toggle task error:", error); return; }

    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, completed: newCompleted } : t);
    setTasks(updatedTasks);
    if (selectedProfileId) {
      await syncProfileCounters(selectedProfileId, notes, updatedTasks);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) { console.error("Delete task error:", error); return; }

    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    if (selectedProfileId) {
      await syncProfileCounters(selectedProfileId, notes, updatedTasks);
    }
  };

  const handleExportDB = () => {
    const backup = {
      profiles,
      notes,
      tasks,
      version: "2.0",
      exportedAt: new Date().toISOString(),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `instadb_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportDB = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = event.target?.result as string;
        const backup = JSON.parse(json);

        if (!backup.profiles || !backup.notes || !backup.tasks) {
          alert("Неверный формат файла бекапа. Не найдены обязательные сегменты таблицы.");
          return;
        }

        const [{ error: pErr }, { error: nErr }, { error: tErr }] = await Promise.all([
          supabase.from("profiles").upsert(backup.profiles.map(profileToRow)),
          supabase.from("notes").upsert(backup.notes.map(noteToRow)),
          supabase.from("tasks").upsert(backup.tasks.map(taskToRow)),
        ]);

        if (pErr || nErr || tErr) {
          console.error("Import error:", pErr || nErr || tErr);
          alert("Ошибка при сохранении данных в базу.");
          return;
        }

        setProfiles(backup.profiles);
        setNotes(backup.notes);
        setTasks(backup.tasks);
        if (backup.profiles.length > 0) {
          setSelectedProfileId(backup.profiles[0].id);
        }
        alert("База данных успешно импортирована!");
      } catch (err) {
        console.error("Import parse error:", err);
        alert("Произошла ошибка при парсинге JSON файла. Убедитесь, что файл не поврежден.");
      }
    };
    reader.readAsText(file);
  };

  const activeProfile = profiles.find(p => p.id === selectedProfileId) ?? null;
  const activeNotes = notes.filter(n => n.accountId === selectedProfileId);
  const activeTasks = tasks.filter(t => t.accountId === selectedProfileId);

  const totalFollowersCount = () => {
    let total = 0;
    profiles.forEach(p => {
      const s = p.followersCount.toLowerCase();
      if (s.includes("b")) total += parseFloat(s) * 1_000_000_000;
      else if (s.includes("m")) total += parseFloat(s) * 1_000_000;
      else if (s.includes("k")) total += parseFloat(s) * 1_000;
      else total += parseFloat(s) || 0;
    });
    if (total >= 1_000_000_000) return (total / 1_000_000_000).toFixed(1) + "B";
    if (total >= 1_000_000) return (total / 1_000_000).toFixed(1) + "M";
    if (total >= 1_000) return (total / 1_000).toFixed(1) + "K";
    return total.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F12] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#A1A1AA] text-sm font-semibold">Загружаем базу данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F12] flex flex-col font-sans text-[#E0E0E6]">

      <header className="bg-[#15151A] border-b border-[#2A2A30] px-6 py-4 shrink-0 shadow-lg sticky top-0 z-40 text-[#E0E0E6]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#4F46E5] rounded-2xl border border-[#2A2A30]">
              <Sparkles size={20} className="text-white fill-amber-200" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">
                База Instagram Аккаунтов & Заметок
              </h1>
              <p className="text-xs text-[#A1A1AA] font-semibold tracking-wider flex items-center gap-1.5 uppercase">
                <Smile size={12} className="text-slate-500" />
                Специализированная offline-первые CRM для работы с блогерами
              </p>
            </div>
          </div>

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

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

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

        <section id="details-view" className="lg:col-span-8 flex flex-col min-h-0">
          {activeProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start h-full">
              <div className="md:col-span-5 h-full flex flex-col min-h-0">
                <InstagramCard
                  profile={activeProfile}
                  onEdit={handleOpenEditModal}
                  onDeleteProfile={handleDeleteProfile}
                />
              </div>
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

      <AccountEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        editingProfile={editingProfile}
        onSave={handleSaveProfile}
      />

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
