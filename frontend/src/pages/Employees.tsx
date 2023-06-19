import React from 'react'
import DatabaseComponent from '../components/DatabaseComponent';
import { parse, format } from 'date-fns';

export const decodeData = (data: any[]) => {
    const chosenData = data.map((item) => ({
        'Id': item.id_employee,
        'Username': item.username,
        'Full Name': item.empl_surname + " " + item.empl_name + " " + item.empl_patronymic["String"],
        'Name': item.empl_name,
        'Surname': item.empl_surname, 
        'Patronymic': item.empl_patronymic["String"],
        'Role': item.empl_role,
        'Salary': parseInt(item.salary),
        'Date of Birth': new Date(item.date_of_birth).toLocaleDateString(),
        'Start Working Date': new Date(item.date_of_start).toLocaleDateString(),
        'Phone Number': item.phone_number,
        'City': item.city,
        'Street': item.street,
        'Zip Code': item.zip_code,
        'password': item.password,
    }))
    return chosenData;
};

export const encodeData = (data: any[]) => {
    const chosenData = data.map((item) => ({
        "id_employee": item["Id"],
        "empl_surname": item["Surname"],
        "empl_name": item["Name"],
        "empl_patronymic": {
            "String" : (item["Patronymic"] ? item["Patronymic"] : ""),
            "Valid" : (item["Patronymic"] ? true : false)
        },
        "empl_role": item["Role"],
        "salary": parseFloat(item["Salary"]),
        "date_of_birth": parse(item["Date of Birth"], 'dd.MM.yyyy', new Date()).toISOString(),
        "date_of_start":parse(item["Start Working Date"], 'dd.MM.yyyy', new Date()).toISOString(),
        "phone_number": item["Phone Number"],
        "city": item["City"],
        "street": item["Street"],
        "zip_code": item["Zip Code"],
        "username": item["Username"], 
        "password": item["password"]
    }));
    console.log("fine")
    return chosenData;
}

export const columnNames = ['Id', 'Username', 'Full Name', 'Role', 'Salary', 'Date of Birth', 'Start Working Date', 'Phone Number', 'City', 'Street', 'Zip Code'];

export default function Employees() {
    const columnNamesChange = ['Name', 'Surname', 'Patronymic', 'Role', 'Salary', 'Date of Birth', 'Start Working Date', 'Phone Number', 'City', 'Street', 'Zip Code'];
    
    const endpoint = "http://localhost:8080/manager/employee";
    const tableName = "Employee";


    return (
        <main>
            <DatabaseComponent
                endpoint={endpoint}
                decodeData={decodeData}
                encodeData={encodeData}
                columnNames={columnNames}
                columnNamesChange = {columnNamesChange}
                tableName={tableName} />
        </main>
    )
}