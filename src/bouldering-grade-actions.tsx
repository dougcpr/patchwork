import { CheckIcon, PlusIcon } from "@phosphor-icons/react";
import type { Dispatch, SetStateAction } from "react";
import type {Attempt} from "./App.tsx";

type BoulderingGradeActionsProps = {
  grade: string;
  setRecordedAttempts: Dispatch<SetStateAction<Attempt[]>>;
};

export const BoulderingGradeActions = ({
                                         grade,
                                         setRecordedAttempts,
                                       }: BoulderingGradeActionsProps) => {
  const logAttempt = () => {
    setRecordedAttempts(prev => [
      { grade, completed: false },
      ...prev
    ]);
  };

  const logCompletion = () => {
    setRecordedAttempts(prev => [
      { grade, completed: true },
      ...prev
    ]);
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
