import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import {useState, useEffect} from "react";
import {BoulderingGradeList} from "./bouldering-grade-list";
import {BoulderingGradeNotes} from "./bouldering-grade-notes";
import {BoulderingGradeSelector} from "./bouldering-grade-selector";
import {BoulderingGradeActions} from "./bouldering-grade-actions";
import {BoulderingGradeLayout} from "./bouldering-grade-layout";
import {BoulderingGradeFooter} from "./bouldering-grade-footer";
import {useGetNotes, useUpdateNotes} from "./queries/notes-queries.ts";
import {useGetClimbs, useAddClimb} from "./queries/climbs-queries.ts";
import DatePicker from "react-datepicker";

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

  const handleSaveNote = () => {
    updateNoteMutation.mutate({ note, date: selectedDate });
  };

  return (
    <div className="content">
      <BoulderingGradeLayout>
        <div className="homepage-content">
          <BoulderingGradeNotes content={note} setNote={setNote} />
          <div className="bouldering-grade-container">
            <BoulderingGradeSelector  grade={grade} setGrade={setGrade} />
            <BoulderingGradeActions
              climbs={climbs ?? []}
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
        <div className="bouldering-datepicker">
          <DatePicker selected={selectedDate} onChange={handleDateChange} />
        </div>
        <BoulderingGradeFooter saveNote={handleSaveNote} />
      </BoulderingGradeLayout>
    </div>
  );
};

export default App;
