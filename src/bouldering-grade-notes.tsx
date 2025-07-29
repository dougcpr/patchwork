import {motion} from "framer-motion";

export const BoulderingGradeNotes = ({content, setNote}: {content: string, setNote: (value: string) => void}) => {
  return (
    <div className="bouldering-grade-notes">
        <motion.textarea
          value={content || ''}
          placeholder="Enter notes here..."
          onChange={(e) => setNote(e.target.value)}
          cols={30}
          rows={10}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ resize: 'none' }}
        />
    </div>
  )
}