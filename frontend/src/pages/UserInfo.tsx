import React, { useState } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form, Alert } from 'react-bootstrap';
import RowComponent, { RowData } from '../components/RowComponent';
import axios from 'axios';



interface UserInfoProps {
    onLogout: Function
}

const UserInfo: React.FC<UserInfoProps> = ({ onLogout }) => {
    const [userInfo, setUserInfo] = useState<any>();
    const [wrongNewData, setWrongNewData] = useState<boolean>(false);


    const alertWrongNewData = wrongNewData === true && (
        <Alert variant="danger">Entered wrong data</Alert>
    );

    const fetchData = () => {
        axios.get("http://localhost:8080/self", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(response => {
                const data = response.data;
                setUserInfo(data);
            })
            .catch(error => {
                onLogout();
                console.log("Error fetching data:", error);
            })
    };

    if (userInfo["id_employee"] != null) {
        return (

            <Modal>
                <Modal.Header>
                    <Modal.Title>New {tableName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {columnNames.filter((name) => name != "Id" && name != "Card Number").map((columnName) => (
                        <Form.Group controlId={`form${columnName}`} key={columnName}>
                            <Form.Label>{columnName}</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedRow[columnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, columnName)}
                            />
                        </Form.Group>
                    ))}
                </Modal.Body>
                {alertWrongNewData}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        )
    } else {
        fetchData();
        return null;
    };
};




// return (
// <Modal show={showEditModal} onHide={handleEditModalClose}>
//         <Modal.Header closeButton>
//             <Modal.Title>New {tableName}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//             {tableName == "Employee" ? (
//                 <>
//                     <Form.Group controlId={`formusername`} key="username">
//                         <Form.Label>Username</Form.Label>
//                         <Form.Control
//                             type="text"
//                             value={editedRow["username"]}
//                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "username")}
//                         />
//                     </Form.Group>
//                     <Form.Group controlId={`formpassword`} key="password">
//                         <Form.Label>Password</Form.Label>
//                         <Form.Control
//                             type="text"
//                             value={editedRow["password"]}
//                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "password")}
//                         />
//                     </Form.Group>
//                 </>)
//                 : null}
//             {columnNames.filter((name) => name != "Id" && name != "Card Number").map((columnName) => (
//                 <Form.Group controlId={`form${columnName}`} key={columnName}>
//                     <Form.Label>{columnName}</Form.Label>
//                     <Form.Control
//                         type="text"
//                         value={editedRow[columnName]}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, columnName)}
//                     />
//                 </Form.Group>
//             ))}
//         </Modal.Body>
//         {alertWrongNewData}
//         <Modal.Footer>
//             <Button variant="secondary" onClick={handleEditModalClose}>
//                 Close
//             </Button>
//             <Button variant="primary" onClick={handleSave}>
//                 Save Changes
//             </Button>
//         </Modal.Footer>
//     </Modal>
// )


export default UserInfo;