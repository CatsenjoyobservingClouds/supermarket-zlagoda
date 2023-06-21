import React, { useState, useEffect } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form, Alert } from 'react-bootstrap';
import { BsSearch, BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import RowComponent, { RowData } from './RowComponent';
import StarButton from './StarButton';
import axios from 'axios';
import { IIndexable } from '../App';
import '../css-files/DatabaseComponent.css';
import autoTable from "jspdf-autotable";
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router';
import Report from '../pages/Report';
import DatePickerInput from './DatePicker';
import DropdownList from './DropdownList';
import { decodeData2 } from '../pages/Categories'



interface DatabaseComponentProps {
    endpoint: string; // Backend API endpoint to fetch data from
    decodeData: Function,
    encodeData: Function,
    columnNames: string[]; // Array of column names
    columnNamesChange: string[];
    tableName: string;
}

const DatabaseComponent: React.FC<DatabaseComponentProps> = ({ endpoint, decodeData, encodeData, columnNames, columnNamesChange, tableName }) => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [sortedBy, setSortedBy] = useState<string>('');
    const [searchText, setSearchText] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedRow, setEditedRow] = useState<RowData>({} as RowData);
    const [wrongNewData, setWrongNewData] = useState<boolean>(false);
    const [error, setError] = useState<string>("Entered wrong data");
    const [temporarySearch, setTemporarySearch] = useState('');
    const [listItems, setListItems] = useState();
    const [filteredRows, setFilteredRows] = useState<RowData[]>(rows);
    // const [dataWithAveragePrice, setDataWithAveragePrice] = useState<RowData[]>([]);
    const [isAveragePrice, setIsAveragePrice] = useState<boolean>(false);
    const [asc, setAsc] = useState<boolean>(true);
    const [columnNamesThis, setColumnNamesThis] = useState(columnNames);


    const alertWrongNewData = wrongNewData === true && (
        <Alert variant="danger">{error?.charAt(0).toUpperCase() + error?.slice(1)}</Alert>
    );
    const navigate = useNavigate();

    const handleEditModalShow = () => {
        setShowEditModal(true);
        setEditMode(false);
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

    const handleChangeCheckBox = (e: any, key: string) => {
        setWrongNewData(false)
        setEditedRow((prevData) => ({
            ...prevData,
            [key]: e.target.checked,
        }));
    };

    const handleDateChange = (date: Date, key: string) => {
        setWrongNewData(false)
        setEditedRow((prevData) => ({
            ...prevData,
            [key]: date?.toLocaleDateString(),
        }));
    };

    const handleChoseFromList = (opt: any, columnName: string) => {
        setWrongNewData(false)
        // editedRow[columnName] = opt.label;
        // editedRow[columnName + " Id"] = opt.value;
        setEditedRow((prevData) => ({
            ...prevData,
            [columnName]: opt?.label,
            [columnName + " Id"]: opt?.value,
        }));
    };

    const handleSave = () => {
        let encodedRow = {} as IIndexable;
        try {
            encodedRow = encodeData([editedRow])[0]
            encodedRow = Object.fromEntries(Object.entries(encodedRow).filter(([_, v]) => v != null && v != ""))
        } catch {

            setError("Entered wrong data");
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
                console.log(encodedRow)
                if (error.response.status == 401) handleLogout()

                setError(error.response?.data["error"]);
                setWrongNewData(true);
                console.log("Error adding new data:", error);
            })
    };

    const handleUpdate = () => {
        console.log(editedRow)
        let encodedRow = {} as IIndexable;
        try {
            encodedRow = encodeData([editedRow])[0]
        } catch {

            setError("Entered wrong data");
            setWrongNewData(true);
            return;
        }

        axios.patch(endpoint + "/" + editedRow["Id"], encodedRow,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                },
            })
            .then(resp => {
                setEditedRow({} as RowData);
                setShowEditModal(false);
                setWrongNewData(false);
                setRows(rows.filter((row) => (row["Id"] != editedRow["Id"])))
                setFilteredRows(rows.filter((row) => (row["Id"] != editedRow["Id"])))
                fetchAllData();
            })
            .catch(error => {
                if (error.response.status == 401) handleLogout()
                setError(error.response?.data["error"])
                console.log(encodedRow)
                setWrongNewData(true);
                console.log("Error editing data:", error);
            })
    }

    const fetchAllData = async () => {
        if (tableName == "Category" && localStorage.getItem("role")?.toLowerCase() == "manager") {
            handleAveragePrice();
        } else {
            axios.get(endpoint + "/", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
                .then(response => {
                    if (tableName == "Category") setColumnNamesThis(["Id", "Category"])
                    const data = decodeData(response.data);
                    setRows(data);
                    setFilteredRows(data);
                    // setIsAveragePrice(false);
                    // if (tableName == "Category") {
                    //     setColumnNamesThis(["Id", "Category"])
                    // }
                })
                .catch(error => {
                    handleLogout();
                    console.log("Error fetching data:", error);
                })
        }
        // }
    };

    // const handlePrice = async (e: any) => {
    //     if (e.target.checked) {
    //         await handleAveragePrice(asc).then(response => {
    //             const data = response?.data?.map((item: any) => ({
    //                 'Id': item.category_number,
    //                 'Category': item.category_name,
    //                 'Average Price': item.average_price
    //             }))
    //             setIsAveragePrice(true);
    //             setColumnNamesThis(["Id", "Category", "Average Price"])
    //             setFilteredRows((prev) => {
    //                 const updatedRows = [...prev];
    //                 updatedRows.forEach((row, index) => {
    //                     row["Average Price"] = data?.[index]?.["Average Price"]
    //                 });
    //                 return updatedRows;
    //             });
    //         })
    //             .catch(error => {
    //                 console.log("Error fetching data:", error);
    //             })
    //     } else {
    //         setIsAveragePrice(false)
    //         setFilteredRows(rows);
    //         setColumnNamesThis(["Id", "Category"])
    //     }
    //     setFilteredRows((prev) => prev)
    //     // fetchAllData();
    // }



    // useEffect(() => {
    //     console.log("filteredRows:", filteredRows);
    //     // setFilteredRows((prevRows) => {
    //     //     const updatedRows = [...prevRows];
    //     //     updatedRows.forEach((row) => {
    //     //         "Average Price"
    //     //     });
    //     //     return updatedRows;
    //     // });
    // }, [filteredRows]);






    // const filteredRowsGet = () => {
    //     if (tableName == "Category" && isAveragePrice) {
    //         if (dataWithAveragePrice.length != 0) {
    //             return dataWithAveragePrice
    //         } else {
    //             return handleGetAveragePrice();
    //         }
    //     }

    //     if(sortedBy !== ""){
    //         handleSort(sortedBy);
    //     }

    //     return filteredRows

    //     filteredRows.filter(
    //     (row) =>
    //         columnNames.some((columnName) => {
    //             const value = String(row[columnName]).toLowerCase();
    //             return value.includes(searchText.toLowerCase());
    //         })
    // );
    // }


    const handleEditRow = (id: any, newData: RowData) => {
        setShowEditModal(true);
        setEditMode(true);
        setEditedRow(newData);

        console.log('Editing... ' + id + newData);
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
                setFilteredRows((prevRows) => prevRows.filter((row) => row["Id"] != id));
            })
            .catch(error => {
                window.alert("Cannot delete this information, it is connected to other data.")
                // handleLogout();
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

    const sortAsNumber = ["Salary, UAH", "Discount Percent", "Average Price", "Id", "Selling Price, UAH", "Amount", "UPC", "Phone Number"]
    const handleSort = (key: string) => {
        if (sortedBy === key) {
            setAsc((prev) => !prev)
            setFilteredRows((prevRows) => [...prevRows].reverse());
        } else {
            if ((key == "Id" && tableName == "Employee") || (key == "Card Number" && tableName == "Customer")) {
                setFilteredRows((prevRows) =>
                    [...prevRows].sort((a, b) => (parseInt(a[key].substring(5), 10) > parseInt(b[key].substring(5), 10) ? 1 : -1))
                )
            } else if (sortAsNumber.includes(key)) {
                setFilteredRows((prevRows) =>
                    [...prevRows].sort((a, b) => (parseFloat(a[key]) > parseFloat(b[key]) ? 1 : -1))
                )
            } else {
                setFilteredRows((prevRows) =>
                    [...prevRows].sort((a, b) => ((a[key] > b[key]) ? 1 : -1))
                );
            }
        }
        setSortedBy(key);
    };

    const columnsToNotSearch = ["Street", "Zip Code", "City", "Product Info", "Characteristics", "Role"]
    const handleSearch = (e: any) => {
        setSearchText(temporarySearch);
        setFilteredRows(rows.filter(
            (row) =>
                columnNamesThis.some((columnName) => {
                    if (columnsToNotSearch.includes(columnName)) { return false };
                    const value = String(row[columnName]).toLowerCase();
                    return value.includes(temporarySearch.toLowerCase());
                })
        ))
    };

    const filterByRole = (e: any) => {
        if (e.target.id == "All") {
            setFilteredRows(rows)
        } else {
            setFilteredRows(rows.filter(
                (row) => (row["Role"].includes(e.target.id))
            ))
        }
    };

    const filterByPromote = (e: any) => {
        if (e.target.id == "All") {
            setFilteredRows(rows)
        } else {
            if (e.target.id == "Promotional") {
                setFilteredRows(rows.filter(
                    (row) => (row["Promotional"] == true)
                ))
            } else {
                setFilteredRows(rows.filter(
                    (row) => (row["Promotional"] == false)
                ))
            }
        }
    };

    const filterByCategory = (opt: any, columnName: any) => {
        if (opt?.length == 0) {
            setFilteredRows(rows)
            return
        }
        const categories = opt.map((item: any) => item.label) as any[];
        setFilteredRows(rows.filter(
            (row) => (categories.includes(row["Category"]))
        ))
    };

    const soldEveryProduct = (e: any) => {
        if (e.target.checked) {
            axios.get("http://localhost:8080/manager/analytics/cashiersWhoHaveSoldEveryProductInTheStore", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
                .then(response => {
                    console.log(response)
                    const data = decodeData(response.data);
                    setFilteredRows(data);
                })
                .catch(error => {
                    handleLogout();
                    console.log("Error fetching data:", error);
                })
        } else {
            setFilteredRows(rows);
        }
    };

    const servedByEveryCashier = (e: any) => {
        if (e.target.checked) {
            axios.get("http://localhost:8080/manager/analytics/registeredCustomersWhoHaveBeenServedByEveryCashier", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
                .then(response => {
                    const data = decodeData(response.data);
                    setFilteredRows(data);
                })
                .catch(error => {
                    handleLogout();
                    console.log("Error fetching data:", error);
                })
        } else {
            setFilteredRows(rows);
        }
    };

    const handleAveragePrice = () => {
        const toAsc = asc ? "ASC" : "DESC";
        axios.get("http://localhost:8080/manager/analytics/averagePricePerCategory?decimalPlaces=2&orderBy=" + "category_name" + "&ascDesc=" + toAsc, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(response => {
                const data = decodeData2(response.data);
                setFilteredRows(data)
                setRows(data);
            })
            .catch(error => {
                handleLogout();
                console.log("Error fetching data:", error);
            })
    }

    // useEffect(() => {
    //     console.log("filteredRows:", filteredRows);
    // }, [filteredRows]);

    // useEffect(() => {
    //     console.log("columnNamesThis:", columnNamesThis);
    // }, [columnNamesThis]);

    // useEffect(() => {
    //     setFilteredRows((prev) => prev);
    // }, [rows]);



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
        const columnNamesEdited = columnNamesThis;
        if (tableName == "Product in the Store") {
            columnNamesEdited[columnNamesThis.indexOf("Promotional")] = "UPC Promotional"
        }
        rows.forEach(row => {
            const data = columnNamesEdited.map((name) =>
                row[name]
            )
            tableData.push(data);
        });

        const fontSize = (tableName == "Employee") ? 7 : 11;
        autoTable(doc, {
            styles: { fontSize: fontSize, halign: 'center' },
            startY: 100,
            head: [columnNamesEdited],
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
            <div className={'database-container ' + (tableName == "Product" ? "max-width-70 " : "max-width-96 ") + (tableName == "Category" ? "padding-for-elements max-width-50 " : "") + (tableName == "Product in the Store" ? "max-width-80 " : "")}>
                <div className='database-operations'>
                    <InputGroup className="my-3 flex">
                        <FormControl
                            placeholder="Search"
                            value={temporarySearch}
                            onChange={(e: any) => setTemporarySearch(e.target.value)}
                        />
                        <Button variant="info" size="lg" className="d-flex align-items-center" id='search-button'
                            onClick={(e) => handleSearch(e)}>
                            <BsSearch />
                        </Button>
                        {tableName == "Product" &&
                            <DropdownList key={"Category" + "-dropdown"}
                                passChosenOption={filterByCategory}
                                columnName={"Category"}
                                multiValue={true}
                                defaultValue={"Pick Categories"}
                            />
                        }
                        {/* {tableName == "Category" &&

                            <Button variant="primary" onClick={handleAveragePrice}>
                                Category Average Price
                            </Button>
                        } */}
                        {((localStorage.getItem("role") == "Manager" && tableName != "Receipt") || (localStorage.getItem("role") == "Cashier" && (tableName == "Receipt" || tableName == "Customer"))) &&
                            <Button variant="success" onClick={(e) => handleEditModalShow()}>
                                Add {tableName}
                            </Button>}
                        {localStorage.getItem("role")?.toLowerCase() == "manager" &&
                            <Button variant="secondary" onClick={(e) => generatePdf()}>
                                Print Report
                            </Button>
                        }
                        {/* {tableName === "Customer Card" && (
                            <StarButton />
                        )} */}
                    </InputGroup>
                    {tableName == "Employee" ?
                        (<div className='flex'>
                            <Form>
                                <Form.Check
                                    inline
                                    defaultChecked
                                    label="All"
                                    type="radio"
                                    name="optradio"
                                    id="All"
                                    onChange={(e: any) => filterByRole(e)}
                                />
                                <Form.Check
                                    inline
                                    label="Cashiers"
                                    type="radio"
                                    name="optradio"
                                    id="Cashier"
                                    onChange={(e: any) => filterByRole(e)}
                                />
                                <Form.Check
                                    inline
                                    label="Managers"
                                    type="radio"
                                    name="optradio"
                                    id="Manager"
                                    onChange={(e: any) => filterByRole(e)}
                                />
                            </Form>
                            {localStorage.getItem("role")?.toLowerCase() == "manager" &&
                                <Form.Check inline label="Sold Every Product" type="checkbox" value="" onChange={(e: any) => soldEveryProduct(e)} className="ml-12 rounded-none" />}
                            {localStorage.getItem("role")?.toLowerCase() == "manager" &&
                            <Button className="pt-0 pb-0 ml-10" onClick={() => navigate("/units-sold-by-category")}>Units Sold by Category</Button>}
                        </div>) : (null)
                    }
                    {tableName == "Product in the Store" ?
                        (<Form>
                            <Form.Check
                                inline
                                defaultChecked
                                label="All"
                                type="radio"
                                name="optradio"
                                id="All"
                                onChange={(e: any) => filterByPromote(e)}
                            />
                            <Form.Check
                                inline
                                label="Promotional"
                                type="radio"
                                name="optradio"
                                id="Promotional"
                                onChange={(e: any) => filterByPromote(e)}
                            />
                            <Form.Check
                                inline
                                label="Not Promotional"
                                type="radio"
                                name="optradio"
                                id="Not_Promotional"
                                onChange={(e: any) => filterByPromote(e)}
                            />
                        </Form>) : (null)
                    }
                    {tableName == "Customer" && localStorage.getItem("role")?.toLowerCase() == "manager" &&
                        <div>
                            <Form.Check inline label="Served by Every Cashier" type="checkbox" value="" onChange={(e: any) => servedByEveryCashier(e)} className="ml-2 rounded-none" />
                        </div>
                    }
                    {/* {tableName == "Category" &&
                        <div>
                            <Form.Check inline label="Category Average Price" type="checkbox" value="" onChange={(e: any) => handleAveragePrice()} className="ml-2 rounded-none" />
                        </div>
                    } */}
                </div>
                <div className='table-wrapper mt-6'>
                    <Table striped hover responsive="sm" className='custom-table'>
                        <thead>
                            <tr>
                                {columnNamesThis.map((columnName) => (
                                    <th key={columnName} className='unselectable' >
                                        {columnName}{' '}
                                        {sortedBy === columnName ? (
                                            <BsFillCaretUpFill onClick={() => handleSort(columnName)} />
                                        ) : (
                                            <BsFillCaretDownFill onClick={() => handleSort(columnName)} />
                                        )}
                                    </th>
                                ))}
                                {/* {tableName == "Category" && isAveragePrice &&
                                    <th key="Avergae Price" className='unselectable' >
                                        "Avergae Price"{' '}
                                        {sortedBy === "Avergae Price" ? (
                                            <BsFillCaretUpFill onClick={() => handleSort("Avergae Price")} />
                                        ) : (
                                            <BsFillCaretDownFill onClick={() => handleSort("Avergae Price")} />
                                        )}
                                    </th>
                                } */}
                                {!(localStorage.getItem("role") == "Cashier" && (tableName == "Product" || tableName == "Category" || tableName == "Product in the Store")) &&
                                    <th className='buttons-column'>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <RowComponent
                                    key={row.Id}
                                    rowData={row}
                                    onDelete={handleDeleteRow}
                                    onEdit={handleEditRow}
                                    columnNames={columnNamesThis}
                                />
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit' : 'New'} {tableName}</Modal.Title>
                </Modal.Header>
                <Modal.Body id='#modal'>
                    {columnNamesChange.map((columnName) => (
                        columnName.includes("Date") ? (
                            <Form.Group controlId={`form${columnName}`} key={columnName}>
                                <Form.Label>{columnName}</Form.Label>
                                <DatePickerInput handleDateChange={handleDateChange} columnName={columnName} selectedDate={editedRow[columnName]} />
                            </Form.Group>
                        ) : (
                            (columnName == "Category" && tableName == "Product") ? (
                                <Form.Group controlId={`form${columnName}`} key={columnName}>
                                    <Form.Label>{columnName}</Form.Label>
                                    <DropdownList key={columnName + "-dropdown"}
                                        passChosenOption={handleChoseFromList}
                                        columnName={columnName}
                                        defaultValue={editedRow[columnName]} />
                                </Form.Group>
                            ) : (columnName == "Product" && tableName == "Product in the Store") ? (
                                <Form.Group controlId={`form${columnName}`} key={columnName}>
                                    <Form.Label>{columnName}</Form.Label>
                                    <DropdownList key={columnName + "-dropdown"}
                                        passChosenOption={handleChoseFromList}
                                        columnName={columnName}
                                        defaultValue={editedRow[columnName]} />
                                </Form.Group>
                            ) : (columnName == "Promotional") ? (
                                <Form.Group className='mt-4'>
                                    <Form.Label>Is this product promotional?</Form.Label>
                                    <div className="d-flex align-items-center justify-start">
                                        <input
                                            className="w-12 h-6 mb-4 mt-1"
                                            type="checkbox"
                                            value={editedRow[columnName]}
                                            checked={editedRow[columnName]}
                                            onChange={(e: any) => handleChangeCheckBox(e, columnName)}
                                        />
                                    </div>
                                </Form.Group>
                            ) : (
                                <Form.Group controlId={`form${columnName}`} key={columnName}>
                                    <Form.Label>{columnName}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedRow[columnName]}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, columnName)}
                                    />
                                </Form.Group>
                            ))))}

                    {tableName == "Employee" && !editMode ? (
                        <>
                            <Form.Group controlId={`formusername`} key="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editedRow["Username"]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "Username")}
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
                </Modal.Body>
                {alertWrongNewData}
                <Modal.Footer>
                    <Button variant="primary" onClick={editMode ? handleUpdate : handleSave}>
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleEditModalClose}>
                        Close
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