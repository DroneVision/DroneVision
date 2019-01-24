import React, { Component } from 'react';
import createCommandString from '../utilities/createCommandString';

class Test extends Component {
  constructor() {
    super();
    this.state = {
      flightCommands: ['command', 'takeoff', 'land'],
    };
  }

  addDirection = newDirection => {
    console.log(this.state.flightCommands);
    let tmpArray = this.state.flightCommands.slice()
    tmpArray.splice(-1, 0, newDirection);
    console.log(tmpArray);
    this.setState({
      flightCommands: tmpArray,
    });
  };

  deleteLast = () => {
    console.log(this.state.flightCommands);
    let tmpArray = this.state.flightCommands.slice()
    tmpArray.splice(-2, 1)
    console.log(tmpArray);
    this.setState({
      flightCommands: tmpArray,
    });
  };

  render() {
    return (
      <div>
        <h1>Test1</h1>
        <p>{`${this.state.flightCommands.toString()}`}</p>
        <button onClick={() => this.addDirection('up')}>Up</button>
        <button onClick={() => this.addDirection('right')}>Right</button>
        <button onClick={() => this.addDirection('down')}>Down</button>
        <button onClick={() => this.addDirection('left')}>Left</button>
        <button onClick={() => this.deleteLast()}>Delete</button>
      </div>
    );
  }
}

export default Test;
