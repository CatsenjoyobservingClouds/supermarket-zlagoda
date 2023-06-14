import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function StoreProducts() {
    const columnNames = ['UPC', 'UPC Promotional', 'Product', 'Selling Price', 'Amount'];
    const tableName= "Product in the Store";
    const endpoint = "http://localhost:8080/manager/storeProduct";

    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "Id": item.UPC,
            'UPC': item.UPC,
            'UPC Promotional': item.UPC_prom["String"],
            'Product': item.id_product,
            'Selling Price': item.selling_price,
            'Amount': item.products_number
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "UPC": item["UPC"],
            "UPC_prom": {
                "String" : (item["UPC Promotional"] ? item["UPC Promotional"] : ""),
                "Valid" : (item["UPC Promotional"] ? true : false)
            },
            "id_product": parseInt(item["Product"]),
            "selling_price": parseFloat(item["Selling Price"]),
            "products_number": parseInt(item["Amount"])
        }));
        return chosenData;
    }

    return (
        <main>
            <DatabaseComponent
                endpoint={endpoint}
                decodeData={decodeData}
                encodeData={encodeData}
                columnNames={columnNames}
                tableName={tableName} />
        </main>
    )
}