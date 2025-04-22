// app/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import TodoList from '@/components/todos/TodoList';
import TodoFilters from '@/components/todos/TodoFilters';
import TodoStats from '@/components/todos/TodoStats';
import { useState, useEffect } from 'react';
import TodoForm from '@/components/todos/TodoForm';
import { TaskCharts } from '@/components/todos/TaskCharts';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePWA } from '@/hooks/usePWA';
import Button from '@/components/ui/Button';
import { useTodoContext } from '@/context/TodoContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { state, dispatch, canUndo, canRedo } = useTodoContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && state.editingTask) {
      setIsFormOpen(true);
    }
  }, [isMounted, state.editingTask]);

  useKeyboardShortcuts(
    isMounted
      ? [
          { key: 'n', ctrlKey: true, action: () => setIsFormOpen(true) },
          { key: 'z', ctrlKey: true, action: () => dispatch({ type: 'UNDO' }) },
          { key: 'y', ctrlKey: true, action: () => dispatch({ type: 'REDO' }) },
        ]
      : []
  );

  usePWA();

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to continue</h1>
          <a href="/login" className="btn btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            My Tasks
          </h1>
          <div className="flex space-x-2">
            <Button
              variant="text"
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="text-gray-900 dark:text-gray-100"
            >
              Undo
            </Button>
            <Button
              variant="text"
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="text-gray-900 dark:text-gray-100"
            >
              Redo
            </Button>
            <NotificationCenter />
          </div>
        </div>
        <TodoStats />
        <TodoFilters />
        <TodoList onAddTask={() => setIsFormOpen(true)} />
        <TaskCharts />
        <TodoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </main>
    </div>
  );
}