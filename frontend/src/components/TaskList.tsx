// src/components/TaskList.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '../api/task';
import type { Task } from '../types/task';
import TaskCard from './TaskCard';

export default function TaskList() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => TaskService.getAll()
  });

  const toggleMutation = useMutation({
    mutationFn: (task: Task) => TaskService.toggle(task.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => TaskService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });

  if (isLoading) {
    return <div className="p-4 text-xs text-slate-400">Loading tasks...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => toggleMutation.mutate(task)}
          onEdit={() => {}}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      ))}
    </div>
  );
}