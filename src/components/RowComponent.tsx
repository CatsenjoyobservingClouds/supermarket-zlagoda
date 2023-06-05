import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState<RowData>({ ...rowData });

  const handleEditModalShow = () => {
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleSave = () => {
    onEdit(rowData.id, editedData);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    onDelete(rowData.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setEditedData((prevData) => ({
      ...prevData,
      [key]: e.target.value,
    }));
  };

  return (
    <>
      <tr className='centered-input-text'>
        {columnNames.map((columnName) => (
          <td key={columnName}>
            <input
              type="text"
              value={editedData[columnName]}
              onChange={(e) => handleChange(e, columnName)}
            />
          </td>
        ))}
        <td>
          <Button variant="primary" onClick={handleEditModalShow}>
            Edit
          </Button>{' '}
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </td>
      </tr>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Row</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {columnNames.map((columnName) => (
            <Form.Group controlId={`form${columnName}`} key={columnName}>
              <Form.Label>{columnName}</Form.Label>
              <Form.Control
                type="text"
                value={editedData[columnName]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, columnName)}
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RowComponent;