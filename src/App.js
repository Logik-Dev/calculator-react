import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: #fff;
  padding-top: 2rem;
  display: flex;
  align-items: center;
`
const OuterCalc = styled.div`
  padding: 3px 5px;
  border-radius: 6px;
  border: 1px grey solid;
  width: 370px;
  background-color: #333;
  margin: 0 auto;
  box-shadow: 5px 5px 10px rgba(0,0,0,.5);
`
const Calculator = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 2px;
  border: 2px lightgrey solid;
  border-radius: 5px;
  background-color: #aaa;
`
const Display = styled.div`
  margin: -1px;
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  margin-bottom: 1px;
  font-size: 2rem;
  font-family: 'Orbitron', serif;
  color: #22dd22cc;
  border-radius: 5px 5px 0 0;
  border: 1px #999 solid;
  border-bottom: 1px #ddd solid;
  grid-column: 1/6;
  height: 105px;
  background-color: #222;
  width: 100%;
  overflow: hidden;
  .operation{
    margin: 10px;
    font-size: .7rem;
    font-weight: 700;
    color: #ccc;
    height: 30px;
  }
  .display{
    text-align: right;
    height: 75px;
  }
`
const Pad = styled.div`
  grid-column: ${props => props.id === "equals" ? "2/6" : "auto"};
  font-family: monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  color: #ccc;
  font-size: 2.4rem;
  font-weight: 500;
  text-shadow: 1px 1px 0 rgba(0,0,0,.6);
  border-radius: 2px;
  border: 1px #aaa solid;
  box-shadow: 0 0 5px rgba(0,0,0,.5);
  background-image: radial-gradient(ellipse, #6c6e71, #75777a, #7f8083, #888a8d, #929396);
  &:active{
    transform: scale(.95);
    /* box-shadow: none; */
    transition: transform .2s, box-shadow .2s;
  }
`
export default function App(props){
  const [currentDisplay, setCurrentDisplay] = useState("0");
  const [currentOperation, setCurrentOperation] = useState("");
  const [evaluated, setEvaluated] = useState(false);
  const operators = ['*', '/', '+', '='];


  // manage too long display
  useEffect(() => {
    if(currentDisplay.length > 18){
      console.log(currentDisplay);
      let nextDisplay = currentDisplay.substring(0, 16) + "...";
      setCurrentDisplay(nextDisplay);
    }
  }, [currentDisplay])

  // AC pressed reset
  function reset(){
    setCurrentDisplay('0')
    setCurrentOperation("");
    setEvaluated(false);
  }
  function manageMinusClick(){
      let lastCharOfOperation = currentOperation.substring(currentOperation.length - 1);
      // if there are two minus consecutive  do return
      if(currentDisplay === "-" && lastCharOfOperation === "-"){
        return;
      }
      // if current display is minus or operator
      else if(currentDisplay === "-" || isAnOperator(currentDisplay)){
        setCurrentOperation(currentOperation+" -");
        setCurrentDisplay("-");
      }
      else {
        // if operation is not started
        if(currentDisplay === "0"){
          setCurrentOperation("-");
          setCurrentDisplay("-");
        }
        else {
          setCurrentOperation(currentOperation+"  -");
          setCurrentDisplay("-");
        }

      }
  }
  // operator clicked
  function manageOperatorClick(operator){
    // an operation has been evaluated 
    if(evaluated){
      let operationTab = currentOperation.split(" ");
      let lastResult = operationTab[operationTab.length - 1];
      setCurrentOperation(lastResult + " " + operator); // total of last operation is now first number of operation
      setCurrentDisplay(operator);
      setEvaluated(false);
    }
    // no evaluated operation
    else {

      // if operation started
      if(currentDisplay !== "0"){
        let lastChar = currentOperation.substr(-1);
        let beforeLastChar = currentOperation.substr(-3, 1);
        // if lastChar is an operator replace it 
        if(isAnOperator(lastChar) || lastChar === "-"){
          let nextOperation;
          if(isAnOperator(beforeLastChar) || beforeLastChar === "-"){
            nextOperation = currentOperation.substring(0, currentOperation.length - 3) + operator;
          }
          else nextOperation = currentOperation.substring(0, currentOperation.length - 1) + operator;
          setCurrentDisplay(operator);
          setCurrentOperation(nextOperation);
        }
        else {
          setCurrentDisplay(operator);
          setCurrentOperation(currentOperation+" "+operator);
        }
      }
    }
  }
  function isAnOperator(value){
    return operators.some(operator => value === operator);
  }
  function manageNumberOrDotClick(num){
    // if no operation evaluated
    if(!evaluated){
            // if dot is pressed
      if(num === '.'){
        // if there is no dot on display 
        if(currentDisplay.indexOf(num) === -1){
          setCurrentDisplay(currentDisplay+num);
          setCurrentOperation(currentOperation+num);
        } 
      }

      // if a number is pressed
      else{
        if(!currentOperation && num === "0"){
          return;
        }
        // if display is an operator 
        else if(isAnOperator(currentDisplay)){
          setCurrentDisplay(num);
          setCurrentOperation(currentOperation+" "+num);
        }
        // if display = 0
        else if(currentDisplay === '0'){
          setCurrentDisplay(num);
          setCurrentOperation(currentOperation+num);
        }
        // if display is a number
        else {
          setCurrentDisplay(currentDisplay+num);
          setCurrentOperation(currentOperation+num)
        }
      } 
    }
    // if operation evaluated do reset
    else {
        reset();
        setCurrentDisplay(num);
    } 
  }
  function manageClick(e){
    const value = e.target.innerText;

    // if equal is pressed and no operation evaluated
    if (value === "=" && currentOperation && !evaluated){
      setEvaluated(true);
      const result = Math.round(1000000000000 * safeEval(currentOperation)) / 1000000000000;
      setCurrentOperation(currentOperation+" "+value+" "+result)
      setCurrentDisplay(result.toString());
    }
    // if an operator is pressed
    else if(isAnOperator(value)) manageOperatorClick(value);

    //if AC is pressed
    else if(value === "AC") reset();
    
    // if Minus pressed
    else if(value === "-"){
      manageMinusClick();
    }
    // if a number or a dot is pressed
    else{
        // if the current display is not too long
        currentDisplay.length < 16 && manageNumberOrDotClick(value);
    }

  }
  // sanityze string input for safety
  function safeEval(stringOperation){
    // strip anything other than digits, (), -+/* and .
    var str = stringOperation.replace(/[^-()\d/*+.]/g, '');
    return eval(str);
  }
  const renderPads = (props) => {
    return(
        props.pads.map(pad => 
        <Pad 
        id={pad.name} 
        key={pad.value}
        onClick={manageClick}
        >{pad.value}</Pad>)
    )
  }
  return(
    <Wrapper>
      <OuterCalc>
      <Calculator>
        <Display>
          <p className="operation" >{currentOperation}</p>
          <p className="display"  id="display">{currentDisplay}</p>
          </Display>
        {renderPads(props)}
      </Calculator>
      </OuterCalc>
    </Wrapper>
  )
}
