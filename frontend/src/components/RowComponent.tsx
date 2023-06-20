import React, { useState } from 'react';
import { Button} from 'react-bootstrap';
import '../css-files/RowComponent.css';
import { ReceiptButton } from '../components/Buttons';


interface RowComponentProps {
  rowData: RowData;
  onDelete: (id: string) => void;
  onEdit: (id: string, newData: RowData) => void;
  columnNames: string[];
  handleReceiptClick?: Function
}

export interface RowData {
  [key: string]: any;
}

const RowComponent: React.FC<RowComponentProps> = ({ rowData, onDelete, onEdit, columnNames, handleReceiptClick }) => {
  const [row, setRow] = useState<RowData>(rowData);

  if (row) return (
    <tr className='centered-input-text'>
      {columnNames.map((columnName) => (
        (columnName != "Promotional" ? (
          <td key={columnName} className='unselectable'>
            <input
              className={columnName=="Product"|| columnName=="Characteristics" || columnName=="Product Info" ? "w-full" : "" }
              readOnly
              type="text"
              value={row[columnName]}
              size={columnName == "Characteristics" || columnName == "Product" || (columnName == "Name" && rowData["Username"] != null) ? null : (row[columnName] ? (row[columnName].toString().length) : 1)}
            />
          </td>) :
          (<td key={columnName} className='unselectable' >
            <input
              className="w-9 h-4 mr-2"
              readOnly
              type="checkbox"
              value={row[columnName]}
              checked={row[columnName]}
            />
          </td>))
      ))}

      <td className='unselectable buttons-column d-flex align-middle justify-center'>
        {rowData["VAT"] != null &&
          <ReceiptButton handleReceiptClick={handleReceiptClick} />
        }
        {rowData["VAT"] == null &&
          <Button variant="primary" onClick={(e) => onEdit(row["Id"], row)} className='update-button'>
            Edit
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
    setRow(rowData);
    return null;
  }
};

export default RowComponent;