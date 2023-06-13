import React from 'react'
import DatabaseComponent from '../components/DatabaseComponent';


export default function Employees() {
    // Example data for row and column names
    const columnNames = ['Surname', 'Name', 'Patronymic', 'Role', 'Salary', 'Date of Birth', 'Start Working Date', 'Phone Number', 'City', 'Street', 'Zip Code'];
    const endpoint = "http://localhost:8080/manager/employee";
    const tableName = "Employee";


    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            'id': item.id_employee,
            'Surname': item.empl_surname,
            'Name': item.empl_name,
            'Patronymic': item.empl_patronymic["String"],
            'Role': item.empl_role,
            'Salary': item.salary,
            'Date of Birth': new Date(item.date_of_birth).toLocaleDateString(),
            'Start Working Date': new Date(item.date_of_start).toLocaleDateString(),
            'Phone Number': item.phone_number,
            'City': item.city,
            'Street': item.street,
            'Zip Code': item.zip_code
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "id_employee": item["id"],
            "empl_surname": item["Surname"],
            "empl_name": item["Name"],
            "empl_patronymic": {
                "String" : (item["Patronymic"] ? item["Patronymic"] : ""),
                "Valid" : true
            },
            "empl_role": item["Role"],
            "salary": item["Salary"],
            "date_of_birth": item["Date of Birth"],
            "date_of_start": item["Start Working Date"],
            "phone_number": item["Phone Number"],
            "city": item["City"],
            "street": item["Street"],
            "zip_code": item["Zip Code"],
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