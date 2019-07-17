import React from "react";
import logo from '../resources/github-character.svg';

const Intro = () => {
    const text =
        "'#'- represents walls, " +
        "'s'- represents start, " +
        "'D' - represents goal";

    const examples = 'https://github.com/daysleeperx/Learning-A-Star-with-React/tree/master/src/resources';
    const gitHubLink = 'https://github.com/daysleeperx';

    return (
        <div className="card" style={{width: '18rem', border: '1px solid #007bff', margin: 'auto'}}>
            <div className="card-body" style={{background: 'black', color: '#007bff'}}>
                <h5 className="card-title">Upload a .txt file</h5>
                <h6 className="card-subtitle mb-2 text-muted">Format:</h6>
                <p className="card-text">{text}</p>
                <a href={examples} className="card-link link">Examples</a>
                <a href={gitHubLink} className="card-link link">
                    <img className={'logo'} src={logo} style={{width: '1.5em'}}/>
                </a>
            </div>
        </div>
    );
};

export { Intro };

