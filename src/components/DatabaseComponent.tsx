import React, { useState, useEffect } from 'react';
import { Container, Table, Button, InputGroup, FormControl } from 'react-bootstrap';
import { BsSearch, BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import RowComponent, { RowData } from './RowComponent';
import '../css-files/DatabaseComponent.css';

interface DatabaseComponentProps {
    endpoint: string; // Backend API endpoint to fetch data from
    columnNames: string[]; // Array of column names
    tableName: string;
}

const DatabaseComponent: React.FC<DatabaseComponentProps> = ({ endpoint, columnNames, tableName }) => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [sortedBy, setSortedBy] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // fetchData();
        setRows([{ id: 1, name: 'John Doe', age: 30 }, { id: 2, name: 'Anna Doe', age: 20 }, { id: 3, name: 'Anton Doe', age: 10 }])
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            setRows(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEditRow = (id: number, newData: RowData) => {
        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.id === id) {
                    return { ...row, ...newData };
                }
                return row;
            })
        );
    };

    const handleDeleteRow = (id: number) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
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

    return (
        <Container>
            <Container className='database-operations'>
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
                <Button variant="success" onClick={handleAddRow}>
                    Add New {tableName}
                </Button>
                <Button variant="secondary">
                    Print Documents
                </Button>
            </Container>
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
        </Container >
    );
};

export default DatabaseComponent;