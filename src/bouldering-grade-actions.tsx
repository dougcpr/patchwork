import { CheckIcon, PlusIcon } from "@phosphor-icons/react";
import type {Climb} from "./App.tsx";
import {isSameDay} from "./bouldering-grade-date-picker.tsx";

type BoulderingGradeActionsProps = {
  selectedDate: Date,
  grade: string;
  setRecordedAttempts: (attempt: Climb) => void;
};

export const BoulderingGradeActions = ({
   selectedDate,
   grade,
   setRecordedAttempts,
 }: BoulderingGradeActionsProps) => {

  const isToday = isSameDay(selectedDate.toISOString(), new Date().toISOString());
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
      <button disabled={!isToday} onClick={logAttempt} className="bouldering-grade-attempt">
        <PlusIcon />
      </button>
      <button disabled={!isToday} onClick={logCompletion} className="bouldering-grade-complete">
        <CheckIcon />
      </button>
    </div>
  );
};
