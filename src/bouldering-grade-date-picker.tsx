import { useState, useEffect } from "react";
import { fetchNotesFromLastFiveActiveDays } from "./queries/notes-queries.ts";

type Props = {
  initialSelectedDate: Date | undefined;
  handleDateChange: (date: Date) => void;
};

const isSameDay = (a: string, b: string) =>
  a.split("T")[0] === b.split("T")[0];

export const BoulderingGradeDatePicker = ({ initialSelectedDate, handleDateChange }: Props) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate ?? new Date());
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const lastFourDays = await fetchNotesFromLastFiveActiveDays(); // assumed to return strings or Dates
        // Normalize all to start of day (strip time)
        const normalizeDate = (input: Date | string) => {
          const d = new Date(input);
          d.setHours(0, 0, 0, 0);
          return d;
        };
        const today = normalizeDate(new Date());
        const allDates = [...lastFourDays.map((returnedDate) => normalizeDate(returnedDate.created_at))];
        if (!lastFourDays.includes(today)) {
          allDates.push(today);
        }

        const uniqueDates = Array.from(
          new Map(allDates.map(date => [date.toISOString(), date])).values()
        );

        // Sort descending
        uniqueDates.sort((a, b) => a.getTime() - b.getTime());
        setDates(uniqueDates);
      } catch (error) {
        console.error("Failed to fetch dates:", error);
      }
    };

    fetchDates();
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    handleDateChange(date);
  };

  return (
    <div className="date-bar">
      {dates.map((date, index) => {
        const isSelected = isSameDay(selectedDate.toISOString(), date.toISOString())
        return (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            className="date-bar-item"
            style={{
              backgroundColor: isSelected ? "#88b2d8" : "white"
            }}
          >
            <div>{date.toLocaleString("default", { month: "short" })}</div>
            <div>{date.getDate()}</div>
          </button>
        );
      })}
    </div>
  );
};
