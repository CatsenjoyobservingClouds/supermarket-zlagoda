import React from 'react'
import DatabaseComponent from '../components/DatabaseComponent';
import axios from 'axios';

export async function getAllItemsForDropListCategories() {
    try {
      const response = await axios.get("http://localhost:8080/" + localStorage.getItem("role")?.toLowerCase() + "/category" + "/", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('jwt')
        }
      });
      const data = response.data;
      const chosenData = data.map((item: any) => ({
        'Category Id': item.category_number,
        'Category': item.category_name
      })) as any[];
      console.log(chosenData);
      return chosenData;
    } catch (error) {
      localStorage.setItem("role", "");
      console.log("Error fetching data:", error);
      return [] as any[];
    }
  }

export default function Products() {
    const rowData = {};
    const columnNames = ['Id', 'Product', 'Category', 'Characteristics'];
    const columnNamesChange = ['Product', 'Category', 'Characteristics'];
    const tableName= "Product";
    const endpoint = "http://localhost:8080/" + localStorage.getItem("role")?.toLowerCase() + "/product";

    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            'Id': item.id_product,
            'Product': item.product_name,
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
            "product_name": item["Product"],
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
                columnNamesChange={columnNamesChange}
                tableName={tableName} />
        </main>
    )
}