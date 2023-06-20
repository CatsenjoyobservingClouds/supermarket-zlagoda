import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';
import axios from 'axios';

export const decodeData = (data: any[]) => {
    const chosenData = data.map((item) => ({
        'Id': item.category_number,
        'Category': item.category_name
    }));
    return chosenData;
}

export const decodeData2 = (data: any[]) => {
    const chosenData = data.map((item) => ({
        'Id': item.category_number,
        'Category': item.category_name,
        'Average Price': item.average_price
    }));
    return chosenData;
}

export const encodeData = (data: any[]) => {
    const chosenData = data.map((item) => ({
        "category_number": item["Id"],
        "category_name": item["Category"]
    }));
    return chosenData;
}

// export const handleAveragePrice = async (asc: boolean) => {
//     // if (e.target.checked) {
//     const toAsc = asc ? "ASC" : "DESC";
//     return await axios.get("http://localhost:8080/manager/analytics/averagePricePerCategory?decimalPlaces=2&orderBy=" + "category_name" + "&ascDesc=" + toAsc, {
//         headers: {
//             "Authorization": "Bearer " + localStorage.getItem('jwt')
//         }
//     })
//     // }
// }

export default function Categories() {
    const rowData = {};
    const columnNames = ['Id', 'Category', 'Average Price'];
    const columnNamesChange = ['Category'];
    const tableName= "Category";
    const endpoint = "http://localhost:8080/manager/category";
    
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