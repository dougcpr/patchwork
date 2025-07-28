import { CheckIcon, PlusIcon } from "@phosphor-icons/react";
import type {Climb} from "./App.tsx";

type BoulderingGradeActionsProps = {
  grade: string;
  setRecordedAttempts: (attempt: Climb) => void;
};

export const BoulderingGradeActions = ({
   grade,
   setRecordedAttempts,
 }: BoulderingGradeActionsProps) => {
  const logAttempt = () => {
    setRecordedAttempts({
      grade,
      completed: false,
      selectedDate: new Date()
    });
  };

  const logCompletion = () => {
    setRecordedAttempts({
      grade,
      completed: true,
      selectedDate: new Date()
    });
  };

  return (
    <div className="bouldering-grade-actions">
      <button onClick={logAttempt} className="bouldering-grade-attempt">
        <PlusIcon />
      </button>
      <button onClick={logCompletion} className="bouldering-grade-complete">
        <CheckIcon />
      </button>
    </div>
  );
};
