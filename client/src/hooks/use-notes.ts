import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Note, InsertNote } from "@db/schema";
import { useToast } from '@/hooks/use-toast';
import { useUser } from './use-user';

export function useNotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  const { data: notes, isLoading, error } = useQuery<Note[]>({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/notes', {
        credentials: 'include'  // Include credentials for authentication
      });
      if (response.status === 401) {
        throw new Error('Please login to view your notes');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      return response.json();
    }
  });

  const createNote = useMutation({
    mutationFn: async (note: Omit<InsertNote, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({ title: 'Success', description: 'Note created' });
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to create note', 
        variant: 'destructive' 
      });
    }
  });

  const updateNote = useMutation({
    mutationFn: async (note: Note) => {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: number) => {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({ title: 'Success', description: 'Note deleted' });
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to delete note', 
        variant: 'destructive' 
      });
    }
  });

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote
  };
}
