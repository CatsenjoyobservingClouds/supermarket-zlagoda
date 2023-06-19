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
            'Name': item.product_name,
            'Category Id': item.category_number,
            'Category': item.category_name,
            'Characteristics': item.characteristics
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "id_product": item["Id"],
            "category_number": parseInt(item["Category Id"]),
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
                columnNamesChange={columnNames}
                tableName={tableName} />
        </main>
    )
}