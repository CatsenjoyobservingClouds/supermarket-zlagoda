import React, { useState } from 'react';
import { Dropdown, FormControl, ListGroup, DropdownButton } from 'react-bootstrap';
import Select, { GroupBase } from 'react-select';
import { getAllItemsForDropListCategories } from '../pages/Products';
import { getAllItemsForDropListProducts } from '../pages/StoreProducts';
import axios from 'axios';


interface DropListComponentProps {
  passChosenOption: any;
  columnName: string;
  defaultValue?: any;
  multiValue?: boolean
}

const DropdownList: React.FC<DropListComponentProps> = ({ passChosenOption, columnName, defaultValue, multiValue }) => {
  const [defaultItem, setDefaultItem] = useState(defaultValue);
  const [values, setValues] = useState<any[]>([]);

  const loadValues = async () => {
    let items = [] as any[];

    if (columnName === "Product") {
      try {
        items = await getAllItemsForDropListProducts();
      } catch (error) {
        console.log(error)
      }
    } else if (columnName === "Category") {
      try {
        items = await getAllItemsForDropListCategories();
      } catch (error) {
        console.log(error)
      }
    }  else if (columnName === "Customer") {
      try {
        items = await getAllItemsForDropListCustomers();
      } catch (error) {
        console.log(error)
      }
    } else if (columnName.includes("UPC")) {
      try {
        console.log("trying")
        items = await getAllItemsForDropListUPC();
        const values = items?.map((item: any) => ({
          'label': item["UPC"],
          'value': item["UPC" + " Id"]
        }));
        setValues(values);
        return;
      } catch (error) {
        console.log(error)
      }
    } else if (columnName === "Employee"){
      try {
        items = await getAllItemsForDropListEmployees();
      } catch (error) {
        console.log(error)
      }
    }

    const values = items?.map((item: any) => ({
      'label': item[columnName],
      'value': item[columnName + " Id"]
    }));
    setValues(values);
  };

  async function getAllItemsForDropListCustomers() {
    try {
      const response = await axios.get("http://localhost:8080/cashier/customerCard" + "/", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('jwt')
        }
      });
      const data = response.data;
      const chosenData = data.map((item: any) => ({
        'Customer Id': item.card_number,
        'Customer': item.cust_name + " " + item.cust_surname + " " + item.cust_patronymic["String"] + " (" + item.card_number + ")"
      })) as any[];
      return chosenData;
    } catch (error) {
      return [] as any[];
    }
  }

  async function getAllItemsForDropListEmployees() {
    try {
      const response = await axios.get("http://localhost:8080/manager/employee" + "/", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('jwt')
        }
      });
      const data = response.data;
      const chosenData = data.map((item: any) => ({
        'Employee Id': item.id_employee,
        'Employee': item.empl_name + " " + item.empl_surname
      })) as any[];
      return chosenData;
    } catch (error) {
      return [] as any[];
    }
  }

  async function getAllItemsForDropListUPC() {
    try {
      const response = await axios.get("http://localhost:8080/cashier/storeProduct" + "/", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('jwt')
        }
      });
      const data = response.data;
      const chosenData = data.map((item: any) => ({
        'UPC Id': item.UPC,
        'UPC': item.UPC + " (" + item.product_name + ")"
      })) as any[];
      return chosenData;
    } catch (error) {
      console.log("error")
      return [] as any[];
    }
  }


  if (values.length != 0) {
    return (
      <Select
        className={((multiValue || columnName == "Employee" || defaultValue == "Snacks   ") ? '' : 'mb-3 ') + (columnName=="From" || columnName=="To" ? " w-24 " : "")}
        isMulti={multiValue}
        options={values}
        placeholder={defaultValue}
        onChange={opt => passChosenOption(opt, columnName)}
        key={columnName + "select"}
        isClearable={true}
        isSearchable={true}
        maxMenuHeight={160}
      />
    )
  } else {
    loadValues();
    return null;
  }
};


export default DropdownList;