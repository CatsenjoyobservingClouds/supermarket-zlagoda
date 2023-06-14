import React from 'react'
import DatabaseComponent from '../components/DatabaseComponent';


export default function Employees() {
    const columnNames = ['Id', 'Surname', 'Name', 'Patronymic', 'Role', 'Salary', 'Date of Birth', 'Start Working Date', 'Phone Number', 'City', 'Street', 'Zip Code'];
    const endpoint = "http://localhost:8080/manager/employee";
    const tableName = "Employee";


    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            'Id': item.id_employee,
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
            'Zip Code': item.zip_code,
            'username': item.username,
            'password': item.password,
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "id_employee": item["Id"],
            "empl_surname": item["Surname"],
            "empl_name": item["Name"],
            "empl_patronymic": {
                "String" : (item["Patronymic"] ? item["Patronymic"] : ""),
                "Valid" : (item["Patronymic"] ? true : false)
            },
            "empl_role": item["Role"],
            "salary": parseInt(item["Salary"], 10),
            "date_of_birth": new Date(item["Date of Birth"]).toISOString(),
            "date_of_start": new Date(item["Start Working Date"]).toISOString(),
            "phone_number": item["Phone Number"],
            "city": item["City"],
            "street": item["Street"],
            "zip_code": item["Zip Code"],
            "username": item["username"], 
            "password": item["password"]
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