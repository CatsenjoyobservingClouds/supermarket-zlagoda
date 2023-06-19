import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputGroup, Button } from 'react-bootstrap';
import { parse } from 'date-fns';

interface DatePickerProps {
  handleDateChange: Function,
  columnName: string,
  selectedDate: string | null
}

const DatePickerInput: React.FC<DatePickerProps> = ({ handleDateChange, columnName, selectedDate }) => {
  const [editedDate, setEditedDate] = useState<Date | null>(selectedDate == null ? null : parse(selectedDate, 'dd.MM.yyyy', new Date()));

  const handleDate = (date: Date) => {
    setEditedDate(date)
    handleDateChange(date, columnName)
  }


  return (
    <div id='datepicker'>
      <DatePicker
        selected={editedDate}
        onChange={handleDate}
        dateFormat="dd.MM.yyyy"
        placeholderText='dd.mm.yyyy'
        className="form-control"
      />
    </div>
  );
}

export default DatePickerInput;