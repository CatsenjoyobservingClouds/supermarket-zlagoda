import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function Sales() {
    const rowData = {};
    const columnNames = ['UPC', 'Check Number', 'Product', 'Selling Price'];
    const tableName= "Sale";
    const endpoint = "";
    return (
        <main>
            <DatabaseComponent
                endpoint={endpoint}
                decodeData={() => {}}
                encodeData={() => {}}
                columnNames={columnNames}
                tableName={tableName} />
        </main>
    )
}