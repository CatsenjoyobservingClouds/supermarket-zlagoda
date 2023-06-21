import React from 'react';
import DatabaseComponent from '../components/DatabaseComponent';
import axios from 'axios';

export async function getAllItemsForDropListProducts() {
    try {
      const response = await axios.get("http://localhost:8080/" + localStorage.getItem("role")?.toLowerCase() + "/product" + "/", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('jwt')
        }
      });
      const data = response.data;
      const chosenData = data.map((item: any) => ({
        'Product Id': item.id_product,
        'Product': item.product_name
      })) as any[];
      console.log(chosenData);
      return chosenData;
    } catch (error) {
      localStorage.setItem("role", "");
      console.log("Error fetching data:", error);
      return [] as any[];
    }
}

export default function StoreProducts() {
    const columnNames = ['UPC', 'Promotional', 'Product', 'Product Info', 'Selling Price, UAH', 'Amount'];
    const columnNamesChange = ['UPC', 'Promotional', 'Product', 'Selling Price, UAH', 'Amount'];
    const tableName= "Product in the Store";
    const endpoint = "http://localhost:8080/" + localStorage.getItem("role")?.toLowerCase() + "/storeProduct";

    const decodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "Id": item.UPC,
            'UPC': item.UPC,
            'UPC Promotional': item.UPC_prom["String"],
            'Promotional': item.UPC_prom["Valid"],
            'Product': item.product_name,
            'Product Id': item.id_product,
            'Product Info': item.category_name + ", " + item.characteristics,
            'Selling Price, UAH': item.selling_price.toFixed(2),
            'Amount': item.products_number
        }));
        return chosenData;
    }

    const encodeData = (data: any[]) => {
        const chosenData = data.map((item) => ({
            "UPC": item["UPC"],
            "promotional_product": item["Promotional"],
            "id_product": parseInt(item["Product Id"]),
            "selling_price": parseFloat(item["Selling Price, UAH"]),
            "products_number": parseInt(item["Amount"])
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