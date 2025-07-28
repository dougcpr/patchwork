import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

export const getUTCStartOfDay = (date: Date): string => {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
  return start.toISOString();
};

export const getUTCEndOfDay = (date: Date): string => {
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
  return end.toISOString();
};

const fetchNotes = async (date: Date) => {
  const formattedDate = getUTCStartOfDay(date);
  const formattedNextDate = getUTCEndOfDay(date);
  
  const { data, error } = await supabase
    .from('notes')
    .select('content')
    .filter('created_at', 'gte', formattedDate)
    .filter('created_at', 'lt', formattedNextDate)
    .single()
  if (error) throw new Error(error.message)
  return data
}

const updateNote = async (note: string, date: Date) => {
  const formattedDate = getUTCStartOfDay(date);
  const formattedNextDate = getUTCEndOfDay(date);

  // First check if a note exists for this date
  const { data: existingNote } = await supabase
    .from('notes')
    .select('id')
    .gte('created_at', formattedDate)
    .lt('created_at', formattedNextDate)
    .single();

  if (existingNote) {
    // Update existing note
    const { data, error } = await supabase
      .from('notes')
      .update({ content: note })
      .eq('id', existingNote.id);

    if (error) throw new Error(error.message);
    return data;
  } else {
    // Insert new note
    const { data, error } = await supabase
      .from('notes')
      .insert([{ 
        content: note, 
        created_at: formattedDate 
      }]);

    if (error) throw new Error(error.message);
    return data;
  }
};

export const useGetNotes = (date: Date) => {
  return useQuery({
    queryKey: ['notes', date.toISOString().split('T')[0]],
    queryFn: () => fetchNotes(date),
  })
}

export const useUpdateNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ note, date }: { note: string; date: Date }) => updateNote(note, date),
    onSuccess: (_, { date }) => {
      // Invalidate the specific date's notes query
      queryClient.invalidateQueries({ 
        queryKey: ['notes', date.toISOString().split('T')[0]] 
      });
    },
  });
};