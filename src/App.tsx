import './App.css';
import {useState} from "react";
import {BoulderingGradeList} from "./bouldering-grade-list";
import {BoulderingGradeNotes} from "./bouldering-grade-notes";
import {BoulderingGradeSelector} from "./bouldering-grade-selector";
import {BoulderingGradeActions} from "./bouldering-grade-actions";
import {BoulderingGradeLayout} from "./bouldering-grade-layout";
import {BoulderingGradeFooter} from "./bouldering-grade-footer";
export enum BoulderingGrades {
  V0 = 'V0',
  V1 = 'V1',
  V2 = 'V2',
  V3 = 'V3',
  V4 = 'V4',
  V5 = 'V5',
  V6 = 'V6',
  V7 = 'V7',
  V8 = 'V8',
  V9 = 'V9',
  V10 = 'V10',
}

export type Attempt = {
  grade: string;
  completed: boolean;
}

export const listOfBoulderingGrades: string[] = Object.values(BoulderingGrades);
export const firstGrade = listOfBoulderingGrades[0];
export const lastGrade = listOfBoulderingGrades[listOfBoulderingGrades.length - 1];

const initialRecordedAttempts: Attempt[] = [{
  grade: BoulderingGrades.V0,
  completed: false
}]

const App = () => {
  const [grade, setGrade] = useState(listOfBoulderingGrades[0])
  const [recordedAttempts, setRecordedAttempts] = useState(initialRecordedAttempts)

  return (
    <div className="content">
      <BoulderingGradeLayout>
        <div className="homepage-content">
          <BoulderingGradeNotes />
          <div className="bouldering-grade-container">
            <BoulderingGradeSelector grade={grade} setGrade={setGrade} />
            <BoulderingGradeActions grade={grade} setRecordedAttempts={setRecordedAttempts} />
          </div>
          <BoulderingGradeList recordedAttempts={recordedAttempts} />
        </div>
        <BoulderingGradeFooter />
      </BoulderingGradeLayout>
    </div>
  );
};

export default App;
