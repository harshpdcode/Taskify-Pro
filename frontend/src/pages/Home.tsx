// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { TaskService } from '../api/task';
import type { Task, ViewMode, TaskStatus, Subtask } from '../types/task';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import KanbanBoard from '../components/KanbanBoard';
import CalendarView from '../components/CalendarView';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import PomodoroTimer from '../components/PomodoroTimer';
import CommandPalette from '../components/CommandPalette';
import { 
  Plus, 
  Filter, 
  ArrowUpDown, 
  CheckCheck, 
  Trash2, 
  Download, 
  Zap,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { toast } from 'react-toastify';
import AsciiGlitchText from '../components/AsciiGlitchText';
import { exportComicReport } from '../utils/exportComicReport';
import { usePwaInstall } from '../hooks/usePwaInstall';
import InstallPwaModal from '../components/InstallPwaModal';
import MobileBottomDock from '../components/MobileBottomDock';

export default function Home() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const { showInstallModal, setShowInstallModal, triggerInstall } = usePwaInstall();

  // App State
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date' | 'priority' | 'title'>('created_at');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  // Responsive: track desktop breakpoint for sidebar offset
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  // Theme with Spider-Verse Multiverse Glitch
  const { toggleTheme } = useTheme();

  // Fetch Tasks with React Query
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', selectedCategory, selectedPriority, selectedStatusFilter, searchQuery, sortBy, sortOrder],
    queryFn: () =>
      TaskService.getAll({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined,
        status: selectedStatusFilter !== 'all' ? selectedStatusFilter : undefined,
        search: searchQuery || undefined,
        sort_by: sortBy,
        order: sortOrder,
      }),
  });

  // Fetch Stats
  const { data: stats } = useQuery({
    queryKey: ['taskStats'],
    queryFn: () => TaskService.getStats(),
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (taskData: Partial<Task>) => TaskService.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      toast.success('Task created! 💥');
    },
    onError: () => toast.error('Failed to create task.'),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Task> }) =>
      TaskService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: (task: Task) => TaskService.toggle(task.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      if (data.task.completed) {
        toast.success(`BOOM! ${data.task.title} Completed! 🎉`);
      }
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => TaskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      toast.info('Task deleted.');
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: ({ action, payload }: { action: string; payload?: any }) =>
      TaskService.bulkAction(action, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      toast.success(data.message || 'Action completed!');
    },
  });

  // Handlers
  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask && editingTask.id !== 0) {
      updateTaskMutation.mutate({ id: editingTask.id, updates: taskData });
    } else {
      createTaskMutation.mutate(taskData);
    }
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleQuickAddForStatus = (status: TaskStatus) => {
    setEditingTask({
      id: 0,
      title: '',
      description: '',
      priority: 2,
      status: status,
      category: 'general',
      subtasks: [],
      estimated_minutes: 25,
      completed: status === 'completed',
      due_date: null,
      completed_at: null,
      created_at: new Date().toISOString(),
    });
    setIsTaskModalOpen(true);
  };

  const handleQuickAddForDate = (dateStr: string) => {
    setEditingTask({
      id: 0,
      title: '',
      description: '',
      priority: 2,
      status: 'todo',
      category: 'general',
      subtasks: [],
      estimated_minutes: 25,
      completed: false,
      due_date: new Date(dateStr).toISOString(),
      completed_at: null,
      created_at: new Date().toISOString(),
    });
    setIsTaskModalOpen(true);
  };

  const handleStartFocus = (task: Task) => {
    setFocusTask(task);
    setCurrentView('pomodoro');
    toast.info(`Focused on "${task.title}" in Pomodoro timer`);
  };

  const handleUpdateSubtasks = (task: Task, subtasks: Subtask[]) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { subtasks },
    });
  };

  const handleExportComicPDF = () => {
    exportComicReport(tasks, user?.username || 'AGENT');
    toast.success('Generating Comic Mission Dossier PDF! 💥');
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed || t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen halftone-bg" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', position: 'relative' }}>
      {/* Top Scroll Progress Indicator */}
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ffe600, #ff007a, #00f0ff, #00ff66)',
          transformOrigin: '0%',
          zIndex: 100,
          borderBottom: '1px solid #000',
        }}
      />

      {/* Main Content Area — Full Screen Width */}
      <div
        className="flex flex-col min-h-screen relative z-10"
        style={{ marginLeft: 0 }}
        id="main-content-area"
      >
        {/* Sticky Header with Integrated Controls & View Switcher */}
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          onOpenQuickAdd={handleOpenNewTask}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          username={user?.username || ''}
          userEmail={user?.email || 'hero@taskify.pro'}
          streakCount={4}
          completedTasksCount={completedTasks}
          totalTasksCount={totalTasks}
          onExport={handleExportComicPDF}
          onLogout={logout}
          onOpenInstallModal={() => setShowInstallModal(true)}
        />

        {/* Dashboard Main Body */}
        <main
          style={{
            flex: 1,
            padding: isDesktop ? '20px 28px 40px' : '10px 10px 96px',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >

          {/* ── Welcome Banner ── */}
          {currentView === 'list' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                borderRadius: isDesktop ? '16px' : '12px',
                padding: isDesktop ? '20px 24px' : '12px 14px',
                marginBottom: isDesktop ? '20px' : '12px',
                background: 'var(--bg-card)',
                border: '3px solid #000000',
                boxShadow: isDesktop ? '5px 5px 0px #000000' : '3px 3px 0px #000000',
                display: 'flex',
                flexDirection: isDesktop ? 'row' : 'column',
                alignItems: isDesktop ? 'center' : 'flex-start',
                justifyContent: 'space-between',
                gap: isDesktop ? '16px' : '10px',
                position: 'relative',
              }}
            >
              <div>
                <div
                  className="comic-badge comic-badge-rotate-left"
                  style={{
                    background: '#ffe600',
                    color: '#000000',
                    marginBottom: '6px',
                    fontSize: isDesktop ? '11px' : '9px',
                    padding: isDesktop ? '4px 10px' : '3px 8px',
                  }}
                >
                  <Zap size={isDesktop ? 13 : 11} fill="#000" />
                  <span><AsciiGlitchText text="DAILY MISSION OVERVIEW" /></span>
                </div>
                <h1
                  style={{
                    fontWeight: 900,
                    fontSize: isDesktop ? '24px' : '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.3px',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  <AsciiGlitchText text="READY FOR ACTION," /> <span style={{ color: '#ff007a' }}><AsciiGlitchText text={user?.username || 'CHAMPION'} /></span>!
                </h1>
                {isDesktop && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>
                    You have <strong style={{ color: '#0066ff' }}>{pendingTasks}</strong> tasks on your radar today. Crush them one by one!
                  </p>
                )}
              </div>

              {/* Quick KPI Stat Capsules */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isDesktop ? '12px' : '6px',
                  width: isDesktop ? 'auto' : '100%',
                  justifyContent: isDesktop ? 'flex-end' : 'space-between',
                }}
              >
                {[
                  { label: 'TOTAL', value: totalTasks, color: '#000000', bg: '#ffffff' },
                  { label: 'DONE', value: completedTasks, color: '#000000', bg: '#00ff66' },
                  { label: 'PENDING', value: pendingTasks, color: '#ffffff', bg: '#ff007a' },
                ].map((s) => (
                  <motion.div
                    key={s.label}
                    whileHover={{ scale: 1.04 }}
                    style={{
                      flex: isDesktop ? 'none' : 1,
                      padding: isDesktop ? '8px 16px' : '6px 10px',
                      borderRadius: '10px',
                      background: s.bg,
                      color: s.color,
                      border: '2px solid #000000',
                      boxShadow: '2px 2px 0px #000000',
                      textAlign: 'center',
                      minWidth: isDesktop ? '70px' : '0',
                    }}
                  >
                    <div style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.8px', marginBottom: '1px' }}>
                      <AsciiGlitchText text={s.label} />
                    </div>
                    <div style={{ fontSize: isDesktop ? '20px' : '16px', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>
                      <AsciiGlitchText text={String(s.value)} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Multiverse Category Filter Ribbon ── */}
          {(currentView === 'list' || currentView === 'kanban') && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                paddingBottom: '4px',
                marginBottom: isDesktop ? '14px' : '10px',
              }}
            >
              {[
                { id: 'all', label: 'ALL MISSIONS', icon: '🌟', color: '#ffe600' },
                { id: 'work', label: 'WORK & OPS', icon: '💼', color: '#00f0ff' },
                { id: 'personal', label: 'PERSONAL', icon: '🏠', color: '#ff007a' },
                { id: 'learning', label: 'LEARNING', icon: '📚', color: '#00ff66' },
                { id: 'finance', label: 'FINANCE', icon: '💰', color: '#ffe600' },
                { id: 'health', label: 'HEALTH', icon: '⚡', color: '#00f0ff' },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const catCount = cat.id === 'all' 
                  ? tasks.length 
                  : tasks.filter(t => t.category === cat.id).length;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ scale: 1.03 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: isDesktop ? '7px 14px' : '6px 11px',
                      borderRadius: '12px',
                      fontSize: isDesktop ? '11px' : '10px',
                      fontWeight: 900,
                      letterSpacing: '0.4px',
                      border: isSelected ? '2px solid #000000' : '2px solid transparent',
                      background: isSelected ? cat.color : 'var(--bg-card)',
                      color: isSelected ? '#000000' : 'var(--text-secondary)',
                      boxShadow: isSelected ? '3px 3px 0px #000000' : '1px 1px 0px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span
                      style={{
                        padding: '1px 5px',
                        borderRadius: '5px',
                        background: isSelected ? '#000000' : 'var(--bg-input)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '9px',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                      }}
                    >
                      {catCount}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ── View Content ── */}
          <AnimatePresence mode="wait">
            {currentView === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: isDesktop ? '18px' : '12px' }}
              >
                {/* ── Streamlined Filter & Sort Bar (Horizontal Scrollable on Mobile) ── */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isDesktop ? 'space-between' : 'flex-start',
                    gap: '8px',
                    padding: isDesktop ? '12px 16px' : '8px 10px',
                    borderRadius: '12px',
                    background: 'var(--bg-card)',
                    border: '3px solid #000000',
                    boxShadow: isDesktop ? '4px 4px 0px #000000' : '2px 2px 0px #000000',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'none',
                  }}
                >
                  {/* Status Tabs */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {(['all', 'pending', 'completed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatusFilter(status)}
                        className={`comic-btn ${selectedStatusFilter === status ? 'comic-btn-yellow' : 'comic-btn-white'}`}
                        style={{
                          padding: isDesktop ? '6px 14px' : '5px 10px',
                          fontSize: isDesktop ? '12px' : '10px',
                          textTransform: 'uppercase',
                          boxShadow: selectedStatusFilter === status ? '2px 2px 0px #000' : 'none',
                          flexShrink: 0,
                        }}
                      >
                        <AsciiGlitchText text={status} />
                      </button>
                    ))}
                  </div>

                  {/* Priority, Sort & Quick Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 8px', borderRadius: '8px', background: 'var(--bg-input)', border: '2px solid #000000', boxShadow: '2px 2px 0px #000', flexShrink: 0 }}>
                      <Filter className="w-3 h-3" />
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        style={{ background: 'transparent', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', border: 'none', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="all" style={{ background: 'var(--bg-card)' }}>ALL PRIORITIES</option>
                        <option value="4" style={{ background: 'var(--bg-card)' }}>URGENT</option>
                        <option value="3" style={{ background: 'var(--bg-card)' }}>HIGH</option>
                        <option value="2" style={{ background: 'var(--bg-card)' }}>MEDIUM</option>
                        <option value="1" style={{ background: 'var(--bg-card)' }}>LOW</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 8px', borderRadius: '8px', background: 'var(--bg-input)', border: '2px solid #000000', boxShadow: '2px 2px 0px #000', flexShrink: 0 }}>
                      <ArrowUpDown className="w-3 h-3" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{ background: 'transparent', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', border: 'none', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="created_at" style={{ background: 'var(--bg-card)' }}>CREATED</option>
                        <option value="due_date" style={{ background: 'var(--bg-card)' }}>DUE DATE</option>
                        <option value="priority" style={{ background: 'var(--bg-card)' }}>PRIORITY</option>
                        <option value="title" style={{ background: 'var(--bg-card)' }}>TITLE</option>
                      </select>
                    </div>

                    <button
                      onClick={() => bulkActionMutation.mutate({ action: 'mark_all_completed' })}
                      className="comic-btn comic-btn-green"
                      style={{ padding: '5px 8px', fontSize: '10px', borderRadius: '8px', flexShrink: 0 }}
                      title="Complete All"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>DONE ALL</span>
                    </button>

                    <button
                      onClick={() => bulkActionMutation.mutate({ action: 'delete_all_completed' })}
                      className="comic-btn comic-btn-pink"
                      style={{ padding: '5px 8px', fontSize: '10px', borderRadius: '8px', flexShrink: 0 }}
                      title="Clear Completed"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>CLEAR</span>
                    </button>

                    <button
                      onClick={handleExportComicPDF}
                      className="comic-btn comic-btn-cyan"
                      style={{ padding: '5px 10px', fontSize: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
                      title="Export Comic Mission Dossier PDF"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* ── Task Grid ── */}
                {isLoading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '12px' }}>
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} style={{ borderRadius: '14px', height: '140px', background: 'var(--bg-card-subtle)', border: '3px solid #000' }} />
                    ))}
                  </div>
                ) : tasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      borderRadius: '16px',
                      padding: '56px 24px',
                      textAlign: 'center',
                      background: 'var(--bg-card)',
                      border: '3px solid #000000',
                      boxShadow: '6px 6px 0px #000000',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '14px',
                      background: '#ffe600', border: '3px solid #000',
                      boxShadow: '4px 4px 0px #000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '16px', transform: 'rotate(-4deg)',
                    }}>
                      <Sparkles size={32} color="#000000" />
                    </div>
                    <h3 style={{ fontWeight: 900, fontSize: '18px', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {searchQuery ? `NO RESULTS FOR "${searchQuery}"` : "ALL TARGETS CLEARED!"}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700, maxWidth: '340px', lineHeight: 1.5 }}>
                      {searchQuery ? "Try refining your search terms." : "You're completely caught up! Create a new mission task to get rolling."}
                    </p>
                    <button
                      onClick={handleOpenNewTask}
                      className="comic-btn comic-btn-yellow"
                      style={{ marginTop: '20px', padding: '10px 24px', fontSize: '13px' }}
                    >
                      <Plus size={16} />
                      <span>CREATE NEW TASK</span>
                    </button>
                  </motion.div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                    <AnimatePresence>
                      {tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={() => toggleTaskMutation.mutate(task)}
                          onEdit={handleOpenEdit}
                          onDelete={(id) => deleteTaskMutation.mutate(id)}
                          onStartFocus={handleStartFocus}
                          onUpdateSubtasks={handleUpdateSubtasks}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* Kanban Board View */}
            {currentView === 'kanban' && (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <KanbanBoard
                  tasks={tasks}
                  onToggle={(t) => toggleTaskMutation.mutate(t)}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => deleteTaskMutation.mutate(id)}
                  onUpdateStatus={(t, newStatus) =>
                    updateTaskMutation.mutate({ id: t.id, updates: { status: newStatus } })
                  }
                  onQuickAddInLane={handleQuickAddForStatus}
                  onStartFocus={handleStartFocus}
                />
              </motion.div>
            )}

            {/* Calendar View */}
            {currentView === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <CalendarView
                  tasks={tasks}
                  onToggle={(t) => toggleTaskMutation.mutate(t)}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => deleteTaskMutation.mutate(id)}
                  onQuickAddForDate={handleQuickAddForDate}
                  onStartFocus={handleStartFocus}
                />
              </motion.div>
            )}

            {/* Analytics Dashboard */}
            {currentView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
              >
                <AnalyticsDashboard tasks={tasks} stats={stats} />
              </motion.div>
            )}

            {/* Focus Timer (Pomodoro) */}
            {currentView === 'pomodoro' && (
              <motion.div
                key="pomodoro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
              >
                <PomodoroTimer
                  tasks={tasks}
                  activeTask={focusTask}
                  onSelectTask={(t) => setFocusTask(t)}
                  onCompleteTask={(t) => toggleTaskMutation.mutate(t)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Interactive Bottom Navigation Dock */}
      {!isDesktop && (
        <MobileBottomDock
          currentView={currentView}
          onViewChange={setCurrentView}
          onOpenQuickAdd={handleOpenNewTask}
        />
      )}

      {/* Task Create & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        onSelectTask={handleOpenEdit}
        onOpenNewTask={handleOpenNewTask}
        onSwitchView={(v) => {
          setCurrentView(v);
          setIsCommandPaletteOpen(false);
        }}
        onToggleTheme={toggleTheme}
        onExport={handleExportComicPDF}
      />

      {/* PWA App Install Modal */}
      <InstallPwaModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstallDirectly={triggerInstall}
      />
    </div>
  );
}
