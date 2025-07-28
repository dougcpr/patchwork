import {supabase} from "../supabaseClient.ts";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import type {Climb} from "../App.tsx";
import {getUTCEndOfDay, getUTCStartOfDay} from "./notes-queries.ts";

const fetchClimbs = async (date: Date): Promise<Climb[]> => {
  const formattedDate = getUTCStartOfDay(date);
  const formattedNextDate = getUTCEndOfDay(date);
  
  const { data, error } = await supabase
    .from('climbs')
    .select('*')
    .filter('created_at', 'gte', formattedDate)
    .filter('created_at', 'lt', formattedNextDate)

  if (error) throw new Error(error.message)
  return data || []
}

const addClimb = async (newClimb: Climb): Promise<void> => {
  const { error } = await supabase
    .from('climbs')
    .insert([{
      grade: newClimb.grade,
      completed: newClimb.completed,
      created_at: newClimb.selectedDate
    }])
  
  if (error) throw new Error(error.message)
}

export const useGetClimbs = (date: Date) => {
  return useQuery<Climb[]>({
    queryKey: ['climbs', date.toISOString().split('T')[0]],
    queryFn: () => fetchClimbs(date),
  })
}

export const useAddClimb = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: addClimb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['climbs'] })
    },
  })
}