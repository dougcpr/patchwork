import cn from 'clsx';
import type {Climb} from "./App.tsx";

export const BoulderingGradeList = ({ climbs }: { climbs: Climb[] }) => {
  return (
    <div
      className="bouldering-grade-list">
      {climbs && climbs.map((climb, index) => (
        <div key={index} className={
          cn('bouldering-grade-row', {'completed': climb.completed})}
        >
          {climb.grade}
        </div>))}
    </div>
  )
}