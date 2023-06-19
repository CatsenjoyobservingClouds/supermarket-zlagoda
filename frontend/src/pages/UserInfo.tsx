import React, { useState } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form, Alert } from 'react-bootstrap';
import RowComponent, { RowData } from '../components/RowComponent';
import axios from 'axios';
import { IIndexable } from '../App';
import { decodeData, encodeData } from './Employees';
import '../css-files/UserInfo.css';
import { BsEyeSlash, BsEye } from 'react-icons/bs';



interface UserInfoProps {
    onLogout: Function
}

export const editingColumnNames = ['Name', 'Surname', 'Patronymic', 'Date of Birth', 'Phone Number', 'City', 'Street', 'Zip Code'];
export const isRequired: IsRequired = { 'Patronymic': false }

interface IsRequired {
    [key: string]: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ onLogout }) => {
    const [userInfo, setUserInfo] = useState<RowData>({} as RowData);
    const [wrongNewData, setWrongNewData] = useState<boolean>(false);
    const [wrongNewDataModal, setWrongNewDataModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState(false);
    const [changedUserInfo, setChangedUserInfo] = useState<RowData>({} as RowData);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);



    const alertWrongNewData = wrongNewData === true && (
        <Alert variant="danger">Entered wrong data</Alert>
    );

    const fetchData = () => {
        axios.get("http://localhost:8080/self/", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(response => {
                const data = decodeData([response.data])[0]

                setUserInfo(data);
                setChangedUserInfo(data);
            })
            .catch(error => {
                onLogout();
                console.log("Error fetching data:", error);
            })
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSave = (e: any) => {
        let encodedRow = {} as IIndexable;
        try {
            encodedRow = encodeData([changedUserInfo])[0]
        } catch {
            setWrongNewData(true);
            return;
        }


        axios.patch("http://localhost:8080/self/", encodedRow,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
            .then(response => {
                setUserInfo(changedUserInfo)
                setWrongNewData(false)
                setIsEditing(false);
            })
            .catch(error => {
                setWrongNewData(true);
                console.log("Error adding new data:", error);
            });
    };

    const handleSaveCredentials = (e: any) => {
        let encodedRow = {} as IIndexable;
        try {
            encodedRow = encodeData([changedUserInfo])[0]
        } catch {
            setWrongNewData(true);
            return;
        }


        axios.patch("http://localhost:8080/self/", encodedRow,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
            .then(response => {
                setUserInfo(changedUserInfo)
                setWrongNewData(false)
                setIsEditing(false);
            })
            .catch(error => {
                setWrongNewData(true);
                console.log("Error adding new data:", error);
            });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWrongNewData(false);
        const { name, value } = e.target;
        setChangedUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value,
        }));
    };

    const handleEditModalClose = () => {
        setChangedUserInfo(userInfo);
        setShowChangePasswordModal(false);
    }

    const handlePasswordChange = () => {
        setChangedUserInfo(userInfo);
        setShowChangePasswordModal(true);
    };

    const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setWrongNewDataModal(false)
        setChangedUserInfo((prevData) => ({
            ...prevData,
            [key]: e.target.value,
        }));
    };

    if (userInfo["Id"] != null) {
        return (
            <div className={'content ' + (isEditing ? "mt-36" : "")}>
                <h1>{localStorage.getItem("role")} {localStorage.getItem("username")}</h1>
                <Form>
                    {editingColumnNames.map((column) => (
                        <Form.Group key={column}>
                            {isEditing ? (
                                <>
                                    <Form.Label>{(!isEditing || (isRequired[column] == false)) ? "" : "* "}{column}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={column}
                                        value={changedUserInfo[column]}
                                        placeholder={column.includes("Date") ? "dd.mm.yyyy" : ""}
                                        onChange={handleChange}
                                        required={isRequired[column] === false ? undefined : true}
                                        isInvalid={isRequired[column] != false && !changedUserInfo[column]}
                                    />
                                    {/* {isRequired[column] != false && !changedUserInfo[column] && (
                                        <Form.Control.Feedback type="invalid">
                                            Could not be empty
                                        </Form.Control.Feedback>
                                    )} */}
                                </>
                            ) : (
                                <>
                                    {userInfo[column] != "" ? (
                                        <>
                                            <Form.Label>{(!isEditing || (isRequired[column] == false)) ? "" : "* "}{column}</Form.Label>
                                            <Form.Text>{userInfo[column]}</Form.Text>
                                        </>)
                                        : (
                                            null
                                        )}
                                </>
                            )}
                        </Form.Group>
                    ))}
                </Form>

                {alertWrongNewData}

                <div>
                    <Button variant="primary" onClick={isEditing ? handleSave : handleEdit}>
                        {isEditing ? 'Save changes' : 'Edit info'}
                    </Button>{' '}
                    {isEditing ? (
                        <Button variant="secondary" onClick={() => { setIsEditing(false); setChangedUserInfo(userInfo) }}>
                            Go Back
                        </Button>
                    ) : (
                        <div>
                            <Button variant="secondary" onClick={handlePasswordChange}>
                                Change Account Credentials
                            </Button>
                        </div>
                    )}
                </div>

                <Modal show={showChangePasswordModal} onHide={handleEditModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Account Credentials</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId={`formusername`} key="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={changedUserInfo["Username"]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeUsername(e, "Username")}
                                isInvalid={!changedUserInfo["Username"]}
                            />
                            <Button></Button>
                        </Form.Group>
                        <Form.Group controlId={`formpassword`} key="password11">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder='Enter current password'
                            />
                        </Form.Group>
                        
                        <Form.Group controlId={`formpassword`} key="password21">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder='Repeat current password'
                            />
                        </Form.Group>
                        <Form.Group controlId={`formpassword`} key="password22">
                            <Form.Label>Password</Form.Label>
                            <div className='flex'>
                                <Form.Control
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder='Enter new password'
                                />
                                <Button
                                    variant="light"
                                    onClick={togglePasswordVisibility}
                                    id="password-toggle"
                                >
                                    {passwordVisible ? <BsEyeSlash /> : <BsEye />}
                                </Button>
                            </div>
                        </Form.Group>
                        {/* </>)
                        : null}
                    {columnNames.filter((name) => name != "Id" && name != "Card Number").map((columnName) => (
                        <Form.Group controlId={`form${columnName}`} key={columnName}>
                            <Form.Label>{columnName}</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedRow[columnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, columnName)}
                            />
                        </Form.Group> */}
                        {/* ))} */}
                    </Modal.Body>
                    {alertWrongNewData}
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleSaveCredentials}>
                            Save changes
                        </Button>
                        <Button variant="secondary" onClick={handleEditModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    } else {
        fetchData();
        return null;
    };
};


export default UserInfo;