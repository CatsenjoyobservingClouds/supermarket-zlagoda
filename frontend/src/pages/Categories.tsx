import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function Categories() {
    const rowData = {};
    const columnNames = ['Id', 'Name'];
    const columnNamesChange = ['Name'];
    const tableName= "Category";
    const endpoint = "http://localhost:8080/manager/category";

    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            'Id': item.category_number,
            'Name': item.category_name
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "category_number": item["Id"],
            "category_name": item["Name"]
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
                columnNamesChange={columnNamesChange}
                tableName={tableName} />
        </main>
    )
}