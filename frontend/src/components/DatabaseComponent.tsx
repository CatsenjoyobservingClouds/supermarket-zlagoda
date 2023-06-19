import React, { useState } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form, Alert } from 'react-bootstrap';
import { BsSearch, BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import RowComponent, { RowData } from './RowComponent';
import StarButton from './StarButton';
import axios from 'axios';
import { IIndexable } from '../App';
import '../css-files/DatabaseComponent.css';
import autoTable from "jspdf-autotable";
import jsPDF from 'jspdf';
import Report from '../pages/Report';



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
    const [editedRow, setEditedRow] = useState<RowData>({} as RowData);
    const [wrongNewData, setWrongNewData] = useState<boolean>(false);


    const alertWrongNewData = wrongNewData === true && (
        <Alert variant="danger">Entered wrong data</Alert>
    );

    const handleEditModalShow = () => {
        setShowEditModal(true);
        console.log(showEditModal);
    };

    const handleEditModalClose = () => {
        setEditedRow({} as RowData);
        setShowEditModal(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setWrongNewData(false)
        setEditedRow((prevData) => ({
            ...prevData,
            [key]: e.target.value,
        }));
    };

    const handleSave = () => {
        let encodedRow = {} as IIndexable;
        try {
            encodedRow = encodeData([editedRow])[0]
        } catch {
            setWrongNewData(true);
            return;
        }


        axios.post(endpoint + "/", encodedRow, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(resp => {
                setEditedRow({} as RowData);
                setShowEditModal(false);
                setWrongNewData(false);
                fetchAllData();
            })
            .catch(error => {
                setWrongNewData(true);
                console.log("Error adding new data:", error);
            })
    };

    const fetchAllData = () => {
        axios.get(endpoint + "/", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(response => {
                const data = response.data;
                setRows(decodeData(data));
                // filteredRows();
            })
            .catch(error => {
                handleLogout();
                console.log("Error fetching data:", error);
            })
    };


    const handleEditRow = (id: string, newData: RowData) => {
        console.log('Editing... ' + id + newData);
        let encodedRow = {} as IIndexable;
        try {
            encodedRow = encodeData([newData])[0]
        } catch {
            window.alert('Wrong date!');
            return;
        }


        console.log("patch");
        console.log(encodedRow);
        axios.patch(endpoint + "/" + id, encodedRow,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                },
            })
            .then(resp => {
                setRows((prevRows) =>
                    prevRows.map((row) => {
                        if (row.Id === id) {
                            return { ...row, ...newData };
                        }
                        return row;
                    })
                );
            })
            .catch(error => {
                console.log("Error editing data:", error);
                window.alert('Entered wrong data!');
            })

        console.log("fetched")
    };

    const handleDeleteRow = (id: string) => {
        console.log('Deleting... ' + id);


        console.log("delete");
        axios.delete(endpoint + "/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(resp => {
                setRows((prevRows) => prevRows.filter((row) => row["Id"] != id));
            })
            .catch(error => {
                console.log("Error deleting data:", error);
            })
    };


    // const handleAddRow = () => {
    //     const newRow: RowData = {
    //         Id: rows.length + 1,
    //     };
    //     columnNames.forEach((columnName) => {
    //         newRow[columnName] = '';
    //     });
    //     setRows((prevRows) => [...prevRows, newRow]);
    // };

    const handleSort = (key: string) => {
        if (sortedBy === key) {
            // Reverse the sorting direction
            setRows((prevRows) => [...prevRows].reverse());
        } else {
            if ((key == "Id" && tableName == "Employee") || (key == "Card Number" && tableName == "Customer")) {
                setRows((prevRows) =>
                    [...prevRows].sort((a, b) => (parseInt(a[key].substring(5), 10) > parseInt(b[key].substring(5), 10) ? 1 : -1))
                )
            } else {
                setRows((prevRows) =>
                    [...prevRows].sort((a, b) => (parseInt(a[key]) > parseInt(b[key]) ? 1 : -1))
                );
            }
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

    const generatePdf = () => {
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";
        const doc = new jsPDF(orientation, unit, size);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const headerWidth = doc.getStringUnitWidth("Zlahoda " + tableName) * 22 / doc.internal.scaleFactor;
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("Zlahoda " + tableName, (pageWidth - headerWidth) / 2, 60);

        const footer = "Generated by " + localStorage.getItem("username") + " on " + new Date().toLocaleDateString();
        const footerWidth = doc.getStringUnitWidth(footer) * 12 / doc.internal.scaleFactor;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(footer, (pageWidth - footerWidth) / 2, doc.internal.pageSize.height - 20);

        const tableData = [] as any[];
        rows.forEach(row => {
            const data = columnNames.map((name) =>
                row[name]
            )
            tableData.push(data);
        });

        const fontSize = (tableName == "Employee") ? 7 : 11;
        autoTable(doc, {
            styles: { fontSize: fontSize, halign: 'center' },
            startY: 100,
            head: [columnNames],
            body: tableData,
            theme: 'striped'
        });

        Report(doc);
    };

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("jwt");
      };

    if (rows.length != 0) return (
        <>
            <div className={'database-container ' + (tableName == "Product" ? "max-width-75 " : "max-width-96 ") + (tableName=="Category" ? "padding-for-elements max-width-60" : "")}>
                <div className='database-operations'>
                    <InputGroup className="my-3 flex">
                        <FormControl
                            placeholder="Search"
                            value={searchText}
                            onChange={handleSearch}
                        />
                        <Button variant="info" size="lg" className="d-flex align-items-center" id='search-button'
                            onClick={(e) => handleSearch}>
                            <BsSearch />
                        </Button>
                        {(tableName != "Receipt" && localStorage.getItem("role")) != "Manager" ||
                            <Button variant="success" onClick={(e) => handleEditModalShow()}>
                                Add {tableName}
                            </Button>}

                        <Button variant="secondary" onClick={(e) => generatePdf()}>
                            Print Report
                        </Button>
                        {tableName === "Customer Card" && (
                            <StarButton />
                        )}
                    </InputGroup>
                </div>
                <div className='table-wrapper'>
                    <Table striped hover responsive="sm" className='custom-table'>
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
                                <th className='buttons-column'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <RowComponent
                                    key={row.Id}
                                    rowData={row}
                                    onDelete={handleDeleteRow}
                                    onEdit={handleEditRow}
                                    columnNames={columnNames}
                                />
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New {tableName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {tableName == "Employee" ? (
                        <>
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
        </>

    )
    else {
        fetchAllData();
        return null;
    }
};

export default DatabaseComponent;