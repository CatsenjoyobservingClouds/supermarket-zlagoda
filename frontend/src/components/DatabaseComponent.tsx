import React, { useState } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form } from 'react-bootstrap';
import { BsSearch, BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import RowComponent, { RowData } from './RowComponent';
import StarButton from './StarButton';
import axios from 'axios';
import '../css-files/DatabaseComponent.css';



interface DatabaseComponentProps {
    endpoint: string; // Backend API endpoint to fetch data from
    decodeData: Function,
    encodeData: Function,
    columnNames: string[]; // Array of column names
    tableName: string;
}

const DatabaseComponent: React.FC<DatabaseComponentProps> = ({ endpoint, decodeData, encodeData, columnNames, tableName }) => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [sortedBy, setSortedBy] = useState<string>('');
    const [searchText, setSearchText] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditModalShow = () => {
        setShowEditModal(true);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    //   const handleSave = () => {
    //     onEdit(rowData.id, editedData);
    //     setShowEditModal(false);
    //   };

    const fetchAllData = () => {
        axios.get(endpoint + "/", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(response => {
                const data = response.data;
                setRows(decodeData(data));
                console.log(rows);
                // handleSort(sortedBy);
                filteredRows;

            })
            .catch(error => {
                console.log("Error fetching data:", error);
            })
    };



    const handleEditRow = (id: number, newData: RowData) => {
        console.log('Editing... ' + id + newData);
        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.id === id) {
                    return { ...row, ...newData };
                }
                return row;
            })
        );

        console.log("patch");
        axios.patch(endpoint + "/:" + id, encodeData(newData),
        {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
        })
            .catch(error => {
                console.log("Error fetching data:", error);
            })
    };

    const handleDeleteRow = (id: number) => {
        console.log('Deleting... ' + id);
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));

        console.log("delete");
        axios.delete(endpoint + "/:" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .catch(error => {
                console.log("Error fetching data:", error);
            })
    };


    const handleAddRow = () => {
        const newRow: RowData = {
            id: rows.length + 1,
        };
        columnNames.forEach((columnName) => {
            newRow[columnName] = '';
        });
        setRows((prevRows) => [...prevRows, newRow]);
    };

    const handleSort = (key: string) => {
        if (sortedBy === key) {
            // Reverse the sorting direction
            setRows((prevRows) => [...prevRows].reverse());
        } else {
            setRows((prevRows) =>
                [...prevRows].sort((a, b) => (a[key] > b[key] ? 1 : -1))
            );
        }
        setSortedBy(key);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const filteredRows = rows.filter(
        (row) =>
            columnNames.some((columnName) => {
                const value = String(row[columnName]).toLowerCase();
                return value.includes(searchText.toLowerCase());
            })
    );

    if (rows.length != 0) return (
        <>
            <div className='database-container'>
                <div className='database-operations'>
                    <InputGroup className="my-3 flex">
                        <FormControl
                            placeholder="Search"
                            value={searchText}
                            onChange={handleSearch}
                        />
                        <InputGroup.Text>
                            <BsSearch onClick={() => handleSearch} />
                        </InputGroup.Text>
                    </InputGroup>
                    <Button variant="success" onClick={() => handleEditModalShow}>
                        Add New {tableName}
                    </Button>
                    <Button variant="secondary">
                        Print Documents
                    </Button>
                    {tableName === "Customer Card" && (
                        <StarButton />
                    )}
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {columnNames.map((columnName) => (
                                <th key={columnName} className='unselectable' >
                                    {columnName}{' '}
                                    {sortedBy === columnName ? (
                                        <BsFillCaretUpFill onClick={() => handleSort(columnName)} />
                                    ) : (
                                        <BsFillCaretDownFill onClick={() => handleSort(columnName)} />
                                    )}
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((row) => (
                            <RowComponent
                                key={row.id}
                                rowData={row}
                                onDelete={handleDeleteRow}
                                onEdit={handleEditRow}
                                columnNames={columnNames}
                            />
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* <Modal show={showEditModal} onHide={handleEditModalClose}>
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
                        </div >*/}
        </>

    )
    else {
        fetchAllData();
        return null;
    }
};

export default DatabaseComponent;