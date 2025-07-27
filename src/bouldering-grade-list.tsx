import cn from 'clsx';
import type {Attempt} from "./App.tsx";

export const BoulderingGradeList = ({ recordedAttempts }: { recordedAttempts: Attempt[] }) => {
  return (
    <div className="bouldering-grade-list">
      {recordedAttempts.map((attempt, index) => (
        <div key={index} className={
          cn('bouldering-grade-row', {'completed': attempt.completed})}
        >
          {attempt.grade}
        </div>))}
    </div>
  )
}