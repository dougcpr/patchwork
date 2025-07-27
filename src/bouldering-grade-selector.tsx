import {CaretDownIcon, CaretUpIcon} from "@phosphor-icons/react";
import {BoulderingGrades, firstGrade, lastGrade, listOfBoulderingGrades} from "./App.tsx";

type BoulderingGradeSelectorProps = {
  grade: string;
  setGrade: (grade: BoulderingGrades) => void;
};
export const BoulderingGradeSelector = ({ grade, setGrade }: BoulderingGradeSelectorProps) => {
  const raiseGrade = () => {
    const gradeIndex = listOfBoulderingGrades.findIndex(g => g == grade);
    if (gradeIndex < listOfBoulderingGrades.length - 1) {
      const newGrade = listOfBoulderingGrades[gradeIndex + 1]  as BoulderingGrades;;
      setGrade(newGrade)
    }
  }

  const lowerGrade = () => {
    const gradeIndex = listOfBoulderingGrades.findIndex(g => g == grade);
    if (gradeIndex !== 0) {
      const newGrade = listOfBoulderingGrades[gradeIndex - 1]  as BoulderingGrades;;
      setGrade(newGrade)
    }
  }
  return (
    <div className="bouldering-grade-selector-container">
      <h4 className="bouldering-grade-label">
        {grade}
      </h4>
      <div className="bouldering-grade-selector">
        <button disabled={grade === lastGrade} onClick={raiseGrade} className="bouldering-grade-arrow">
          <CaretUpIcon />
        </button>
        <button disabled={grade === firstGrade} onClick={lowerGrade} className="bouldering-grade-arrow">
          <CaretDownIcon />
        </button>
      </div>
    </div>
  )
}