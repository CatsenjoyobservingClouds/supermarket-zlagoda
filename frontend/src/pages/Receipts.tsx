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
import DatePicker from 'react-datepicker';
import DropdownList from '../components/DropdownList';
import { parse, format } from 'date-fns';


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
            'Print Date': new Date(item.print_date).toLocaleDateString(),
            'Id Employee': item.id_employee,
            'Total Sum, UAH': item.sum_total.toFixed(2),
            'VAT, UAH': item.vat.toFixed(2),
            'Employee Full Name': item.empl_surname + " " + item.empl_name + " " + (item.empl_patronymic["Valid"] ? (item.empl_patronymic["String"]) : ""),
            'Customer Full Name': (item.cust_surname["Valid"] ? (item.cust_surname["String"]) : "") + " " + (item.cust_name["Valid"] ? (item.cust_name["String"]) : "") + " " + (item.cust_patronymic["Valid"] ? (item.cust_patronymic["String"]) : ""),
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
    const [empty, setEmpty] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<any>({ "From": new Date("01-01-1899").toLocaleDateString(), "To": new Date().toLocaleDateString() })


    const [newRow, setNewRow] = useState<RowData>(
        {
            receiptInfo: {
                "Customer": "",
                "Customer Id": "",
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
        setNewRow(prevState => {
            const updatedProducts = [...prevState.products];
            updatedProducts[index][field] = value ? parseInt(value) : 0;
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
                "Customer": "",
                "Customer Id": "",
            },
            products: [],
        })
        setViewMode(false);
        setNewMode(false);
    };

    // const handleDateChange = (date: Date, key: string) => {
    //     setWrongNewData(false)
    //     setNewRow((prevState) => ({
    //         ...prevState,
    //         receiptInfo: {
    //             ...prevState.receiptInfo,
    //             [key]: date?.toLocaleString(),
    //         },
    //     }));
    // };


    const handleDateChange = (date: Date, column: any) => {
        setTotalSum(undefined);
        setWrongNewData(false)
        setDateRange((prevDate: any) => ({
            ...prevDate,
            [column]: date?.toLocaleDateString(),
        }));

        console.log(dateRange[column])
        // setWrongNewData(false)
        // setNewRow((prevState) => ({
        //     ...prevState,
        //     receiptInfo: {
        //         ...prevState.receiptInfo,
        //         [key]: date?.toLocaleString(),
        //     },
        // }));
    };

    const submitDate = () => {
        if (dateRange["From"] == null || dateRange["To"] == null) {
            setFilteredRows(rows)
            return
        }
        if (dateRange["From"] == dateRange["To"]) {
            console.log("==")
            setFilteredRows(rows.filter((filteredRow) => filteredRow["Print Date"] == dateRange["To"]))
            return
        }
        const from = parse(dateRange["From"], 'dd.MM.yyyy', new Date())
        const to = parse(dateRange["To"], 'dd.MM.yyyy', new Date())
        // console.log(new Date(dateRange["From"]))
        // console.log(new Date(dateRange["To"]))
        // console.log(from == to)
        if (from > new Date() || to > new Date()) {
            window.alert("The future is unpredictable!")
            setFilteredRows(rows)
            return
        }
        if (from > to) {
            window.alert("From date cannot be bigger than To date!")
            setFilteredRows(rows)
            return
        } else {
            setWrongNewData(false)
            console.log("<")

            setFilteredRows(rows.filter((filteredRow) => {
                // console.log(filteredRow["Print Date"]);
                // console.log(dateRange["To"])
                // console.log()
                return parse(filteredRow["Print Date"], 'dd.MM.yyyy', new Date()) < to && (parse(filteredRow["Print Date"], 'dd.MM.yyyy', new Date()) > from || filteredRow["Print Date"] == dateRange["From"])
            }))
            return
        }
    }

    // setFilteredRows(filteredRows.filter(
    //     (row) => (row["Print Date"] < dateRange["To"] && row["Print Date"] > dateRange["From"]));
    // ))

    // setFilteredRows(rows.filter(
    //     (row) => (row["Role"].includes(e.target.id))
    // ))


    // if(dateRange["From"] > dateRange["To"]){
    //     // window.alert("From Date cannot be bigger than To Date!")
    //     setDateRange({
    //         "From": new Date().toLocaleDateString(),
    //         "To": new Date().toLocaleDateString()
    //     });
    //     return

    // } else if (dateRange["From"] == dateRange["To"]){
    //     console.log("==")
    //     setFilteredRows(rows.filter((filteredRow) => filteredRow["Print Date"] == dateRange["To"]))
    //     return

    // }else {
    //     setWrongNewData(false)
    //     console.log("<")

    //     setFilteredRows(rows.filter((filteredRow) => {
    //         // console.log(filteredRow["Print Date"]);
    //         // console.log(dateRange["To"])
    //         // console.log()
    //         return filteredRow["Print Date"] <=  dateRange["To"] && filteredRow["Print Date"] > dateRange["From"]}))
    //         return

    //     // setFilteredRows(filteredRows.filter(
    //     //     (row) => (row["Print Date"] < dateRange["To"] && row["Print Date"] > dateRange["From"]));
    //     // ))

    //     // setFilteredRows(rows.filter(
    //     //     (row) => (row["Role"].includes(e.target.id))
    //     // ))
    // }


    // setWrongNewData(false)
    // setNewRow((prevState) => ({
    //     ...prevState,
    //     receiptInfo: {
    //         ...prevState.receiptInfo,
    //         [key]: date?.toLocaleString(),
    //     },
    // }));

    const handleNewChangeFromList = (opt: any, columnName: string) => {
        setWrongNewData(false);
        setNewRow((prevState) => ({
            ...prevState,
            receiptInfo: {
                ...prevState.receiptInfo,
                [columnName]: opt?.label,
                [columnName + " Id"]: opt?.value
            },
        }));
    }

    const handleUPCChange = (opt: any, columnName: string) => {
        setWrongNewData(false);
        setNewRow(prevState => {
            const arr = columnName.split(" ")
            const updatedProducts = [...prevState.products];
            // updatedProducts[parseInt(arr[1])]["UPC "] = opt?.label;
            updatedProducts[parseInt(arr[1])]["UPC"] = opt?.value
            return {
                ...prevState,
                products: updatedProducts,
            };
        });
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
        let encodedRow = {
            "card_number": newRow["receiptInfo"]["Customer Id"],
            "products": newRow["products"]
        } as any
        encodedRow = Object.fromEntries(Object.entries(encodedRow).filter(([_, v]) => v != null && v != ""))

        console.log(encodedRow)
        axios.post(endpoint + "/", encodedRow, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(resp => {
                setEditedRow({} as RowData);
                setNewRow({
                    receiptInfo: {
                        "Customer": "",
                        "Customer Id": "",
                    },
                    products: [],
                })
                setNewMode(false)
                setViewMode(false);
                setWrongNewData(false);
                fetchAllData();
            })
            .catch(error => {
                if (error?.response?.status == 401) handleLogout()
                if (error?.response?.status == 409) {
                    setError("Not enough products in the store");
                } else {
                    setError(error?.response?.data["error"]);
                }
                setWrongNewData(true);
                console.log("Error adding new data:", error);
            })
    }


    const fetchAllData = () => {
        axios.get(endpoint + "/", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(response => {
                let data = decodeData(response.data) as any[];

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
                handleLogout();
                console.log("Error deleting data:", error);
            })
    };




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

    const filterByCashier = (opt: any, columnName: any) => {
        setTotalSum(0);
        if (opt == null) {
            setFilteredRows(rows)
            return
        }
        const employees = opt?.value
        setFilteredRows(filteredRows.filter(
            (row) => (employees?.includes(row["Id Employee"]))
        ))
    };

    const [totalSum, setTotalSum] = useState<number>();

    const handleSum = (e: any) => {
        let sum = 0;
        filteredRows.forEach((row) => {
            sum += parseFloat(row["Total Sum, UAH"])
        })
        setTotalSum(parseFloat(sum.toFixed(2)));
    }


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

    if (rows.length != 0 || empty) return (
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

                        {(localStorage.getItem("role") == "Manager") &&
                            <DropdownList key={"Employee" + "-dropdown"}
                                passChosenOption={filterByCashier}
                                columnName={"Employee"}
                                defaultValue={"Pick Cashier...   "}
                            />
                        }
                        {(localStorage.getItem("role")) != "Manager" &&
                            <Button variant="success" onClick={(e) => handleEditModalShow()}>
                                Add {tableName}
                            </Button>}

                        {localStorage.getItem("role") == "Manager" &&
                            <Button variant="secondary" onClick={(e) => generatePdf()}>
                                Print Report
                            </Button>
                        }

                    </InputGroup>
                    <InputGroup>
                        {/* <div className='flex special'> */}
                        <div className="flex gap-3 pb-1 pt-1 mr-1">
                            {/* <Form.Group controlId={`form${"From"}`} key={"From"}> */}
                            <label className="font-semibold">From: </label>
                            <DatePickerInput
                                handleDateChange={handleDateChange}
                                columnName="From"
                                selectedDate={dateRange["From"]} />
                            {/* </Form.Group> */}

                        </div>
                        <div className="flex gap-3 pb-1 pt-1 mr-1">
                            {/* <Form.Group controlId={`form${"To"}`} key={"To"}> */}
                            <label className="font-semibold">To: </label>
                            <DatePickerInput
                                handleDateChange={handleDateChange}
                                columnName="To"
                                selectedDate={dateRange["To"]} />
                            {/* </Form.Group> */}
                        </div>
                        <Button className="pb-1 pt-1" onClick={() => submitDate()}>Filter by Date</Button>
                        <div className='mr-16'></div>
                        {localStorage.getItem("role") == "Manager" &&
                            <>
                                <FormControl className='sum-form pb-1 pt-1'
                                    readOnly
                                    placeholder="UAH"
                                    value={totalSum}
                                />
                                <Button className="pb-1 pt-1"
                                    onClick={(e) => handleSum(e)}>
                                    Total Sum
                                </Button>
                            </>
                        }
                    </InputGroup>
                    <InputGroup>

                    </InputGroup>
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
            </div >



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
                        <Form.Group controlId={`formCustomer`} key="Customer">
                            <Form.Label className="font-semibold text-lg">Customer</Form.Label>
                            <DropdownList key={"Customer" + "-dropdown"}
                                passChosenOption={handleNewChangeFromList}
                                columnName="Customer"
                                defaultValue={editedRow?.receiptInfo?.["Customer"]} />
                        </Form.Group>
                        {/* <Form.Group controlId={`formPrintDate`} key="Print Date">
                            <Form.Label>Print Date</Form.Label>
                            <DatePickerInput handleDateChange={handleDateChange} columnName="Print Date" selectedDate={editedRow?.receiptInfo?.["Print Date"]} />
                        </Form.Group> */}
                    </Form>

                    <h4 className='mb-2 mt-4 font-semibold'>Products</h4>
                    <Table striped bordered>
                        <thead className="text-base" id="special-thead">
                            <tr id="special-tr">
                                <th>UPC</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newRow?.products?.map((product: any, index: any) => (
                                <tr key={index}>
                                    {/* <td>
                                        <Form.Control
                                            type="text"
                                            value={product[""]}
                                            onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                                        />
                                    </td> */}
                                    <td className="w-80 text-md">
                                        <DropdownList key={"UPC" + "-dropdown"}
                                            passChosenOption={handleUPCChange}
                                            columnName={"UPC " + index}
                                            defaultValue="Choose Product UPC...        " />
                                        {/* <Form.Control
                                            type="text"
                                            required
                                            value={product?.["UPC"]}
                                            onChange={(e) => handleProductChange(index, "UPC", e.target.value)}
                                        /> */}
                                    </td>
                                    <td className='text-md'>
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

        </>

    )
    else {
        fetchAllData();
        return null;
    }
};

export default Receipts;