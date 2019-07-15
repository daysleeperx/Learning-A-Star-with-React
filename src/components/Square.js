import React from "react";

const Square = ({value, style}) => {
    const getSquareClass = (value) => {
        switch (value) {
            case 's':
            case 'p':
            case 'D':
                return 'path';
            case '*':
                return 'lava';
            case 'v':
                return 'visited';
            default:
                return '';
        }
    };

    return (
        <div className={'square ' + getSquareClass(value)} style={style}>
        </div>
    );
};

export { Square };