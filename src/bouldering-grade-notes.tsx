import {useGetNotes} from "./queries/notes-queries.ts";
import {motion} from "framer-motion";

export const BoulderingGradeNotes = () => {
  const { data: notes, isLoading } = useGetNotes()

  const content = notes?.content ?? ''

  return (
    <div className="bouldering-grade-notes">
      {!isLoading && content && (
        <motion.textarea
          value={content}
          disabled
          cols={30}
          rows={10}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ resize: 'none' }}
        />
      )}
    </div>
  )
}