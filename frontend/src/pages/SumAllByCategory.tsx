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




//без редагування та додавання - лише видал та звіт для менеджерів
//продавщики маю мати змогу робити  усе

const SumAllByCategory = () => {
    const columnNames = ['Id', 'Cashier Surname', 'Amount Sold'];
    // const columnNamesChange = ['Receipt Number', 'Employee Full Name', 'Customer Full Name', 'Card Number', 'Print Date'];

    const tableName = "Units Sold by Category";
    const endpoint = "http://localhost:8080/" + localStorage.getItem("role")?.toLowerCase() + "/check";

    const decodeData = (data: any) => {
        const chosenData = data.map((item: any) => ({
            'Id': item.id_employee,
            'Cashier Surname': item.empl_surname,
            'Amount Sold': item.units_sold
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
    const [dateRange, setDateRange] = useState<any>({ "From": new Date().toLocaleDateString(), "To": new Date().toLocaleDateString() })


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

    const filterByCategory = (opt: any, columnName: any) => {
        if (opt == null) {
            setCategory(4)
            fetchAllData(4);
            return
        }
        setCategory(opt?.value)

        fetchAllData(opt?.value);
    };




            // setFilteredRows(filteredRows.filter(
            //     (row) => (row["Print Date"] < dateRange["To"] && row["Print Date"] > dateRange["From"]));
            // ))

            // setFilteredRows(rows.filter(
            //     (row) => (row["Role"].includes(e.target.id))
            // ))
        // }

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
                fetchAllData(4);
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


    const [category, setCategory] = useState<any>(4);
    const fetchAllData = (category: any) => {
        axios.get("http://localhost:8080/manager/analytics/categorySalesPerCashier?category_number=" + category, {
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

    // const fetchDataCashier = () => {
    //     axios.get("http://localhost:8080/self/", {
    //         headers: {
    //             "Authorization": "Bearer " + localStorage.getItem('jwt')
    //         }
    //     })
    //         .then(response => {
    //             return response?.data["id_employee"]
    //         })
    //         .catch(error => {
    //             console.log("Error fetching data:", error);
    //         })
    // };


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

    const sortAsNumber = ["Salary, UAH", "Discount Percent", "Average Price", "Id", "Selling Price, UAH", "Amount", "UPC", "Phone Number", "Amount Sold"]
    const handleSort = (key: string) => {
        if (sortedBy === key) {
            setAsc((prev) => !prev)
            setFilteredRows((prevRows) => [...prevRows].reverse());
        } else {
            if (key == "Id") {
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
        if (opt == null) {
            setFilteredRows(rows)
            return
        }
        const employees = opt?.value
        setFilteredRows(filteredRows.filter(
            (row) => (employees?.includes(row["Id Employee"]))
        ))
    };


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
            <div className={'database-container padding-for-elements max-width-50'}>
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
                        <DropdownList key={"Category" + "-dropdown"}
                            passChosenOption={filterByCategory}
                            columnName={"Category"}
                            defaultValue={"Snacks   "}
                        />
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
                                />
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div >
        </>
    )
    else {
        fetchAllData(4);
        return null;
    }
};

export default SumAllByCategory;