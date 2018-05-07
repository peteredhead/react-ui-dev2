import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

global.fetch = require('jest-fetch-mock');

window.requestAnimationFrame = () => {}

it('renders without crashing', () => {
    fetch.mockResponseOnce(JSON.stringify({}))
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});
