import React from "react";

const Square = ({value}) => {
    const getSquareClass = (value) => {
        switch (value) {
            case 's':
            case 'D':
            case 'p':
                return 'path';
            case '*':
                return 'lava';
            case 'v':
                return 'visited';
            default:
                return 'square';
        }
    };

    return (
        <button className={getSquareClass(value)}>

        </button>
    );
};

export { Square };