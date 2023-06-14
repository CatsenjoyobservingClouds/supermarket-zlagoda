import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import '../css-files/RowComponent.css';

interface RowComponentProps {
  rowData: RowData;
  onDelete: (id: string) => void;
  onEdit: (id: string, newData: RowData) => void;
  columnNames: string[];
}

export interface RowData {
  id: string
  [key: string]: any;
}

const RowComponent: React.FC<RowComponentProps> = ({ rowData, onDelete, onEdit, columnNames }) => {
  const [row, setRow] = useState<RowData>(rowData);
  const [editedData, setEditedData] = useState<RowData>({ ...rowData });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    e.target.style.width = e.target.value.length + 'ch';
    setEditedData((prevData) => ({
      ...prevData,
      [key]: e.target.value,

    }));
  };

  if (row) return (
    <tr className='centered-input-text'>
      {columnNames.map((columnName) => (
        <td key={columnName} className='unselectable'>
          <input
            type="text"
            value={editedData[columnName]}
            maxLength={100}
            size={(editedData[columnName] ? (editedData[columnName].toString().length) : 1)}
            onChange={(columnName == "Id" || rowData["VAT"] != null) ? () => {} : (e) => handleChange(e, columnName)}
          />
        </td>
      ))}
      <td className='unselectable buttons-column'>
        {rowData["VAT"] == null &&
          <Button variant="primary" onClick={(e) => onEdit(row["Id"], editedData)} className='update-button'>
            Update
          </Button>
        }
        {(rowData["VAT"] != null || localStorage.getItem("role") != "Cashier") &&
          <Button variant="danger" onClick={(e) => onDelete(row["Id"])} className='delete-button'>
            Delete
          </Button>
        }
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