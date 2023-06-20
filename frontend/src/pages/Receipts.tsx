import React, { useState, useEffect } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { BsSearch, BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import RowComponent, { RowData } from '../components/RowComponent';
import StarButton from '../components/StarButton';
import axios from 'axios';
import { IIndexable } from '../App';
import '../css-files/DatabaseComponent.css';
import autoTable from "jspdf-autotable";
import jsPDF from 'jspdf';
import Report from '../pages/Report';
import DatePickerInput from '../components/DatePicker';
import DropdownList from '../components/DropdownList';
import { parse, format } from 'date-fns';




//без редагування та додавання - лише видал та звіт для менеджерів
//продавщики маю мати змогу робити  усе

const Receipts = () => {
    const columnNames = ['Receipt', 'Employee', 'Customer', 'Card Number', 'Print Date', 'Total Sum, UAH', 'VAT, UAH'];
    const columnNamesChange = ['Receipt Number', 'Employee Full Name', 'Customer Full Name', 'Card Number', 'Print Date'];

    const tableName = "Receipt";
    const endpoint = "http://localhost:8080/" + localStorage.getItem("role")?.toLowerCase() + "/check";

    const decodeData = (data: any) => {
        const chosenData = data.map((item: any) => ({
            'Id': item.check_number,
            'Receipt': item.check_number,
            'Receipt Number': item.check_number,
            'Employee': item.empl_surname + " " + item.empl_name[0] + ". " + (item.empl_patronymic["Valid"] ? (item.empl_patronymic["String"][0] + ".") : ""),
            'Customer': (item.cust_surname["Valid"] ? (item.cust_surname["String"]) : "") + " " + (item.cust_name["Valid"] ? (item.cust_name["String"][0] + ".") : "") + " " + (item.cust_patronymic["Valid"] ? (item.cust_patronymic["String"][0] + ".") : ""),
            'Card Number': item.card_number["String"],
            'Print Date': new Date(item.print_date).toLocaleString(),
            'Total Sum, UAH': item.sum_total.toFixed(2),
            'VAT, UAH': item.vat.toFixed(2),
            'Customer Full Name': item.empl_surname + " " + item.empl_name + " " + (item.empl_patronymic["Valid"] ? (item.empl_patronymic["String"]) : ""),
            'Employee Full Name': (item.cust_surname["Valid"] ? (item.cust_surname["String"]) : "") + " " + (item.cust_name["Valid"] ? (item.cust_name["String"]) : "") + " " + (item.cust_patronymic["Valid"] ? (item.cust_patronymic["String"]) : ""),
            'Products': item.products
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
            "print_date": parse(item["Date of Birth"], 'dd.MM.yyyy', new Date()).toISOString(),
            "sum_total": item["Total Sum, UAH"],
            "vat": item["VAT, UAH"]
        }));
        return chosenData;
    }

    const [rows, setRows] = useState<RowData[]>([]);
    const [sortedBy, setSortedBy] = useState<string>('');
    const [searchText, setSearchText] = useState('');
    const [viewMode, setViewMode] = useState(false);
    const [newMode, setNewMode] = useState(false);
    const [editedRow, setEditedRow] = useState<RowData>({} as RowData);

    const [wrongNewData, setWrongNewData] = useState<boolean>(false);
    const [error, setError] = useState<string>("Entered wrong data");
    const [temporarySearch, setTemporarySearch] = useState('');
    const [listItems, setListItems] = useState();
    const [filteredRows, setFilteredRows] = useState<RowData[]>(rows);
    // const [dataWithAveragePrice, setDataWithAveragePrice] = useState<RowData[]>([]);
    const [isAveragePrice, setIsAveragePrice] = useState<boolean>(false);
    const [asc, setAsc] = useState<boolean>(true);


    const [newRow, setNewRow] = useState<RowData>(
        {
            receiptInfo: {
                "Employee": "",
                "Customer": "",
                "Print Date": new Date()
            },
            products: [],
        })

    const handleAddProduct = () => {
        setNewRow(prevState => ({
            ...prevState,
            products: [
                ...prevState.products,
                {
                    UPC: '',
                    product_number: '',
                },
            ],
        }));
    };

    const handleProductChange = (index: any, field: any, value: any) => {
        setEditedRow(prevState => {
            const updatedProducts = [...prevState.products];
            updatedProducts[index][field] = value;
            return {
                ...prevState,
                products: updatedProducts,
            };
        });
    };


    const alertWrongNewData = wrongNewData === true && (
        <Alert variant="danger">{error?.charAt(0).toUpperCase() + error?.slice(1)}</Alert>
    );

    const handleEditModalShow = () => {
        setViewMode(false);
        setNewMode(true);
    };

    const handleEditModalClose = () => {
        setEditedRow({} as RowData);
        setNewRow({
            receiptInfo: {
                "Employee": "",
                "Customer": "",
                "Print Date": new Date()
            },
            products: [],
        })
        setViewMode(false);
        setNewMode(false);
    };

    const handleDateChange = (date: Date, key: string) => {
        setWrongNewData(false)
        setNewRow((prevState) => ({
            ...prevState,
            receiptInfo: {
                ...prevState.receiptInfo,
                [key]: date?.toLocaleString(),
            },
        }));
    };

    const handleNewChangeFromList = (opt: any, columnName: string) => {
        setWrongNewData(false);
        setNewRow((prevState) => ({
            ...prevState,
            receiptInfo: {
                ...prevState.receiptInfo,
                [columnName]: opt?.value,
            },
        }));
    }

    const handleChoseFromList = (opt: any, columnName: string) => {
        setWrongNewData(false)
        // editedRow[columnName] = opt.label;
        // editedRow[columnName + " Id"] = opt.value;
        // setNewData((prevData) => ({
        //     ...prevData,
        //     [columnName]: opt?.label,
        //     [columnName + " Id"]: opt?.value,
        // }));
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
                setNewMode(false)
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


    const fetchAllData = () => {
        axios.get(endpoint + "/", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(response => {
                const data = decodeData(response.data);
                setRows(data);
                setFilteredRows(data);
            })
            .catch(error => {
                handleLogout();
                console.log("Error fetching data:", error);
            })
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setWrongNewData(false)
        // ((prevData) => ({
        //     ...prevData,
        //     [key]: e.target.value,
        // }));
    };
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
                handleLogout();
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
            setAsc((prev) => !prev)
            setFilteredRows((prevRows) => [...prevRows].reverse());
        } else {
            if (key == "Receipt") {
                setFilteredRows((prevRows) =>
                    [...prevRows].sort((a, b) => (parseInt(a[key].substring(6), 10) > parseInt(b[key].substring(6), 10) ? 1 : -1))
                )
            }
            else if (key == "Card Number") {
                setFilteredRows((prevRows) =>
                    [...prevRows].sort((a, b) => (parseInt(a[key].substring(5), 10) > parseInt(b[key].substring(5), 10) ? 1 : -1))
                )
            } else if (key == "VAT, UAH" || key == "Total Sum, UAH") {
                setFilteredRows((prevRows) =>
                    [...prevRows].sort((a, b) => (parseFloat(a[key]) > parseFloat(b[key]) ? 1 : -1))
                )
            } else {
                setFilteredRows((prevRows) => (
                    [...prevRows].sort((a, b) => (a[key] > b[key]) ? 1 : -1))
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
                columnNames.some((columnName) => {
                    if (columnsToNotSearch.includes(columnName)) { return false };
                    const value = String(row[columnName]).toLowerCase();
                    return value.includes(temporarySearch.toLowerCase());
                })
        ))
    };

    const handleReceiptClick = (id: any, row: RowData) => {
        console.log(id)
        axios.get(endpoint + "/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(response => {
                console.log(response.data)
                const data = decodeData([response.data])[0];
                setEditedRow((prev) => (data))
                console.log(editedRow)

                setViewMode(true);
            })
            .catch(error => {
                handleLogout();
                console.log("Error fetching data:", error);
            })
    }

    useEffect(() => {
        console.log(editedRow);
    }, [editedRow]);

    // useEffect(() => {
    //     console.log(rows);
    // }, [rows]);


    // const filterByCategory = (opt: any, columnName: any) => {
    //     if (opt?.length == 0) {
    //         setFilteredRows(rows)
    //         return
    //     }
    //     const categories = opt.map((item: any) => item.label) as any[];
    //     setFilteredRows(rows.filter(
    //         (row) => (categories.includes(row["Category"]))
    //     ))
    // };

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
        const columnNamesEdited = columnNames;
        rows.forEach(row => {
            const data = columnNamesEdited.map((name) =>
                row[name]
            )
            tableData.push(data);
        });

        const fontSize = 11;
        autoTable(doc, {
            styles: { fontSize: fontSize, halign: 'center' },
            startY: 100,
            head: [columnNamesEdited],
            body: tableData,
            theme: 'striped'
        });

        Report(doc);
    };

    type ColumnValuePair = [string, any];

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("jwt");
    };

    if (rows.length != 0) return (
        <>
            <div className={'database-container max-width-85'}>
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
                        {/* {tableName == "Product" &&
                            <DropdownList key={"Category" + "-dropdown"}
                                passChosenOption={filterByCategory}
                                columnName={"Category"}
                                multiValue={true}
                                defaultValue={"Pick Categories"}
                            />
                        } */}
                        {/* {tableName == "Category" &&

                            <Button variant="primary" onClick={handleAveragePrice}>
                                Category Average Price
                            </Button>
                        } */}
                        {(tableName != "Receipt" || localStorage.getItem("role")) != "Manager" &&
                            <Button variant="success" onClick={(e) => handleEditModalShow()}>
                                Add {tableName}
                            </Button>}

                        <Button variant="secondary" onClick={(e) => generatePdf()}>
                            Print Report
                        </Button>
                    </InputGroup>
                    {/* {tableName == "Employee" ?
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
                            <Form.Check inline label="Sold Every Product" type="checkbox" value="" onChange={(e: any) => soldEveryProduct(e)} className="ml-12 rounded-none" />
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
                    {tableName == "Customer" &&
                        <div>
                            <Form.Check inline label="Served by Every Cashier" type="checkbox" value="" onChange={(e: any) => servedByEveryCashier(e)} className="ml-2 rounded-none" />
                        </div>
                    }
                    {tableName == "Category" &&
                        <div>
                            <Form.Check inline label="Category Average Price" type="checkbox" value="ksk" checked={isAveragePrice} onChange={(e: any) => handleAveragePrice(e)} className="ml-2 rounded-none" />
                        </div>
                    } */}
                </div>
                <div className='table-wrapper mt-6'>
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
                                    onEdit={() => { }}
                                    columnNames={columnNames}
                                    handleReceiptClick={handleReceiptClick}
                                />
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>



            <Modal show={viewMode} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Receipt Info</Modal.Title>
                </Modal.Header>
                <Modal.Body id='#modal'>
                    {columnNamesChange.map((columnName: string) => (
                        <Form.Group controlId={`form${columnName}`} key={columnName} className='width-80'>
                            <Form.Label className="font-semibold">{columnName}</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedRow[columnName]}
                                readOnly
                                className='mb-2 border-x-0 unselectable'
                            />
                        </Form.Group>
                    ))}
                    <h4 className='mb-2 mt-4'>Products</h4>
                    <Table striped bordered>
                        <thead className="text-base" id="special-thead">
                            <tr id="special-tr">
                                <th>Name</th>
                                <th>UPC</th>
                                <th>Amount</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editedRow["Products"]?.map((product: any, index: any) => (
                                <tr key={index}>
                                    <td>{product.product_name}</td>
                                    <td>{product.UPC}</td>
                                    <td className="text-center">{product.product_number}</td>
                                    <td>{product.selling_price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className='mb-6'></div>
                    <Row>
                        <Col className="text-right">
                            <Form.Label className="font-bold text-xl pb-2">
                                Total Sum
                            </Form.Label>
                        </Col>
                        <Col className="text-left">
                            <Form.Label className="font-bold text-xl pb-2">
                                {parseFloat(editedRow["Total Sum, UAH"])?.toFixed(2)} UAH
                            </Form.Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-right">
                            <Form.Label className="font-semibold text-lg pb-2">
                                VAT
                            </Form.Label>
                        </Col>
                        <Col className="text-left">
                            <Form.Label className="font-semibold text-lg pb-2">
                                {parseFloat(editedRow["VAT, UAH"])?.toFixed(2)} UAH
                            </Form.Label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={newMode} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Receipt</Modal.Title>
                </Modal.Header>
                <Modal.Body id='#modal'>
                    <Form>
                        <Form.Group controlId={`formEmployee`} key="Employee">
                            <Form.Label>Employee</Form.Label>
                            <DropdownList key={"Employee" + "-dropdown"}
                                passChosenOption={handleNewChangeFromList}
                                columnName="Employee"
                                defaultValue={editedRow?.receiptInfo?.["Employee"]} />
                        </Form.Group>
                        <Form.Group controlId={`formCustomer`} key="Customer">
                            <Form.Label>Employee</Form.Label>
                            <DropdownList key={"Customer" + "-dropdown"}
                                passChosenOption={handleNewChangeFromList}
                                columnName="Customer"
                                defaultValue={editedRow?.receiptInfo?.["Customer"]} />
                        </Form.Group>
                        <Form.Group controlId={`formPrintDate`} key="Print Date">
                            <Form.Label>Print Date</Form.Label>
                            <DatePickerInput handleDateChange={handleDateChange} columnName="Print Date" selectedDate={editedRow?.receiptInfo?.["Print Date"]} />
                        </Form.Group>
                    </Form>


                    {/* {/* 
                        {Object.entries(editedRow.receiptInfo).map(([columnName, value]: ColumnValuePair) => (
                            { columnName == "Employee" && */}


                    {/* // <Form.Group controlId={`form${columnName}`} key={columnName} className='width-80'>
                            //     <Form.Label className="font-semibold">{columnName}</Form.Label>
                            //     <Form.Control */}
                    {/* //         type="text" */}
                    {/* //         value={value} */}
                    {/* //         onChange={(e) => { */}
                    {/* //             setEditedRow(prevState => ({ */}
                    {/* //                 ...prevState, */}
                    {/* //                 receiptInfo: { */}
                    {/* //                     ...prevState.receiptInfo, */}
                    {/* //                     [columnName]: e.target.value, */}
                    {/* //                 }, */}
                    {/* //             })); */}
                    {/* //         }} */}
                    {/* //         className='mb-2 border-x-0 unselectable' */}
                    {/* //     /> */}
                    {/* // </Form.Group> */}
                    {/* // ))} */}

                    <h4 className='mb-2 mt-4'>Products</h4>
                    <Table striped bordered>
                        <thead className="text-base" id="special-thead">
                            <tr id="special-tr">
                                <th>UPC</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editedRow?.products?.map((product: any, index: any) => (
                                <tr key={index}>
                                    {/* <td>
                                        <Form.Control
                                            type="text"
                                            value={product[""]}
                                            onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                                        />
                                    </td> */}
                                    <td>
                                        <Form.Control
                                            type="text"
                                            required
                                            value={product?.["UPC"]}
                                            onChange={(e) => handleProductChange(index, "UPC", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            required
                                            value={product?.["product_number"]}
                                            onChange={(e) => handleProductChange(index, 'product_number', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className='mb-6'>
                        <Button variant="secondary" onClick={handleAddProduct}>
                            Add Product
                        </Button>
                    </div>
                </Modal.Body>
                {alertWrongNewData}
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleEditModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={false} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Receipt</Modal.Title>
                </Modal.Header>
                <Modal.Body id='#modal'>
                    {columnNamesChange.map((columnName: string) => (
                        columnName.includes("Date") ? (
                            <Form.Group controlId={`form${columnName}`} key={columnName}>
                                <Form.Label>{columnName}</Form.Label>
                                <DatePickerInput handleDateChange={handleDateChange} columnName={columnName} selectedDate={editedRow[columnName]} />
                            </Form.Group>
                        ) : (
                            // (columnName == "Category" && tableName == "Product") ? (
                            //     <Form.Group controlId={`form${columnName}`} key={columnName}>
                            //         <Form.Label>{columnName}</Form.Label>
                            //         <DropdownList key={columnName + "-dropdown"}
                            //             passChosenOption={handleChoseFromList}
                            //             columnName={columnName}
                            //             defaultValue={editedRow[columnName]} />
                            //     </Form.Group>
                            // ) : (columnName == "Product" && tableName == "Product in the Store") ? (
                            //     <Form.Group controlId={`form${columnName}`} key={columnName}>
                            //         <Form.Label>{columnName}</Form.Label>
                            //         <DropdownList key={columnName + "-dropdown"}
                            //             passChosenOption={handleChoseFromList}
                            //             columnName={columnName}
                            //             defaultValue={editedRow[columnName]} />
                            //     </Form.Group>
                            // ) :  (
                            <Form.Group controlId={`form${columnName}`} key={columnName}>
                                <Form.Label>{columnName}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editedRow[columnName]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, columnName)}
                                />
                            </Form.Group>
                            // ))))}\
                        )))}
                </Modal.Body>
                {alertWrongNewData}
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSave}>
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

export default Receipts;