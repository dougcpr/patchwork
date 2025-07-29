import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

export const getUTCDateRangeForLocalDay = (date: Date) => {
  const startOfDayLocal = new Date(date);
  startOfDayLocal.setHours(0, 0, 0, 0); // 00:00:00.000 local

  const endOfDayLocal = new Date(date);
  endOfDayLocal.setHours(23, 59, 59, 999); // 23:59:59.999 local

  const startUTC = startOfDayLocal.toISOString();
  const endUTC = endOfDayLocal.toISOString();

  return { startUTC, endUTC };
}

const fetchNotes = async (date: Date) => {
  const { startUTC, endUTC } = getUTCDateRangeForLocalDay(date);

  const { data, error } = await supabase
    .from('notes')
    .select('content')
    .filter('created_at', 'gte', startUTC)
    .filter('created_at', 'lt', endUTC)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export const fetchNotesFromLastFiveActiveDays = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .limit(5)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

const updateNote = async (note: string, date: Date) => {
  const { startUTC, endUTC } = getUTCDateRangeForLocalDay(date);

  // First check if a note exists for this date
  const { data: existingNote } = await supabase
    .from('notes')
    .select('id')
    .gte('created_at', startUTC)
    .lt('created_at', endUTC)
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
        created_at: startUTC
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