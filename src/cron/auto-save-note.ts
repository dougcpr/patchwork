import { useEffect, useRef } from 'react';

export const useAutoSaveNote = (note: string, selectedDate: Date, updateNoteMutation: any) => {
  const lastSavedNoteRef = useRef(note);

  useEffect(() => {
    const interval = setInterval(() => {
      if (note !== lastSavedNoteRef.current) {
        updateNoteMutation.mutate({ note, date: selectedDate });
        lastSavedNoteRef.current = note;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [note, selectedDate, updateNoteMutation]);
};