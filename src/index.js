import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

const PADS = [
    {name: "zero", value: "0"},
    {name: "one", value: "1"},
    {name: "two", value: "2"},
    {name: "three", value: "3"},
    {name: "four", value: "4"},
    {name: "five", value: "5"},
    {name: "six", value: "6"},
    {name: "seven", value: "7"},
    {name: "eight", value: "8"},
    {name: "nine", value: "9"},
    {name: "add", value: "+"},
    {name: "subtract", value:"-"} ,
    {name: "multiply", value: "*"},
    {name: "divide", value: "/"},
    {name: "decimal", value: "."},
    {name: "clear", value: "AC"},
    {name: "equals", value: "="}
  ]
  

ReactDOM.render(<App  pads={PADS}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
