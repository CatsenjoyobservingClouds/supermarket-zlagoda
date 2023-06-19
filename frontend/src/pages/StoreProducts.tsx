import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function StoreProducts() {
    const columnNames = ['UPC', 'Promotional', 'Product', 'Selling Price', 'Amount'];
    const tableName= "Product in the Store";
    const endpoint = "http://localhost:8080/manager/storeProduct";

    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "Id": item.UPC,
            'UPC': item.UPC,
            'UPC Promotional': item.UPC_prom["String"],
            'Promotional': item.UPC_prom["Valid"],
            'Product': item.product_name,
            'Product Id': item.id_product,
            'Selling Price': item.selling_price + " UAH",
            'Amount': item.products_number
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "UPC": item["UPC"],
            "promotional_product": item["Promotional"],
            "id_product": parseInt(item["Product Id"]),
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
                columnNamesChange={columnNames}
                tableName={tableName} />
        </main>
    )
}