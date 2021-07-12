import CanvasManagerDialog from './dialog.js';
import Credits from './credits.js';

var _Credits;

Hooks.on("init", function() {
  //console.log("This code runs once the Foundry VTT software begins it's initialization workflow.");
});

Hooks.on("ready", async () => {
  //console.log("This code runs once core initialization is ready and game data is available.");

  createApiCalls();

  _Credits = new Credits();
  
});

Hooks.once("ready", async() => {
    //console.log("Ready!");

    // Create a socket event handler to listen to incomming sockets and dispatch to callbacks
    game.socket.on(`module.roll-credits`, (data) => {
        if (data.operation === 'DebugMessageEvent') handleDebugEvent(data);
        if (data.operation === 'StartRollingCredits') handleStartRollingCredits(data);
        if (data.operation === 'ZoomOutToFullCanvas') handleZoomOutToFullCanvas(data);
        if (data.operation === 'Blackout') handleBlackout(data);
        if (data.operation === 'RemoveBlackout') handleRemoveBlackout(data);
        if (data.operation === 'StartShowTitleCredits') handleStartShowTitleCredits(data);
        if (data.operation === 'RemoveActiveAnimation') handleRemoveActiveAnimation(data);
    });
});

function createApiCalls(){
  game.RollCredits = {
      StartRollingCredits,
      StartShowTitleCredits,
      Blackout,
      RemoveBlackout,
      ZoomOutToFullCanvas,
      SocketDebugMessage,
      RemoveActiveAnimation
    };
}

export function RemoveActiveAnimation(){
  
  game.socket.emit('module.roll-credits', {
    operation: 'RemoveActiveAnimation',
    user: game.user.id,
    content: null,
  });

  _Credits.removeActiveAnimation();
  
}

export function SocketDebugMessage(msg){
  if(game.users.get(game.userId).hasRole("GAMEMASTER") === true){

    game.socket.emit('module.roll-credits', {
      operation: 'StartRollingCredits',
      user: game.user.id,
      content: msg,
    });

    _Credits.debugMessage(data);
  }
  else{
    ui.notifications.error('Insufficient permissions to use Roll Credits.')
  }
}

export function ZoomOutToFullCanvas(){
  if(game.users.get(game.userId).hasRole("GAMEMASTER") === true){

    game.socket.emit('module.roll-credits', {
      operation: 'ZoomOutToFullCanvas',
      user: game.user.id,
      content: null,
    });

    _Credits.zoomOutToFullCanvas();
  }
  else{
    ui.notifications.error('Insufficient permissions to use Roll Credits.')
  }
}

function Blackout(tint = 0x000000, zIndex = 1000){
  if(game.users.get(game.userId).hasRole("GAMEMASTER") === true){
    
    game.socket.emit('module.roll-credits', {
      operation: 'Blackout',
      user: game.user.id,
      content: {tint: tint, zIndex: zIndex},
    });

    _Credits.blackout(tint, zIndex);
  }
  else{
    ui.notifications.error('Insufficient permissions to use Roll Credits.')
  }
}

function RemoveBlackout(){
  if(game.users.get(game.userId).hasRole("GAMEMASTER") === true){

    game.socket.emit('module.roll-credits', {
      operation: 'RemoveBlackout',
      user: game.user.id,
      content: null,
    });

    _Credits.removeBlackout();
  }
  else{
    ui.notifications.error('Insufficient permissions to use Roll Credits.')
  }
}

function StartRollingCredits(data){
  if(game.users.get(game.userId).hasRole("GAMEMASTER") === true){

    game.socket.emit('module.roll-credits', {
      operation: 'StartRollingCredits',
      user: game.user.id,
      content: data,
    });

    _Credits.startRollingCredits();
  }
  else{
    ui.notifications.error('Insufficient permissions to use Roll Credits.')
  }
}

export function StartShowTitleCredits(config){
  if(game.users.get(game.userId).hasRole("GAMEMASTER") === true){

    game.socket.emit('module.roll-credits', {
      operation: 'StartShowTitleCredits',
      user: game.user.id,
      content: config,
    });

    _Credits.showTitleCredits(config);
  }
  else{
    ui.notifications.error('Insufficient permissions to use Roll Credits.')
  }
}

function handleBlackout(payload){
  _Credits.blackout(payload.content.tint, payload.content.zIndex);
}

function handleRemoveBlackout(payload){
  _Credits.removeBlackout();
}

function handleStartRollingCredits(payload){
    _Credits.startRollingCredits();
}

// This is just for testing that clients are indeed recieving socket messages.
function handleDebugEvent(payload) {
  _Credits.debugMessage(payload.content);
}

function handleZoomOutToFullCanvas(payload){
  _Credits.zoomOutToFullCanvas();
}

function handleStartShowTitleCredits(payload){
  _Credits.showTitleCredits(payload.content);
}

function handleRemoveActiveAnimation(payload){
  _Credits.removeActiveAnimation();
}

/*

async function ShowManagerDialog(){
  const result = await CanvasManagerDialog.show();

  console.log(result);
}
*/