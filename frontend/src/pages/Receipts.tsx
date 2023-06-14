import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function Receipts() {

//без редагування та додавання - лише видал та звіт для менеджерів
//продавщики маю мати змогу робити  усе

    const columnNames = ['Receipt', 'Employee', 'Card Number', 'Print Date', 'Total Sum', 'VAT'];
    const tableName= "Receipt";
    const endpoint = "http://localhost:8080/manager/check";

    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            'Id': item.check_number,
            'Receipt': item.check_number,
            'Employee': item.id_employee,
            'Card Number' : item.card_number["String"],
            'Print Date' : new Date(item.print_date).toLocaleString(),
            'Total Sum': item.sum_total,
            'VAT': item.vat
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "check_number": item["Receipt"],
            "id_employee": item['Employee'],
            "card_number": {
                "String" : (item["Card Number"] ? item["Card Number"] : ""),
                "Valid" : (item["Card Number"] ? true : false)
            },
            "print_date": new Date(item["Print Date"]).toISOString(),
            "sum_total": item["Total Sum"],
            "vat": item["VAT"]
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