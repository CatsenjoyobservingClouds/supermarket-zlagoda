import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function CustomerCards() {
    const columnNames = ['Card Number', 'Surname', 'Name', 'Patronymic', 'Phone Number', 'City', 'Street', 'Zip Code', 'Discount Percent'];
    const tableName= "Customer";
    const endpoint = "http://localhost:8080/manager/customerCard";

    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "Id": item.card_number,
            'Card Number': item.card_number,
            'Surname': item.cust_surname,
            'Name': item.cust_name,
            'Patronymic': item.cust_patronymic["String"],
            'Phone Number': item.phone_number,
            'City': item.city["String"],
            'Street': item.street["String"],
            'Zip Code': item.zip_code["String"],
            'Discount Percent': item.percent
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            'card_number': item["Card Number"],
            'cust_surname': item["Surname"],
            'cust_name': item["Name"],
            'cust_patronymic': {
                "String" : (item["Patronymic"] ? item["Patronymic"] : ""),
                "Valid" : (item["Patronymic"] ? true : false)
            },
            'phone_number': item["Phone Number"],
            'city': {
                "String" : (item["City"] ? item["City"] : ""),
                "Valid" : (item["City"] ? true : false)
            },
            'street': {
                "String" : (item["Street"] ? item["Street"] : ""),
                "Valid" : (item["Street"] ? true : false)
            },
            'zip_code': {
                "String" : (item["Zip Code"] ? item["Zip Code"] : ""),
                "Valid" : (item["Zip Code"] ? true : false)
            },
            'percent': parseInt(item["Discount Percent"])
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