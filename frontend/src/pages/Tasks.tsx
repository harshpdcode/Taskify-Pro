// ✅ FILE: src/components/TaskList.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useState } from 'react';
import { FiTrash2, FiEdit, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/TaskList.module.css';

type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
};

type Props = {
  darkMode: boolean;
};

export default function TaskList({ darkMode }: Props) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then((res) => res.data),
  });

  const deleteTask = useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const toggleComplete = useMutation({
    mutationFn: (task: Task) =>
      api.put(`/tasks/${task.id}`, { ...task, completed: !task.completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateTask = useMutation({
    mutationFn: (task: Task) =>
      api.put(`/tasks/${task.id}`, { ...task, title: editedTitle, description: editedDesc }),
    onSuccess: () => {
      setEditingTask(null);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const filteredTasks = tasks?.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDesc(task.description || '');
  };

  return (
    <div className={`${styles.wrapper} ${darkMode ? 'dark' : ''}`}>
      <div className={styles.topBar}>
        <h2 className={styles.h2w}>Your Tasks</h2>
        <div className={styles.controls}>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="completed">✅ Completed</option>
            <option value="pending">⌛ Pending</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : filteredTasks?.length === 0 ? (
        <div className={styles.empty}>🎉 No tasks to show</div>
      ) : (
        <div className={styles.taskList}>
          <AnimatePresence>
            {(filteredTasks ?? []).map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.25 }}
                className={`${styles.taskCard} ${task.completed ? styles.completed : ''}`}
              >
                <div className={styles.taskText}>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  {task.due_date && (
                    <small>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </small>
                  )}
                </div>
                <div className={styles.actions}>
                  <button onClick={() => toggleComplete.mutate(task)} title="Complete">
                    <FiCheckCircle />
                  </button>
                  <button onClick={() => openEdit(task)} title="Edit">
                    <FiEdit />
                  </button>
                  <button onClick={() => deleteTask.mutate(task.id)} title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {editingTask && (
        <div className={styles.modalBackdrop}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={styles.modal}>
            <h3>Edit Task</h3>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Task title"
            />
            <textarea
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              placeholder="Description (optional)"
            />
            <div className={styles.modalActions}>
              <button onClick={() => updateTask.mutate(editingTask)}>Save</button>
              <button onClick={() => setEditingTask(null)} className={styles.cancel}>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
