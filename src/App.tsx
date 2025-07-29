import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import {useState, useEffect} from "react";
import * as _ from 'lodash';
import {BoulderingGradeList} from "./bouldering-grade-list";
import {BoulderingGradeNotes} from "./bouldering-grade-notes";
import {BoulderingGradeSelector} from "./bouldering-grade-selector";
import {BoulderingGradeActions} from "./bouldering-grade-actions";
import {BoulderingGradeLayout} from "./bouldering-grade-layout";
import {useGetNotes, useUpdateNotes} from "./queries/notes-queries.ts";
import {useGetClimbs, useAddClimb} from "./queries/climbs-queries.ts";
import {useAutoSaveNote} from "./cron/auto-save-note.ts";
import {BoulderingGradeDatePicker} from "./bouldering-grade-date-picker.tsx";

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

export type Climb = {
  id?: string;
  grade: string;
  completed: boolean;
  selectedDate: Date;
}

export const listOfBoulderingGrades: string[] = Object.values(BoulderingGrades);
export const firstGrade = listOfBoulderingGrades[0];
export const lastGrade = listOfBoulderingGrades[listOfBoulderingGrades.length - 1];

const App = () => {
  const [grade, setGrade] = useState(listOfBoulderingGrades[0])
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {data: climbs, isLoading: climbsLoading } = useGetClimbs(selectedDate);
  const [note, setNote] = useState('');
  const {data: content}  = useGetNotes(selectedDate);
  const updateNoteMutation = useUpdateNotes();
  const addClimbMutation = useAddClimb();

  // Update note state when content changes (when date changes)
  useEffect(() => {
    if (content?.content) {
      setNote(content.content);
    } else {
      setNote('');
    }
  }, [content]);

  const handleAddClimb = (newClimb: Climb) => {
    const newClimbWithDate = {...newClimb, selectedDate};
    addClimbMutation.mutate(newClimbWithDate);
  };

    const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  }

  const detectCompletionRate = (): string => {
      let completedClimbs = 0;
      climbs?.map(climb => {
        if (climb.completed) {
          completedClimbs++;
        }
      })
    const totalClimbs = climbs?.length ?? 1;
    let climbRatio = _.round(completedClimbs/totalClimbs * 100, 1)
    if (isNaN(climbRatio)) {
      climbRatio = 0;
    }
    return `${climbRatio}%`;
  }

  const calculateAverageGrade = (): number => {
    if (!climbs || climbs.length === 0) return 0;

    const gradeToNumber = (grade: string): number | null => {
      const match = grade.match(/^V(\d+)$/i);
      return match ? parseInt(match[1], 10) : null;
    };

    let total = 0;
    let count = 0;

    for (const climb of climbs) {
      const numGrade = gradeToNumber(climb.grade);
      if (numGrade !== null) {
        total += numGrade;
        count++;
      }
    }

    return count === 0 ? 0 : _.round((total / count), 1);
  };

  useAutoSaveNote(note, selectedDate, updateNoteMutation);

  return (
    <div className="content">
      <BoulderingGradeLayout>
        <div className="homepage-content">
          <BoulderingGradeNotes content={note} setNote={setNote} />
          <div className="bouldering-grade-container">
            <BoulderingGradeSelector  grade={grade} setGrade={setGrade} />
            <BoulderingGradeActions
              selectedDate={selectedDate}
              grade={grade} 
              setRecordedAttempts={handleAddClimb} 
            />
          </div>
          {climbsLoading ? (
            <div className="bouldering-grade-list"></div>
          ) : (
            <BoulderingGradeList climbs={climbs || []} />
          )}
        </div>
        <div style={{display: "flex", justifyContent: "space-between", gap: "1rem"}}>
          <div className="bouldering-grade-total">
            {calculateAverageGrade()}
          </div>
          <div className="bouldering-grade-total">
            {detectCompletionRate()}
          </div>
          <div className="bouldering-grade-total">
            {climbs?.length ?? 0}
          </div>
        </div>
        <BoulderingGradeDatePicker initialSelectedDate={selectedDate} handleDateChange={handleDateChange} />
      </BoulderingGradeLayout>
    </div>
  );
};

export default App;
