import React from 'react'
import DatabaseComponent from '../components/DatabaseComponent';

export default function Employees() {
    // Example data for row and column names
    const rowData = {};
    const columnNames = ['Full Name', 'Role', 'Salary', 'Date of Birth', 'Start Working Date', 'Phone Number', 'City', 'Street', 'Zip Code'];
    const endpoint = "jsxbhsbxhs";
    const tableName = "Employee";
    return (
        <main>
            <DatabaseComponent
                endpoint={endpoint}
                columnNames={columnNames}
                tableName={tableName} />
        </main>
    )
}