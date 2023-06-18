import React from 'react';
import { Button } from 'react-bootstrap';
import { BsListTask, BsReceipt } from 'react-icons/bs';

const TodoButton = () => {
    return (
        <Button variant="info" size="sm" className="d-flex align-items-center">
            <BsListTask className="me-1" />
        </Button>
    );
};

interface ButtonProps {
    handleReceiptClick?: Function
}

export const ReceiptButton: React.FC<ButtonProps> = ({ handleReceiptClick }) => {
    return (
        <Button variant="info" size="sm" className="d-flex align-items-center"
            onClick={(e) => handleReceiptClick && handleReceiptClick()}>
            <BsReceipt className="me-1" />
        </Button>
    );
};
