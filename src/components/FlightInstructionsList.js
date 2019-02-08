import React from 'react';
import { Segment, List } from 'semantic-ui-react';

const FlightInstructionsList = props => {
  return (
    <div id="flight-instructions">
      <Segment inverted>
        <List divided inverted animated>
          <List.Header>
            <i>Flight Instructions</i>
          </List.Header>
          {props.flightInstructions
            .map(instructionObj => instructionObj.message)
            .map((message, ind) => {
              let icon;
              if (message === 'Takeoff') {
                icon = 'hand point up';
              } else if (message === 'Land') {
                icon = 'hand point down';
              } else if (message === 'Hold') {
                icon = 'hourglass half';
              } else {
                icon = 'dot circle';
              }
              return (
                <List.Item
                  className="flight-message-single"
                  key={ind}
                  content={message}
                  icon={icon}
                />
              );
            })}
        </List>
      </Segment>
    </div>
  );
};

export default FlightInstructionsList;
