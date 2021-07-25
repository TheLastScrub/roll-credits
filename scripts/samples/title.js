let sampleImgPath = 'modules/roll-credits/documentation/img/Venice_carnival_costume_with_mask_and_hat_-_transparent.png';

let sampleAudioPath = 'modules/roll-credits/documentation/audio/techtheist - He_WhenDancingOnCadaver.mp3';

// See PIXI.js documentation on their TextStyle class for more information.
let titleTextStyle = new PIXI.TextStyle({
    fontFamily: "Courier New",
    fontSize: 120,
    fill: "white",
});

normalTextStyle = new PIXI.TextStyle({
    fontFamily: "Courier New",
    fontSize: 80,
    fill: "white",
});

let config = {
    commands:[
        {
            type: 'blackout',
            timing: {
                fadeInDelayMs: 0,
                fadeOutDelayMs: 30000
            },
            blackout:{
                tint: null
            }
        },
        {
            type: 'text',
            positioning: {
                offsetX: 0.0, 
                offsetY: 0.0, 
                zIndexOffset: 0,
            },
            timing: {
                fadeAlphaShiftIncrement: 0.005,
                fadeInDelayMs: 2000,
                fadeOutDelayMs: 20000
            },
             
            text: 'OPERATION: TITLE CARD', 
            textStyle: titleTextStyle
        },
        {
            type: 'text',
            positioning: {
                offsetX: 0.0, 
                offsetY: 0.1, 
                zIndexOffset: 0
            },
            timing: {
                fadeAlphaShiftIncrement: 0.005,
                fadeInDelayMs: 4000,
                fadeOutDelayMs: 7000
            }, 
            text: 'SOME STATE, SOME CITY', 
            textStyle: normalTextStyle
            
        },
        {
            type: 'text',
            positioning: {
                offsetX: 0.0, 
                offsetY: 0.1, 
                zIndexOffset: 0
            },
            timing: {
                fadeAlphaShiftIncrement: 0.005,
                fadeInDelayMs: 10000,
                fadeOutDelayMs: 13000
            }, 
            text: 'DAY, MONTH YEAR', 
            textStyle: normalTextStyle
            
        },
        {
            type: 'image',
            positioning: {
                offsetX: 0.0, 
                offsetY: 0.1, 
                zIndexOffset: 0
            },
            timing: {
                fadeAlphaShiftIncrement: 0.005,
                fadeInDelayMs: 15000,
                fadeOutDelayMs: 23000
            }, 
            imagePath: sampleImgPath,
            imageWidth: 1078,
            imageHeight: 1440
        },
        {
            type: 'audio',
            url: sampleAudioPath,
            volume: 0.7,
            offset: 0,
            startTime: 0,
            fadeOutTime: 18000,
            fadeOutDurationMs: 3000
        }
    ]
};

//game.RollCredits.Blackout();
game.RollCredits.ZoomOutToFullCanvas();
game.RollCredits.StartShowTitleCredits(config);