import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';

export default function Checks() {

//без редагування та додавання - лише видал та звіт для менеджерів
//продавщики маю мати змогу робити  усе

    const rowData = {};
    const columnNames = ['Check', 'Employee', 'Card Number', 'Print Date', 'Total Sum', 'VAT'];
    const tableName= "Check";
    const endpoint = "";
    return (
        <main>
            <DatabaseComponent
                endpoint={endpoint}
                handleData={() => {}}
                columnNames={columnNames}
                tableName={tableName} />
        </main>
    )
}