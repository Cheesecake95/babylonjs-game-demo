function keysDown(scene) {
  this.command = {
    frameTime: 0,
    moveForwardKeyDown: false,
    moveBackwardKeyDown: false,
    moveLeftKeyDown: false,
    moveRightKeyDown: false,
    jumpKeyDown: false,
    shiftKeyDown: false,
    cameraAlpha: 0,
    cameraBeta: 0
  }

  scene.onKeyboardObservable.add(kbInfo => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
          case 'w':
          case 'W':
            this.command.moveForwardKeyDown = true;
            break;
          case 'a':
          case 'A':
            this.command.moveLeftKeyDown = true;
            break;
          case 's':
          case 'S':
            this.command.moveBackwardKeyDown = true;
            break;
          case 'd':
          case 'D':
            this.command.moveRightKeyDown = true;
            break;
          case ' ':
            this.command.jumpKeyDown = true;
            break;
          case 'Shift':
            this.command.shiftKeyDown = true;
            break;
        }
        break;
      case BABYLON.KeyboardEventTypes.KEYUP:
        switch (kbInfo.event.key) {
          case 'w':
          case 'W':
            this.command.moveForwardKeyDown = false;
            break;
          case 'a':
          case 'A':
            this.command.moveLeftKeyDown = false;
            break;
          case 's':
          case 'S':
            this.command.moveBackwardKeyDown = false;
            break;
          case 'd':
          case 'D':
            this.command.moveRightKeyDown = false;
            break;
          case ' ':
            this.command.jumpKeyDown = false;
            break;
          case 'Shift':
            this.command.shiftKeyDown = false;
            break;
        }
        break;
    }
  });

  return this;
}

export default keysDown;