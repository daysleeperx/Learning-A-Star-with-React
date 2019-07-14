import React from "react";

const Square = ({value}) => {
    const getSquareClass = (value) => {
        switch (value) {
            case '*':
                return 'lava';

            case 'v':
                return 'visited';

            case 'p':
                return 'path';

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