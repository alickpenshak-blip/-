import React, { useState } from "react";
import { AccountNote, AccountTask, InstagramProfile } from "../types";
import { 
  Plus, 
  Trash2, 
  Check, 
  FileText, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Tag, 
  ChevronRight,
  Sparkles
} from "lucide-react";

interface NotesSectionProps {
  accountId: string;
  profile: InstagramProfile;
  notes: AccountNote[];
  tasks: AccountTask[];
  onAddNote: (note: Omit<AccountNote, "id" | "updatedAt">) => void;
  onDeleteNote: (noteId: string) => void;
  onAddTask: (taskText: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateProfileFunnel: (profileId: string, funnel: { contacted: boolean; replied: boolean; agreed: boolean }) => void;
}

export default function NotesSection({
  accountId,
  profile,
  notes,
  tasks,
  onAddNote,
  onDeleteNote,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateProfileFunnel
}: NotesSectionProps) {
  const [activeTab, setActiveTab] = useState<"notes" | "tasks" | "funnel">("notes");
  
  // Note Form State
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState<AccountNote["category"]>("General");
  const [notePriority, setNotePriority] = useState<AccountNote["priority"]>("medium");
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);

  // Task Form State
  const [taskText, setTaskText] = useState("");

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    onAddNote({
      accountId,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      priority: notePriority,
    });

    // Reset Form
    setNoteTitle("");
    setNoteContent("");
    setNoteCategory("General");
    setNotePriority("medium");
    setShowAddNoteForm(false);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    onAddTask(taskText.trim());
    setTaskText("");
  };

  const categoryColors: Record<AccountNote["category"], string> = {
    General: "bg-teal-50 text-teal-800 border-teal-200",
    Strategy: "bg-purple-50 text-purple-800 border-purple-200",
    "Content Idea": "bg-yellow-50 text-yellow-800 border-yellow-200",
    Sponsorship: "bg-blue-50 text-blue-800 border-blue-200",
    Contract: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Personal: "bg-pink-50 text-pink-800 border-pink-200",
  };

  const priorityColors: Record<AccountNote["priority"], { bg: string; text: string; label: string }> = {
    low: { bg: "bg-slate-100", text: "text-slate-600", label: "Низкий" },
    medium: { bg: "bg-amber-100", text: "text-amber-700", label: "Средний" },
    high: { bg: "bg-rose-100", text: "text-rose-700", label: "Высокий" },
  };

  return (
    <div className="bg-[#15151A] border border-[#2A2A30] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[500px]">
      
      {/* HEADER SECTION WITH COMPACT TABS */}
      <div className="bg-[#1C1C22] border-b border-[#2A2A30] p-4 shrink-0 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === "notes"
                ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                : "bg-[#1C1C22] text-[#A1A1AA] hover:bg-[#25252E] hover:text-white border-[#2A2A30]"
            }`}
          >
            <FileText size={14} />
            Заметки ({notes.length})
          </button>
          
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === "tasks"
                ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                : "bg-[#1C1C22] text-[#A1A1AA] hover:bg-[#25252E] hover:text-white border-[#2A2A30]"
            }`}
          >
            <CheckSquare size={14} />
            Задачи ({tasks.filter(t => !t.completed).length})
          </button>

          <button
            onClick={() => setActiveTab("funnel")}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === "funnel"
                ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                : "bg-[#1C1C22] text-[#A1A1AA] hover:bg-[#25252E] hover:text-white border-[#2A2A30]"
            }`}
          >
            <Sparkles size={14} className="text-amber-400" />
            Переговоры ({[profile.contacted, profile.replied, profile.agreed].filter(Boolean).length}/3)
          </button>
        </div>

        {activeTab === "notes" && (
          <button
            onClick={() => setShowAddNoteForm(!showAddNoteForm)}
            className="px-3.5 py-2 bg-[#1C1C22] hover:bg-[#25252E] text-white border border-[#2A2A30] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={14} className="font-bold" />
            {showAddNoteForm ? "Закрыть форму" : "Добавить заметку"}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#15151A]">
        
        {/* ADD NOTE FORM INLINE DIALOG */}
        {activeTab === "notes" && showAddNoteForm && (
          <form 
            onSubmit={handleNoteSubmit}
            className="bg-[#1C1C22] border border-[#2A2A30] p-5 rounded-2xl mb-6 shadow-xl space-y-4"
          >
            <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Новая заметка для аккаунта
            </h4>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Заголовок заметки
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Специфика блога, инфо по интеграции..."
                className="w-full px-4 py-2.5 bg-[#15151A] border border-[#2A2A30] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Категория
                </label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as AccountNote["category"])}
                  className="w-full px-3 py-2 bg-[#15151A] border border-[#2A2A30] rounded-xl text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="General">Общее</option>
                  <option value="Strategy">Стратегия</option>
                  <option value="Content Idea">Идеи для контента</option>
                  <option value="Sponsorship">Спонсорство</option>
                  <option value="Contract">Договор / Расценки</option>
                  <option value="Personal">Личное</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Приоритет
                </label>
                <select
                  value={notePriority}
                  onChange={(e) => setNotePriority(e.target.value as AccountNote["priority"])}
                  className="w-full px-3 py-2 bg-[#15151A] border border-[#2A2A30] rounded-xl text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Текст заметки
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Напишите здесь детали переговоров, условия сотрудничества, цены или персональные комментарии..."
                rows={4}
                className="w-full px-4 py-2.5 bg-[#15151A] border border-[#2A2A30] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddNoteForm(false)}
                className="px-4 py-2 border border-[#2A2A30] text-slate-400 text-xs font-bold rounded-xl hover:bg-[#15151A] cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Сохранить заметку
              </button>
            </div>
          </form>
        )}

        {/* --- NOTES TAB LIST --- */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-12 px-6 border border-dashed border-[#2A2A30] rounded-2xl bg-[#1C1C22]/40 text-slate-400">
                <FileText size={40} className="mx-auto text-slate-600 mb-2" />
                <h5 className="font-bold text-slate-300 text-sm">Заметок пока нет</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Нажмите кнопку «Добавить заметку» вверху, чтобы сохранить важную информацию об аккаунте.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {notes.map((note) => (
                  <div 
                    key={note.id}
                    className="bg-[#1C1C22] border border-[#2A2A30] p-5 rounded-2xl shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2.5">
                        <h4 className="font-bold text-white font-display text-base">
                          {note.title}
                        </h4>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="p-1 px-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                          title="Удалить заметку"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <p className="text-[#E0E0E6] text-sm whitespace-pre-wrap leading-relaxed mb-4">
                        {note.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#2A2A30]/80">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1 ${categoryColors[note.category]}`}>
                          <Tag size={10} />
                          {note.category === "General" ? "Общее" :
                           note.category === "Strategy" ? "Стратегия" :
                           note.category === "Content Idea" ? "Идея" :
                           note.category === "Sponsorship" ? "Спонсорство" :
                           note.category === "Contract" ? "Контракт" : "Личное"}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${priorityColors[note.priority].bg} ${priorityColors[note.priority].text}`}>
                          <AlertCircle size={10} />
                          {priorityColors[note.priority].label}
                        </span>
                      </div>
                      
                      <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(note.updatedAt).toLocaleDateString()} {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TASKS TAB LIST & FORM --- */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            {/* ADD QUICK TASK INLINE FORM */}
            <form onSubmit={handleTaskSubmit} className="flex gap-2.5">
              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Добавить новую задачу... (например, 'Запросить охваты сторис')"
                className="flex-1 px-4 py-3 bg-[#1C1C22] border border-[#2A2A30] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                required
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Создать
              </button>
            </form>

            {/* TASKS FLOW */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-12 px-6 border border-dashed border-[#2A2A30] rounded-2xl bg-[#1C1C22]/40 text-slate-400">
                  <CheckSquare size={40} className="mx-auto text-slate-600 mb-2" />
                  <h5 className="font-bold text-slate-300 text-sm">Список задач пуст</h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Вы можете записать шаги для работы с этим инфлюенсером (например: написать в директ, согласовать ТЗ, проверить ссылку).
                  </p>
                </div>
              ) : (
                <div className="bg-[#1C1C22] border border-[#2A2A30] rounded-2xl overflow-hidden divide-y divide-[#2A2A30]/80 shadow-md">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                        task.completed ? "bg-[#15151A]/60 text-slate-500" : "bg-[#1C1C22] text-[#E0E0E6] hover:bg-[#25252E]/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className={`w-5 h-5 border rounded-md flex items-center justify-center transition-all cursor-pointer ${
                            task.completed 
                              ? "bg-[#4F46E5] border-[#4F46E5] text-white" 
                              : "border-[#2A2A30] bg-[#15151A] hover:border-[#4F46E5]"
                          }`}
                        >
                          {task.completed && <Check size={14} className="stroke-[3]" />}
                        </button>
                        
                        <span className={`text-sm font-semibold truncate ${
                          task.completed 
                            ? "text-slate-500 line-through font-medium" 
                            : "text-[#E0E0E6]"
                        }`}>
                          {task.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                          title="Удалить задачу"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FUNNEL STAGES TAB */}
        {activeTab === "funnel" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header / Intro */}
            <div className="p-5 bg-[#1C1C22] border border-[#2A2A30]/80 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400 fill-amber-400/20" />
                Этапы воронки переговоров
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Отслеживайте прогресс общения с блогером <b>@{profile.username}</b>. Отмечайте пройденные этапы чек-листа по мере продвижения диалога.
              </p>

              {/* Progress Line HUD */}
              <div className="mt-6 px-4">
                <div className="relative flex items-center justify-between">
                  {/* Background track line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#22222A] z-0 rounded-full" />
                  
                  {/* Active highlight fill */}
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 z-0 rounded-full transition-all duration-500" 
                    style={{
                      width: profile.agreed ? "100%" : profile.replied ? "50%" : profile.contacted ? "0%" : "0%"
                    }}
                  />

                  {/* Node 1 */}
                  <div className="z-10 flex flex-col items-center">
                    <div 
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        profile.contacted 
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(79,70,229,0.5)]" 
                          : "bg-[#15151A] border-[#2A2A30] text-slate-500"
                      }`}
                    >
                      1
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${profile.contacted ? "text-indigo-400" : "text-slate-500"}`}>Написал</span>
                  </div>

                  {/* Node 2 */}
                  <div className="z-10 flex flex-col items-center">
                    <div 
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        profile.replied 
                          ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]" 
                          : "bg-[#15151A] border-[#2A2A30] text-slate-500"
                      }`}
                    >
                      2
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${profile.replied ? "text-purple-400" : "text-slate-500"}`}>Ответила</span>
                  </div>

                  {/* Node 3 */}
                  <div className="z-10 flex flex-col items-center">
                    <div 
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        profile.agreed 
                          ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]" 
                          : "bg-[#15151A] border-[#2A2A30] text-slate-500"
                      }`}
                    >
                      3
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${profile.agreed ? "text-emerald-400" : "text-slate-500"}`}>Согласилась</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist items list */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                Чек-лист переговоров
              </label>

              {/* Item 1: Написал */}
              <div 
                onClick={() => onUpdateProfileFunnel(profile.id, {
                  contacted: !profile.contacted,
                  replied: !!profile.replied,
                  agreed: !!profile.agreed
                })}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                  profile.contacted 
                    ? "bg-indigo-600/10 border-indigo-500/30 text-white hover:bg-indigo-600/15" 
                    : "bg-[#1C1C22]/60 border-[#2A2A30] text-[#A1A1AA] hover:bg-[#1C1C22]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      profile.contacted 
                        ? "bg-indigo-600 border-indigo-400 text-white" 
                        : "border-[#3F3F46] bg-[#15151A]"
                    }`}
                  >
                    {profile.contacted && <Check size={16} className="stroke-[3]" />}
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold ${profile.contacted ? "text-white" : "text-slate-300"}`}>
                      1. Написал
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Отправлено первое сообщение или предложение о сотрудничестве в Direct / Email / Telegram.
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 border transition-all ${
                  profile.contacted 
                    ? "bg-indigo-500/20 border-indigo-500/20 text-indigo-300" 
                    : "bg-slate-800/40 border-transparent text-slate-500"
                }`}>
                  {profile.contacted ? "Выполнено" : "Ожидает"}
                </span>
              </div>

              {/* Item 2: Ответила */}
              <div 
                onClick={() => onUpdateProfileFunnel(profile.id, {
                  contacted: !!profile.contacted,
                  replied: !profile.replied,
                  agreed: !!profile.agreed
                })}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                  profile.replied 
                    ? "bg-purple-600/10 border-purple-500/30 text-white hover:bg-purple-600/15" 
                    : "bg-[#1C1C22]/60 border-[#2A2A30] text-[#A1A1AA] hover:bg-[#1C1C22]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      profile.replied 
                        ? "bg-purple-600 border-purple-400 text-white" 
                        : "border-[#3F3F46] bg-[#15151A]"
                    }`}
                  >
                    {profile.replied && <Check size={16} className="stroke-[3]" />}
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold ${profile.replied ? "text-white" : "text-slate-300"}`}>
                      2. Ответила
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Блогер или менеджер ответили на сообщение, предоставили актуальный прайс и условия.
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 border transition-all ${
                  profile.replied 
                    ? "bg-purple-500/20 border-purple-500/20 text-purple-300" 
                    : "bg-slate-800/40 border-transparent text-slate-500"
                }`}>
                  {profile.replied ? "В процессе" : "Ожидает"}
                </span>
              </div>

              {/* Item 3: Согласилась */}
              <div 
                onClick={() => onUpdateProfileFunnel(profile.id, {
                  contacted: !!profile.contacted,
                  replied: !!profile.replied,
                  agreed: !profile.agreed
                })}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                  profile.agreed 
                    ? "bg-emerald-600/10 border-emerald-500/30 text-white hover:bg-emerald-600/15" 
                    : "bg-[#1C1C22]/60 border-[#2A2A30] text-[#A1A1AA] hover:bg-[#1C1C22]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      profile.agreed 
                        ? "bg-emerald-600 border-emerald-400 text-white" 
                        : "border-[#3F3F46] bg-[#15151A]"
                    }`}
                  >
                    {profile.agreed && <Check size={16} className="stroke-[3]" />}
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold ${profile.agreed ? "text-white" : "text-slate-300"}`}>
                      3. Согласилась
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Сотрудничество утверждено обоюдно, определена дата выхода рекламы или ТЗ.
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 border transition-all ${
                  profile.agreed 
                    ? "bg-emerald-500/20 border-emerald-500/20 text-emerald-300" 
                    : "bg-slate-800/40 border-transparent text-slate-500"
                }`}>
                  {profile.agreed ? "Согласовано" : "Ожидает"}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
