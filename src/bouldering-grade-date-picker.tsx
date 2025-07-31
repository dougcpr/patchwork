import { useState, useEffect } from "react";
import { fetchNotesFromLastThreeActiveDays } from "./queries/notes-queries.ts";
import {ChartPieIcon, HouseIcon} from "@phosphor-icons/react";
import cn from "clsx";

type Props = {
  isTransformed: boolean;
  setIsTransformed: (value: boolean) => void;
  initialSelectedDate: Date | undefined;
  handleDateChange: (date: Date) => void;
};

export const isSameDay = (a: string, b: string) =>
  a.split("T")[0] === b.split("T")[0];

export const BoulderingGradeDatePicker = ({ isTransformed, setIsTransformed, initialSelectedDate, handleDateChange }: Props) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate ?? new Date());
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const lastThreeDays = await fetchNotesFromLastThreeActiveDays(); // assumed to return strings or Dates
        // Normalize all to start of day (strip time)
        const normalizeDate = (input: Date | string) => {
          const d = new Date(input);
          d.setHours(0, 0, 0, 0);
          return d;
        };
        const today = normalizeDate(new Date());
        const allDates = [...lastThreeDays.map((returnedDate) => normalizeDate(returnedDate.created_at))];
        if (!lastThreeDays.includes(today)) {
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

  const updateStyle = () => {
    setIsTransformed(!isTransformed);
  };

  return (
    <div className="fixed-date-picker">
      <div className={`date-bar`}>
        <button onClick={updateStyle} className="date-bar-item calendar-item">
          {isTransformed ? <HouseIcon /> : <ChartPieIcon /> }
        </button>
        {dates.map((date, index) => {
          const isSelected = isSameDay(selectedDate.toISOString(), date.toISOString())
          return (
            <button
              key={index}
              disabled={isTransformed}
              onClick={() => handleDateClick(date)}
              className={cn('date-bar-item', {
                selected: isSelected
              })}
              style={{
                backgroundColor: isSelected ? "#88b2d8" : "white",
                color: 'black'
              }}
            >
              <div>{date.toLocaleString("default", { month: "short" })}</div>
              <div>{date.getDate()}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
