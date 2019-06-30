import React from "react";

export default class Square extends React.Component {

    static getSquareClass(value) {

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
    }

    render() {
        return (
            <button className={Square.getSquareClass(this.props.value)}>

            </button>
        );
    }
}