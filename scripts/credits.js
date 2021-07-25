export default class Credits{

    constructor(){
        this.isAnimationRunning = false;
        this.isBlackOut = false;
        this.blackoutContainer = null;
        this.animationTimerSeconds = 0;
        this.animationStartTime;
        this.activeAnimationType = '';
        this.activeCommands = [];
        this.maxRunTimeMs = 600000;  // set 10 minute timeout, so things don't just run forever...

        this.defaultTextStyle = new PIXI.TextStyle({
            fontFamily: "Courier New",
            fontSize: 120,
            fill: "white",
            strokeThickness: 4
        });
    }

    async debugMessage(message) {
        console.log(message);
    }

    async getModuleFlag(key){
        let flag = await game.world.getFlag("world", 'rollcredits.' + key);

        return flag;
    }

    async zoomOutToFullCanvas(){
        try{
            let newScale = 0.01;
            let newX = (game.canvas.dimensions.width / 2) + 200;
            let newY = game.canvas.dimensions.height / 2;
            
            game.canvas.pan({scale: newScale, x: newX, y: newY});
        }
        catch(ex){
            console.log(ex);
        }
    }

    async removeBlackout(){
        try{
            if(this.isBlackOut !== true){
                console.log('Blackout not active.')
                return;
            }

            let container = this.blackoutContainer;

            container.parent.removeChild(container);
            container.destroy({children: true, texture: true, baseTexture: true})

            this.isBlackOut = false;
        }
        catch(ex){
            console.log(ex);
        }
    }

    // PIXI only accepts the integer form of hex values for the tint, so can't do a string like '#f0000'
    async blackout(tint = 0x000000, zIndex = 1000){
        try{
            if(this.isBlackOut === true){
                console.log('Blackout already active.')
                return;
            }

            let container = new PIXI.Container();
            let app = game.canvas.app;

            app.stage.addChild(container);
            
            container.x = 0
            container.y = 0
            container.zIndex = zIndex;
            
            let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            bg.width = game.canvas.dimensions.width;
            bg.height = game.canvas.dimensions.height;
            bg.tint = tint;

            container.addChild(bg);
            
            this.blackoutContainer = container;
            
            this.isBlackOut = true;            
        }
        catch(ex){
            console.log(ex);
        }
    }

    // Try to stop everything and clean it all up
    async removeActiveAnimation(){
        let app = game.canvas.app;

        if(this.isAnimationRunning === true){
            if(this.activeAnimationType === 'TITLE'){
                try{
                    app.ticker.remove(this._titleCreditsTickerHandler, this);
                }
                catch(ex){
                    console.log(ex);
                }
            }
            else if(this.activeAnimationType === 'ROLLING'){

            }
        }

        // obliterate every container we added to the stage
        this.activeCommands.forEach(function(cmd, index, array) {
            try{
                if(cmd.config.type === 'blackout'){

                }
                else if(cmd.config.type === 'audio'){
                    cmd.sound.stop();
                }
                else
                {
                    let container = cmd.controls.containerControl;
                    
                    if(container !== null && container.parent !== null){
                        container.parent.removeChild(container);
                        container.destroy({children: true, texture: true, baseTexture: true})
                    }
                }                
            }
            catch(ex){
                console.log(ex);
            }
        });

        this.isAnimationRunning = false;
        this.activeAnimationType = '';
        this.activeCommands = [];
    }

    async showTitleCredits(config, maxRunTimeMs = null){

        if (maxRunTimeMs !== null){
            this.maxRunTimeMs = maxRunTimeMs;
        }

        if(this.isAnimationRunning !== true){
            this.isAnimationRunning = true;
            this.activeAnimationType = 'TITLE';
            
            let app = game.canvas.app;
            
            for(let i = 0; i < config.commands.length; i++){
            //config.commands.forEach(cmd => {
                let cmd = config.commands[i];

                cmd.isComplete = false;
                //this.activeCommands[i].isComplete = false;

                if(cmd.type === 'blackout'){
                    this.activeCommands.push({
                        config: cmd,
                    });
                }
                else if(cmd.type === 'audio'){

                    let sound = await game.audio.create({
                        src: cmd.url,
                        preload: true,
                        singleton: true
                    });
                    
                    await sound.load({autoplay: false});

                    this.activeCommands.push({
                        config: cmd,
                        sound: sound
                    });
                }
                else{

                    let container = new PIXI.Container();
                    container.x = game.canvas.dimensions.width / 2.0 + (game.canvas.dimensions.height / 2.0 * cmd.positioning.offsetX);
                    container.y = game.canvas.dimensions.height / 2.0 + (game.canvas.dimensions.height / 2.0 * cmd.positioning.offsetY);
                    container.zIndex = 2000 + cmd.positioning.zIndexOffset;
    
                    if(cmd.type === 'text'){    
    
                        let message = new PIXI.Text(cmd.text, cmd.textStyle);
    
                        message.anchor.x = 0.5;
                        message.anchor.y = 0;
                        message.x = container.width / 2;
                        message.y = 0;
                        message.alpha = 0.0;
                        
                        container.addChild(message);  
                        
                        this.activeCommands.push({
                            config: cmd,
                            controls:{
                                containerControl: container,
                                textControl: message,
                                isAddedToStage: false
                            }
                        });
                    }
                    else if(cmd.type === 'image'){
                        let tex = PIXI.Texture.from(cmd.imagePath);
                        let sprite = new PIXI.Sprite(tex);
                        
                        sprite.anchor.x = 0.5;
                        sprite.anchor.y = 0;
                        sprite.x = container.width / 2;
                        sprite.y = 0;
                        sprite.alpha = 0.0;

                        if(cmd.hasOwnProperty('imageWidth') && cmd.imageWidth != null){
                            sprite.width = cmd.imageWidth;
                        }

                        if(cmd.hasOwnProperty('imageHeight') && cmd.imageHeight != null){
                            sprite.height = 1000;
                        }                        

                        container.addChild(sprite);

                        this.activeCommands.push({
                            config: cmd,
                            controls:{
                                containerControl: container,
                                imgControl: sprite,
                                isAddedToStage: false
                            }
                        });
                    }
                }                
            //});
            }
            
            // log the start time for the animation so we can time things later
            let d = new Date();
            this.animationStartTime = d.getTime();
            
            // kick off the animation
            app.ticker.add(this._titleCreditsTickerHandler, this);
        }
        else{
            console.log('Cannot begin showing title credits, animation is already active.');
        }
    }

    _titleCreditsTickerHandler(){
        let app = game.canvas.app;
        let d = new Date();
        let currentTime = d.getTime();
        let timeIntoAnimation = currentTime - this.animationStartTime;
        let allCommandsComplete = true;

        if(this.maxRunTimeMs < timeIntoAnimation){
            this.isAnimationRunning = false;
            this.removeActiveAnimation();
            return;
        }
        else{
            this.activeCommands.forEach(function(cmd, index, array) {
                if(cmd.config.isComplete === false){
                    allCommandsComplete = false;
                }
            });

            if(allCommandsComplete === true){
                this.isAnimationRunning = false;
                this.removeActiveAnimation();
                return;
            }
        }

        if(this.isAnimationRunning === true){    

            for(let i = 0; i < this.activeCommands.length; i++){
                let cmd = this.activeCommands[i];
                
                if(cmd.config.type === 'blackout'){
                    if(this.isBlackOut === true && cmd.config.timing.fadeOutDelayMs !== null && cmd.config.timing.fadeOutDelayMs <= timeIntoAnimation)
                    {
                        this.activeCommands[i].config.isComplete = true;
                        this.removeBlackout();
                    }
                    else if(this.isBlackOut === false && cmd.config.isComplete === false && cmd.config.timing.fadeInDelayMs <= timeIntoAnimation){
                        if(cmd.config.blackout.tint !== null){
                            this.blackout(cmd.config.blackout.tint);
                        }
                        else{
                            this.blackout();
                        }                        
                    }
                }
                else if(cmd.config.type === 'audio'){
                    let sound = this.activeCommands[i].sound;

                    if(cmd.sound.playing !== true && cmd.config.startTime <= timeIntoAnimation && cmd.config.isComplete === false){
                        
                        sound.play({loop: false, offset: 0, volume: cmd.config.volume, fade: cmd.config.fadeOutDurationMs});

                    }
                    else if(cmd.sound.playing === true && cmd.config.fadeOutTime <= timeIntoAnimation){

                        sound.fade(0, {duration: cmd.config.fadeOutDurationMs});

                        this.activeCommands[i].config.isComplete = true;
                    }                    
                }
                else{
                    if(cmd.config.type === 'text'){
                        if(this.activeCommands[i].controls.isAddedToStage === false){
                            app.stage.addChild(this.activeCommands[i].controls.containerControl);
    
                            this.activeCommands[i].controls.isAddedToStage = true;
                        }
                        else{                    
                            if(this.activeCommands[i].config.timing.fadeOutDelayMs !== null && this.activeCommands[i].config.timing.fadeOutDelayMs <= timeIntoAnimation){
                                if(this.activeCommands[i].controls.textControl.alpha > 0){
                                    this.activeCommands[i].controls.textControl.alpha -= this.activeCommands[i].config.timing.fadeAlphaShiftIncrement;
    
                                    if(this.activeCommands[i].controls.textControl.alpha <= 0){
                                        this.activeCommands[i].config.isComplete = true;
                                    }
                                }
                            }
                            else if(this.activeCommands[i].config.timing.fadeInDelayMs <= timeIntoAnimation && this.activeCommands[i].controls.textControl.alpha < 1.0){
                                this.activeCommands[i].controls.textControl.alpha += this.activeCommands[i].config.timing.fadeAlphaShiftIncrement;                      
                            }
                        }
                    }
                    else if(cmd.config.type === 'image'){
                        if(this.activeCommands[i].controls.isAddedToStage === false){
                            app.stage.addChild(this.activeCommands[i].controls.containerControl);
    
                            this.activeCommands[i].controls.isAddedToStage = true;
                        }
                        else{                    
                            if(this.activeCommands[i].config.timing.fadeOutDelayMs !== null && this.activeCommands[i].config.timing.fadeOutDelayMs <= timeIntoAnimation){
                                if(this.activeCommands[i].controls.imgControl.alpha > 0){
                                    this.activeCommands[i].controls.imgControl.alpha -= this.activeCommands[i].config.timing.fadeAlphaShiftIncrement;
    
                                    if(this.activeCommands[i].controls.imgControl.alpha <= 0){
                                        this.activeCommands[i].config.isComplete = true;
                                    }
                                }
                            }
                            else if(this.activeCommands[i].config.timing.fadeInDelayMs <= timeIntoAnimation && this.activeCommands[i].controls.imgControl.alpha < 1.0){
                                this.activeCommands[i].controls.imgControl.alpha += this.activeCommands[i].config.timing.fadeAlphaShiftIncrement;                      
                            }
                        }
                    }                    
                }                
            }
        }
    }

    async startRollingCredits(){
        try{
            this.isAnimationRunning = true;
            this.activeAnimationType = 'ROLLING';

            let container = new PIXI.Container();
            let app = game.canvas.app;
        
            app.stage.addChild(container);
            
            container.x = game.canvas.dimensions.sceneRect.x; //game.canvas.dimensions.sceneWidth / 2.0;
            container.y = 0; //app.screen.height;
            
            //container.pivot.x = container.width;
            //container.pivot.y = container.height;
            
            
            let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            bg.width = game.canvas.dimensions.sceneWidth;
            bg.height = 1000;
            bg.tint = 0x000000;
            
            container.addChild(bg);
            
            let style = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 36,
                fill: "white",
                stroke: '#ff3300',
                strokeThickness: 4,
                //dropShadow: true,
                //dropShadowColor: "#000000",
                //dropShadowBlur: 4,
                //dropShadowAngle: Math.PI / 6,
                //dropShadowDistance: 6,
            });
            
            let message = new PIXI.Text("BOOK 3 - DECEIVER'S MOON", style);
            message.anchor.x = 0.5;
            message.anchor.y = 0;
            message.x = container.width / 2;
            message.y = 0; //container.height / 2;
            
            let message2 = new PIXI.Text("A STARFINDER ADVENTURE PATH", style);
            message2.anchor.x = 0.5;
            message2.anchor.y = 0;
            message2.x = container.width / 2;
            message2.y = 100; //container.height / 2;
            
            container.addChild(message);
            container.addChild(message2);
            
            app.ticker.add((delta) => {
                //container.rotation -= 0.01 * delta;
                if(this.isAnimationRunning === true){
                    container.position.y += 3 * delta;
                
                    //console.log(app.screen.height);
                    //console.log(container.position.y);
                    if (container.position.y  > game.canvas.dimensions.sceneHeight + 500 + container.height){
                        this.isAnimationRunning = false;
                        container.parent.removeChild(container);
                        container.destroy({children: true, texture: true, baseTexture: true})
                        //console.log('here');
                    }
                }
                
            });
        }
        catch(ex){
            console.log(ex);
        }
    }

}