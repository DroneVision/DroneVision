import wait from 'waait';
import commandDelays from '../drone/commandDelays';

const flightCommandsIteratorReduxUpdater = async flightInstructions => {
  //Iterate over all flightInstructions
  for (let i = 0; i < flightInstructions.length; i++) {
    let flightInstruction = flightInstructions[i];
    let instructionName = flightInstruction.droneInstruction.split(' ')[0];
    //create new object for new coordinates
    let newCoords = {};
    let flightInstructionArray = flightInstruction.droneInstruction
      .split(' ')
      .slice(1, 4)
      .map(numStr => Number(numStr) / this.props.distance);

    const [z, x, y] = flightInstructionArray;
    // x -> z
    // y -> x
    // z -> y
    newCoords.x = this.props.currentDronePosition.x + x;
    newCoords.y = this.props.currentDronePosition.y + y;
    newCoords.z = this.props.currentDronePosition.z + z;

    if (instructionName === 'command') {
    } else if (instructionName === 'takeoff') {
      this.props.updateCDP({
        x: this.props.startingPosition.x,
        y: this.props.startingPosition.y + 1,
        z: this.props.startingPosition.z,
      });
    } else if (instructionName === 'land') {
      this.props.updateCDP({
        x: this.props.currentDronePosition.x,
        y: 0 + this.props.voxelSize * -0.5,
        z: this.props.currentDronePosition.z,
      });

      setTimeout(() => {
        //After flight completes wait 10 seconds
        //Send drone model back to starting position
        this.props.updateCDP({
          x: this.props.startingPosition.x,
          y: this.props.startingPosition.y,
          z: this.props.startingPosition.z,
        });
        //If user was recording, stop video encoding and stop streaming
        if (this.state.isRecording) {
          this.stopRecordingVideo();
        }
        //Give the 'Send drone model back to starting
        //position 4.5 seconds to animate before re-enabling buttons
        setTimeout(() => {
          this.setState({ runButtonsDisabled: false, isRecording: false });
        }, 4500);
      }, 10000);
    } else {
      this.props.updateCDP(newCoords);
    }
    //Wait for Command Delay
    await wait(commandDelays[instructionName]);
  }
};

export default flightCommandsIteratorReduxUpdater;
