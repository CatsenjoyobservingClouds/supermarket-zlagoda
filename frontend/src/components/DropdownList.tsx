import React, { useState } from 'react';
import { Dropdown, FormControl, ListGroup } from 'react-bootstrap';

const DropdownList = (passChosenOption: any, items: any[]) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedItem, setSelectedItem] = useState('');


  // Filter items based on search value
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle item selection
  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    passChosenOption(item);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-list">
        {selectedItem ? selectedItem : 'Select Item'}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <FormControl
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearchChange}
        />
        <ListGroup>
          {filteredItems.map(item => (
            <ListGroup.Item
              key={item}
              active={item === selectedItem}
              onClick={() => handleItemSelect(item)}
            >
              {item}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownList;