import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function StoreProducts() {
    const rowData = {};
    const columnNames = ['UPC', 'UPC Promotional', 'Product', 'Selling Price', 'Amount'];
    const tableName= "Product in the Store";
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