import React from 'react';
import '../css-files/Logo.css';


export default function Logo() {
    return (
        <svg className='logo-svg unselectable'>
            <symbol id="s-text">
                <text textAnchor="middle" x="50%" y="80%">ZL </text>
                <text textAnchor="middle" x="52%" y="80%">ZL </text>

            </symbol>

            <g className="g-ants">
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
            </g>
        </svg>
    )
}