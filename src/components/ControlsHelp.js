import React from 'react';
import { List } from 'semantic-ui-react';

const ControlsHelp = () => {
 return (
   <div>
     <List divided inverted>
       <List.Header>
         <i>Help:</i>
       </List.Header>
       <List.Item className="flight-messages-single">
         <List.Header>
           <i>LEFTIES</i>
         </List.Header>
         <List.Item className="flight-messages-single">
           Upward Movement ---> PRESS AND HOLD " . " KEY
         </List.Item>
         <List.Item className="flight-messages-single">
           Downward Movement ---> PRESS AND HOLD " / " KEY
         </List.Item>
       </List.Item>
       <List.Item>
         <List.Header>
           <i>RIGHTIES</i>
         </List.Header>
         <List.Item className="flight-messages-single">
           Upward Movement ---> PRESS AND HOLD " Z " KEY
         </List.Item>
         <List.Item className="flight-messages-single">
           Downward Movement ---> PRESS AND HOLD " X " KEY
         </List.Item>
       </List.Item>
     </List>
   </div>
 );
};

export default ControlsHelp;