import React from 'react';
import { FaStar } from 'react-icons/fa';
import '../css-files/StarButton.css';


const StarButton = () => {
    return (
        <button className="btn btn-primary star-button d-flex align-items-center justify-content-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Happy Customers: Find out who was served by all our cashiers!">
            <FaStar />
        </button>
    );
};

export default StarButton;