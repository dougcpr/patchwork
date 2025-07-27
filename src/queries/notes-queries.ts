import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

const selectedDate = '2025-05-06'
const selectedDate1 = '2025-05-07'
const fetchNotes = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .filter('created_at', 'gte', selectedDate)
    .filter('created_at', 'lt', selectedDate1)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export const useGetNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  })
}