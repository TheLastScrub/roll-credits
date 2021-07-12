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
                fadeAlphaShiftIncrement: 0.01,
                fadeInDelayMs: 2000,
                fadeOutDelayMs: 22000
            },
             
            text: 'OPERATION: ALICE', 
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
                fadeAlphaShiftIncrement: 0.01,
                fadeInDelayMs: 4000,
                fadeOutDelayMs: 7000
            }, 
            text: 'NEW YORK CITY, NEW YORK', 
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
                fadeAlphaShiftIncrement: 0.01,
                fadeInDelayMs: 10000,
                fadeOutDelayMs: 13000
            }, 
            text: '10 AUG, 1995', 
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
                fadeAlphaShiftIncrement: 0.01,
                fadeInDelayMs: 14000,
                fadeOutDelayMs: 22000
            }, 
            imagePath: 'test-data/68.Wright.png'
        }
    ]
};

game.RollCredits.ZoomOutToFullCanvas();
game.RollCredits.StartShowTitleCredits(config);