import React from 'react'
import DatabaseComponent from '../components/DatabaseComponent';


export default function Employees() {
    // Example data for row and column names
    const columnNames = ['Full Name', 'Role', 'Salary', 'Date of Birth', 'Start Working Date', 'Phone Number', 'City', 'Street', 'Zip Code'];
    const endpoint = "http://localhost:8080/manager/employee";
    const tableName = "Employee";
    // const [rows, setRows] = useState<RowData[]>([]);


    const handleData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            'id': data.indexOf(item),
            'Full Name': item.empl_surname + " " + item.empl_name + " " + item.empl_patronymic,
            'Role': item.empl_role,
            'Salary': item.salary,
            'Date of Birth': item.date_of_birth,
            'Start Working Date': item.date_of_start,
            'Phone Number': item.phone_number,
            'City': item.city,
            'Street': item.street,
            'Zip Code': item.zip_code
        }));
        return chosenData;
    }

    return (
        <main>
            <DatabaseComponent
                endpoint={endpoint}
                handleData={handleData}
                columnNames={columnNames}
                tableName={tableName} />
        </main>
    )
}