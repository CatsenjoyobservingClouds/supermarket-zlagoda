import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputGroup, Button } from 'react-bootstrap';
import { parse } from 'date-fns';
import "../css-files/DatabaseComponent.css"

interface DatePickerProps {
  handleDateChange: Function,
  columnName: string,
  selectedDate: string | null
}

const DatePickerInput: React.FC<DatePickerProps> = ({ handleDateChange, columnName, selectedDate }) => {
  const [editedDate, setEditedDate] = useState<Date | null>(selectedDate == null ? null : (columnName == "Print Date" ? parse(selectedDate, 'dd.MM.yyyy HH:mm:ss', new Date()) : parse(selectedDate, 'dd.MM.yyyy', new Date())));

  const handleDate = (date: Date) => {
    setEditedDate(date)
    console.log(date)
    handleDateChange(date, columnName)
  }

  // useEffect(() => {
  //   setEditedDate(editedDate)
  //   console.log(editedDate)
  //   handleDateChange(editedDate, columnName)
  // }, [editedDate, selectedDate]);


  return (
    <>
      {columnName == "Print Date" ? (
        <div id='datepicker-2'>
          <DatePicker id='date-time-picker'
            showTimeSelect
            timeFormat="HH:mm:ss"
            timeIntervals={15}
            selected={editedDate}
            onChange={handleDate}
            dateFormat="dd.MM.yyyy HH:mm:ss"
            placeholderText='dd.mm.yyyy hh:mm:ss'
            className="form-control"
          />
        </div>
      ) : (
        <div id='datepicker'>
          <DatePicker className={(columnName == "From" || columnName=="To") ? "w-24" : ""}
            selected={editedDate}
            onChange={handleDate}
            dateFormat="dd.MM.yyyy"
            placeholderText='dd.mm.yyyy'
            // className="form-control"
          />
        </div>
      )}
    </>
  );
}

export default DatePickerInput;