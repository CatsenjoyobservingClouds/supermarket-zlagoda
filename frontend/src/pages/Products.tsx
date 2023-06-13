import React from 'react'
import DatabaseComponent from '../components/DatabaseComponent';

export default function Products() {
    const rowData = {};
    const columnNames = ['Name', 'Category', 'Characteristics'];
    const tableName= "Product";
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