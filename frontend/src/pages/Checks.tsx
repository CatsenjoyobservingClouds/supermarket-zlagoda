import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function Checks() {
    const rowData = {};
    const columnNames = ['Check', 'Employee', 'Card Number', 'Print Date', 'Total Sum', 'VAT'];
    const tableName= "Check";
    const endpoint = "";
    return (
        <main>
            <DatabaseComponent
                endpoint={endpoint}
                columnNames={columnNames}
                tableName={tableName} />
        </main>
    )
}