import React from 'react'
import DatabaseComponent from '../components/DatabaseComponent';

export default function Products() {
    const rowData = {};
    const columnNames = ['Name', 'Category', 'Characteristics'];
    const tableName= "Product";
    const endpoint = "http://localhost:8080/manager/product";

    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            'Id': item.id_product,
            'Category': item.category_number,
            'Name': item.product_name,
            'Characteristics': item.characteristics
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "id_product": item["Id"],
            "category_number": parseInt(item["Category"]),
            "product_name": item["Name"],
            "characteristics": item["Characteristics"]
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