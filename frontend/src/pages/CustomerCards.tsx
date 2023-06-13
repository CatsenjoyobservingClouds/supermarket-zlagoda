import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function CustomerCards() {
    const rowData = {};
    const columnNames = ['Card Number', 'Full Name', 'Phone Number', 'City', 'Street', 'Zip Code', 'Discount Percent'];
    const tableName= "Customer Card";
    const endpoint = "";
    return (
        <main>
            <DatabaseComponent
                endpoint={endpoint}
                handleData={() => {}}
                columnNames={columnNames}
                tableName={tableName} />
        </main>
    )
}