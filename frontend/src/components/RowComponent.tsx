import React, { useState } from 'react';
import { Button} from 'react-bootstrap';
import '../css-files/RowComponent.css';

interface RowComponentProps {
  rowData: RowData;
  onDelete: (id: number) => void;
  onEdit: (id: number, newData: RowData) => void;
  columnNames: string[];
}

export interface RowData {
  id: number,
  [key: string]: any;
}

const RowComponent: React.FC<RowComponentProps> = ({ rowData, onDelete, onEdit, columnNames }) => {
  const [row, setRow] = useState<RowData>(rowData);
  const [editedData, setEditedData] = useState<RowData>({ ...rowData });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setEditedData((prevData) => ({
      ...prevData,
      [key]: e.target.value,
      
    }));
  };

  if (row) return (
      <tr className='centered-input-text'>
        {columnNames.map((columnName) => (
          <td key={columnName} className='px-4 py-2 whitespace-nowrap unselectable'>
            <input
              type="text"
              value={editedData[columnName]}
              onChange={(e) => handleChange(e, columnName)}
            />
          </td>
        ))}
        <td className='px-4 py-2 whitespace-nowrap'>
          <Button variant="primary" onClick={(e) => onEdit(row.id, editedData)}>
            Update
          </Button>{' '}
          <Button variant="danger" onClick={(e) => onDelete(row.id)}>
            Delete
          </Button>
        </td>
      </tr>
  )
  else {
    setEditedData(rowData);
    setRow(rowData);
    return null;
  }
};

export default RowComponent;