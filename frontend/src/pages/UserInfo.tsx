import React, { useState } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Modal, Form, Alert, Col, Row } from 'react-bootstrap';
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
    const [changePassword, setChangePassword] = useState(false);
    const [passwords, setPasswords] = useState<any>({} as any);
    const [error, setError] = useState<string>("Entered wrong data");



    const alertWrongNewData = wrongNewData === true && (
        <Alert variant="danger">{error?.charAt(0).toUpperCase() + error?.slice(1)}</Alert>
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
                console.log(sessionStorage.getItem("jwt"))
                setChangedUserInfo(data);
                setPasswords((prev: any) => ({
                    ...prev,
                    ["newUsername"]: data["Username"]
                }))
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
                setError(error.response?.data["error"]);
                setWrongNewData(true);
                console.log("Error adding new data:", error);
            });
    };

    const handlePasswordsChanges = (e: any) => {
        setWrongNewData(false);
        setPasswords((prev: any) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }

    const handleSaveCredentials = (e: any) => {
        if (changePassword) {
            if (passwords["oldPassword"] != passwords["oldPassword1"]) {
                setError("Current passwords do not match");
                setWrongNewData(true);
                return;
            }
        }

        const credentials = Object.fromEntries(Object.entries(passwords).filter(([_, v]) => v != null && v != ""))


        axios.patch("http://localhost:8080/self/credentials", credentials,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
            .then(response => {
                setChangePassword(false);
                setWrongNewData(false);
                setIsEditing(false);
                fetchData();
                setShowChangePasswordModal(false);
            })
            .catch(error => {
                setError(error.response?.data["error"]);
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
        setPasswords((prev: any) => ({
            ["newUsername"]: userInfo["Username"]
        }));
        setChangePassword(false);
        setChangedUserInfo(userInfo);
        setShowChangePasswordModal(false);
        setWrongNewData(false);
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
            <div className={'content ' + (isEditing ? "mt-48 mb-2" : "")}>
                <h1 className='mb-10'>{localStorage.getItem("role")} {localStorage.getItem("username")}</h1>
                <Form className={isEditing ? 'info-form' : ""}>
                    {editingColumnNames.map((column) => (
                        <Form.Group key={column} className='info-group'>
                            {isEditing ? (
                                <>
                                    <Form.Label>{(!isEditing || (isRequired[column] == false)) ? "" : "* "}{column} </Form.Label>
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
                                        <Row>
                                            <Col className="text-right">
                                                <Form.Label className="font-semibold text-lg pb-2">
                                                    {(!isEditing || (isRequired[column] === false)) ? "" : "* "}
                                                    {column}
                                                    {': \t'}
                                                </Form.Label>
                                            </Col>
                                            <Col className="text-left">
                                                <Form.Label className="font-semibold text-lg pb-2">
                                                    {userInfo[column]}
                                                </Form.Label>
                                            </Col>
                                        </Row>)
                                        : (
                                            null
                                        )}
                                </>
                            )}
                        </Form.Group>
                    ))}
                </Form>

                {alertWrongNewData && isEditing}

                <div>
                    {isEditing ? (
                        <>
                            <Button variant="primary" onClick={handleSave} className="darker-color mt-1.5 mb-3">
                                Save changes
                            </Button>{' '}
                            <Button variant="secondary" onClick={() => { setIsEditing(false); setChangedUserInfo(userInfo) }} className='mt-2 mb-3'>
                                Go Back
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="primary" onClick={handleEdit} className="darker-color mt-2.5 mb-1">
                                Edit Info
                            </Button>{' '}
                            <div>
                                <Button variant="secondary" onClick={handlePasswordChange} className='mt-1.5'>
                                    Change Account Credentials
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                <Modal show={showChangePasswordModal} onHide={handleEditModalClose} >
                    <Modal.Header closeButton>
                        <Modal.Title>New Account Credentials</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId={`newUsername`} key="formusername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={passwords["newUsername"]}
                                onChange={handlePasswordsChanges}
                                isInvalid={!passwords["newUsername"]}
                            />
                            <Form.Group controlId={`oldPassword`} key="formpassword1">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder='Enter current password to change credentials'
                                    value={passwords["oldPassword"]}
                                    onChange={handlePasswordsChanges}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={(e) => setChangePassword((prev) => !prev)} className='darker-color mb-4'>
                                Change password
                            </Button>
                        </Form.Group>
                        {changePassword &&
                            <>
                                <Form.Group controlId={`oldPassword1`} key="formpassword2">
                                    <Form.Label>Repeat Old Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder='Repeat current password'
                                        value={passwords["oldPassword1"]}
                                        onChange={handlePasswordsChanges}
                                    />
                                </Form.Group>
                                <Form.Group controlId={`newPassword`} key="formpassword3">
                                    <Form.Label> New Password</Form.Label>
                                    <div className='flex'>
                                        <Form.Control
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder='Enter new password'
                                            value={passwords["newPassword"]}
                                            onChange={handlePasswordsChanges}
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
                            </>
                        }
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
                        <Button variant="success" onClick={handleSaveCredentials}>
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