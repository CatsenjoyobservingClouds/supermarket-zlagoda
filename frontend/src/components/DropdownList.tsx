import React, { useState } from 'react';
import { Dropdown, FormControl, ListGroup, DropdownButton } from 'react-bootstrap';
import Select, { GroupBase } from 'react-select';
import { getAllItemsForDropListCategories } from '../pages/Products';
import { getAllItemsForDropListProducts } from '../pages/StoreProducts';

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
    } else {
      try {
        items = await getAllItemsForDropListCategories();
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


  if (values.length != 0) {
    return (
      <Select
        className={multiValue ? '' : 'mb-3'}
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