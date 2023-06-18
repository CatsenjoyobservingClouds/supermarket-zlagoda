import React, { useState } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form, Alert } from 'react-bootstrap';
import RowComponent, { RowData } from './RowComponent';


interface ModalComponentProps {
    tableName: string,
    columnNames: string[],
    showEditModal: boolean, 
    handleEditModalClose: () => void,
    handleChange: Function,
    handleSave: () => void,
    alertWrongNewData: React.JSX.Element,
    editedRow: RowData
}

const ModalComponent: React.FC<ModalComponentProps> = ({tableName, columnNames, showEditModal, handleEditModalClose, handleChange, handleSave, alertWrongNewData, editedRow}) => {

    return (
        <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New {tableName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {tableName == "Employee" ? (
                        <>
                            <Form.Group controlId={`formusername`} key="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editedRow["username"]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "username")}
                                />
                            </Form.Group>
                            <Form.Group controlId={`formpassword`} key="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editedRow["password"]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "password")}
                                />
                            </Form.Group>
                        </>)
                        : null}
                    {columnNames.filter((name) => name != "Id" && name != "Card Number").map((columnName) => (
                        <Form.Group controlId={`form${columnName}`} key={columnName}>
                            <Form.Label>{columnName}</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedRow[columnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, columnName)}
                            />
                        </Form.Group>
                    ))}
                </Modal.Body>
                {alertWrongNewData}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
    )
}

export default ModalComponent;