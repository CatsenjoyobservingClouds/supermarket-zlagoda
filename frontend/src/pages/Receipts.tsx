import React, { useState } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form, Alert } from 'react-bootstrap';
import { BsSearch, BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import RowComponent, { RowData } from '../components/RowComponent';
import axios from 'axios';
import { IIndexable } from '../App';
import '../css-files/DatabaseComponent.css';


//без редагування та додавання - лише видал та звіт для менеджерів
//продавщики маю мати змогу робити  усе

const Receipts = () => {
    const columnNames = ['Receipt', 'Employee', 'Customer', 'Card Number', 'Print Date', 'Total Sum', 'VAT'];
    const tableName = "Receipt";
    const endpoint = "http://localhost:8080/" + localStorage.getItem("role")?.toLowerCase() +"/check";

    const decodeData = (data: any) => {
        const chosenData = data.map((item: any) => ({
            'Id': item.check_number,
            'Receipt': item.check_number,
            'Employee': item.empl_surname + " " + item.empl_name[0] +  ". " + (item.empl_patronymic["Valid"] ? (item.empl_patronymic["String"][0] + ".") : ""),
            'Customer': item.cust_surname["String"] + " " + item.cust_name["String"][0] +  ". " +(item.cust_patronymic["Valid"] ? (item.cust_patronymic["String"][0] + ".") : ""),
            'Card Number': item.card_number["String"],
            'Print Date': new Date(item.print_date).toLocaleString(),
            'Total Sum': item.sum_total + " UAH",
            'VAT': item.vat + " UAH"
        }));
        return chosenData;
    }

    const encodeData = (data: RowData[]) => {
        const chosenData = data.map((item) => ({
            "check_number": item["Receipt"],
            "id_employee": item['Employee'],
            "card_number": {
                "String": (item["Card Number"] ? item["Card Number"] : ""),
                "Valid": (item["Card Number"] ? true : false)
            },
            "print_date": new Date(item["Print Date"]).toISOString(),
            "sum_total": item["Total Sum"],
            "vat": item["VAT"]
        }));
        return chosenData;
    }

    const [rows, setRows] = useState<RowData[]>([]);
    const [sortedBy, setSortedBy] = useState<string>('');
    const [searchText, setSearchText] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedRow, setEditedRow] = useState<RowData>({} as RowData);
    const [wrongNewData, setWrongNewData] = useState<boolean>(false);
    const [updateForm, setUpdateForm] = useState('');


    const alertWrongNewData = wrongNewData === true && (
        <Alert variant="danger">Entered wrong data</Alert>
    );

    const handleReceiptClick = () => {

    }

    const handleEditModalShow = () => {
        setUpdateForm("New");
        setEditedRow({} as RowData);
        setShowEditModal(true);
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
                console.log(data);
                setRows(decodeData(data));
                // filteredRows;
            })
            .catch(error => {
                console.log("Error fetching data:", error);
            })
    };



    const handleSaveEdit = (id: string, newData: RowData) => {
        let encodedRow = {} as IIndexable;
        try {
            encodedRow = encodeData([newData])[0]
        } catch {
            window.alert('Wrong date!');
            return;
        }

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
    }

    const handleEditRow = (id: string, newData: RowData) => {
        setUpdateForm("Edit");
        setEditedRow(newData);
        setShowEditModal(true);
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
            setRows((prevRows) =>
                [...prevRows].sort((a, b) => (parseInt(a[key]) > parseInt(b[key]) ? 1 : -1))
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
        <main>
            <div className='database-container'>
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

                        <Button variant="secondary">
                            Print Report
                        </Button>
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
                                    handleReceiptClick={handleReceiptClick}
                                />
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{updateForm} {tableName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
        </main>

    )
    else {
        fetchAllData();
        return null;
    }

}

export default Receipts;