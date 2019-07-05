var bulldog = {
  canvas: document.getElementById("bulldog"),
  newRound: function(){  
    this.ctx = this.canvas.getContext("2d");
    let score1 = this.player1 ? this.player1.score : 0;
    let score2 = this.player2 ? this.player2.score : 0;
    this.player1 = new Player(20, 300, 'Lorenzo', score1);
    this.player2 = new Player(1140, 300, 'Rico', score2);
    this.newGift = new Gift();
    this.circle  = new Obstacle(250);
    this.circle2 = new Obstacle(425);
    this.circle3 = new Obstacle(775);
    this.circle4 = new Obstacle(950);
    this.goal = new finalDest();
    this.interval = setInterval(()=> {
      this.Canvas()
    },10)
    document.onkeydown = (function (e) {
      switch (e.keyCode) {
        case 90: this.player1.moveUp();    break;
        case 83: this.player1.moveDown();  break;
        case 81: this.player1.moveLeft();  break;
        case 68: this.player1.moveRight(); break;
        case 38: this.player2.moveUp();    break;
        case 40: this.player2.moveDown();  break;
        case 37: this.player2.moveLeft();  break;
        case 39: this.player2.moveRight(); break;
      }
    }).bind(this)
  },
  Canvas: function () {
    this.ctx.clearRect(0,0,1500,1500);
    // elements drawing
    this.player1.draw()
    this.player2.draw()
    this.circle.draw()
    this.circle2.draw()
    this.circle3.draw()
    this.circle4.draw()
    this.newGift.draw()
    // mvt of obstacles
    this.circle.moveSpeed();
    this.circle2.moveSpeed();
    this.circle3.moveSpeed();
    this.circle4.moveSpeed();
    // gift features
    this.newGift.randomDir();
    this.newGift.GiftTaken(this.player1);
    this.newGift.GiftTaken(this.player2);
    this.player1.indexOwner ===1 ? this.player1.stoleGift(this.player2, this.newGift) : this.player2.stoleGift(this.player1, this.newGift);
    if (this.goal.isDrawable(this.newGift)){
      this.goal.draw()
      this.goal.isTheEnd(this.player1);
      this.goal.isTheEnd(this.player2);
    };
    // interaction & scores
    this.player1.updateScores()
    this.player2.updateScores()
    this.player1.checkCollision(this.circle)
    this.player1.checkCollision(this.circle2)
    this.player1.checkCollision(this.circle3)
    this.player1.checkCollision(this.circle4)
    this.player2.checkCollision(this.circle)
    this.player2.checkCollision(this.circle2)
    this.player2.checkCollision(this.circle3)
    this.player2.checkCollision(this.circle4)
    this.player1.scorePenalty(this.circle, this.circle2, this.circle3, this.circle4)
    this.player2.scorePenalty(this.circle, this.circle2, this.circle3, this.circle4)
    // end of the game
    this.goal.isNextRound()
    if (this.goal.isNextRound()){
      bulldog.endOfRound()
    }
  },
  endOfRound: function(){
    // reset player & objects
    this.player1.reset();
    this.player2.reset();
    this.circle.resetObs();
    this.circle2.resetObs();
    this.circle3.resetObs();
    this.circle4.resetObs();
    // change the html content and save scores   
    index +=1;
    this.winner = 'ok'
    this.ctx.fillStyle = '#00BFFF';
    this.ctx.font = '25px Courier New';
    if (roundLeft > 0){
      btn.innerHTML = 'round suivant';
      this.ctx.fillText("fin du round mamene! plus ke "+ roundLeft + " avant la fin dla partie. \n", 240, 200)
    } else {
      // this.goal.img.src = "https://i.ebayimg.com/images/g/w~YAAOSw8HBZHJUZ/s-l300.jpg"
      btn.innerHTML = "plus de round"
      this.player1.score > this.player2.score? this.winner = "mamene, lolo" : this.winner = "mamene, rico"
      this.ctx.fillText("fin du jeu! " + this.winner + " a gagné la partie.", 300, 200)
    }
  }
}


// player features
function Player (x, y, character, score) {
  
  // coordinates
  this.initialX = x;
  this.initialY = y;
  this.x = x;
  this.y = y;
  this.height = 60;
  this.width = 60;
  this.character = character;
  this.changing_owner = false;
  this.img = new Image();
  switch (character) {
    case 'Lorenzo':
      this.img.src = "https://risibank.fr/cache/stickers/d764/76493-full.png";
      break;
    case 'Rico':
      this.img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHjHCD9e1r7vwTd2sGxCAHmit_-5qVHAojHGxNh7LTEGfaN63fg"
      break;
    default:;
  }
  // draw the player
  this.draw = function() {
    context = bulldog.ctx;
    context.drawImage(this.img, this.x, this.y, this.height, this.width); 
  }
  // direction & moves
  setTimeout(() => {
    this.scorePenalty = function(obs1, obs2, obs3, obs4){
      if(this.checkCollision(obs1) || this.checkCollision(obs2) || this.checkCollision(obs3) || this.checkCollision(obs4)){
        this.score -= 0.08;
      } else {
        this.moveUp =    y => {this.y < 25   ? this.y : this.y -= 25};
        this.moveDown =  y => {this.y > 725  ? this.y : this.y += 25};
        this.moveLeft =  x => {this.x <= 25  ? this.x : this.x -= 25};
        this.moveRight = x => {this.x > 1125 ? this.x : this.x += 25};
      }
    }
  }, 3000)
  this.score = score ? score : 0;

  // update scores
  this.updateScores = function(){ 
    this.updateResult = document.getElementById(this.character)
    this.updateResult.innerHTML = this.character + " " + Math.floor(this.score)
  }

  // collision with obstacles
  this.checkCollision = function(Obstacle){
    this.dx = Math.abs(Obstacle.x - this.x-this.width/2)  - this.width / 2;
    this.dy = Math.abs(Obstacle.y - this.y-this.height/2) - this.height/ 2;
    return (this.dx*this.dx + this.dy*this.dy <= (Obstacle.rayon * Obstacle.rayon))
  }

  // just a way to identify which player is currently owning the gift
  this.indexOwner = 0

  // collision with the other player when the other got the gift
  this.stoleGift = function(otherPlayer, gift){
    if(otherPlayer.x <= this.x + this.width && otherPlayer.y <= this.y + this.height
      && otherPlayer.x >= this.x - this.width && otherPlayer.y >= this.y - this.height
      && this.indexOwner === 1 && !this.changing_owner){
        this.changing_owner = true;
        setTimeout(() => {
          this.changing_owner = false;
          this.indexOwner -= 1;
          otherPlayer.indexOwner += 1;
          this.score -= gift.value
          otherPlayer.score += gift.value
        }, 1500)
    }
  }

  // reset
  this.reset = function(){
    this.x = this.initialX;
    this.y = this.initialY;
  }

};

// gift features

var giftArray = ['shym', 'purpleCar', 'raccoon', 'cacolac', 'kinder']

function Gift (){

  // initial coordinates
  this.x = 550;
  this.y = 288;
  //choice of random gift
  this.kindOf = giftArray[Math.floor(Math.random()*giftArray.length)];
  this.giftImg = new Image();
  this.giftImg.src = "https://vignette.wikia.nocookie.net/mario/images/7/71/200px-Question_Block_Artwork_-_Super_Mario_3D_World.png/revision/latest?cb=20131201114634&path-prefix=fr"
  // audio
  // value in points and source of the gift
  setTimeout(() => {
    switch (this.kindOf) {
      case 'shym':
      this.giftImg.src = "https://assets.afcdn.com/story/20190125/-1329616_w767h767c1cx2402cy1704.jpg";
      this.value = 100;
      this.audioGift = new Audio('shym.mp3')
      this.audioGift.play();
      break;
      case 'purpleCar':
      this.giftImg.src = "https://thumbs.dreamstime.com/t/car-convertible-pink-16468026.jpg";
      this.value = 30;
      this.audioGift = new Audio('ouais ouais ouais.mp3')
      this.audioGift.play();
      break;
      case 'raccoon':
      this.giftImg.src = "https://stickeroid.com/uploads/pic/fx0n217l-full/thumb/stickeroid_5bf54fc73c5ad.png";
      this.value = 50;
      this.audioGift = new Audio('bigupatouslessrab.mp3')
      this.audioGift.play();
      break;
      case 'cacolac':
      this.giftImg.src = "https://static.miam-express.info/img/p/9/7/5/3/9753-large_default.jpg";
      this.value = 20;
      this.audioGift = new Audio('coconut.mp3')
      this.audioGift.play();
      case 'kinder':
      this.giftImg.src = "https://scontent-lga3-1.cdninstagram.com/vp/896592e6419cc7a7f0a0bc30feb6cd62/5D2441C3/t51.2885-15/e35/s320x320/17586537_1129506110510778_803737201698406400_n.jpg?_nc_ht=scontent-lga3-1.cdninstagram.com&ig_cache_key=MTQ4MjE1OTE4MTA0OTA2MjU1MA%3D%3D.2";
      this.value = 40;
      this.audioGift = new Audio('ptit pilon bien garni.mp3')
      this.audioGift.play();
      break;
      default:;}
    }, 3000);
  // draw the gift
  this.draw = function() {
    context = bulldog.ctx;
    context.drawImage(this.giftImg, this.x, this.y, 100, 100); 
  }
  // random direction & moves
  this.randomDir = (x, y) => {
    if (this.giftImg.src === "https://images-na.ssl-images-amazon.com/images/I/81ezzr09SLL._SX466_.jpg"){
    this.x = (550 + Math.floor(Math.random()*20));
    this.y = (288 + Math.floor(Math.random()*20));
    }
  }
  //interactions features
  this.margin = 40

  this.GiftTaken = function(Player){
    if (Player.x <= this.x + this.margin && Player.y <= this.y + this.margin
      && Player.x >= this.x - this.margin && Player.y >= this.y - this.margin){
      this.x = 2000
      this.y = 2000
      Player.score += this.value;
      Player.indexOwner +=1;
    }
  }

}


// obstacles features
function Obstacle(x) {
  // coordinates
  this.x = x;
  this.y = (Math.floor(Math.random()*300)+1)*2;
  this.rayon = Math.floor(Math.random()*40)+20;
  this.ctx = document.getElementById("bulldog").getContext("2d");
  //random colors
  this.red = Math.floor(Math.random()*125)+140;
  this.green = Math.floor(Math.random()*70);
  this.blue = Math.floor(Math.random()*125)+140;
  // shape with random radius
  this.draw = function() {
    this.ctx.beginPath()
    this.ctx.fillStyle = "rgb("+ this.red + ", " + this.green + ", " + this.blue + ")"; 
    this.ctx.arc(this.x, this.y, this.rayon, 0, 2*Math.PI);
    this.ctx.fill();
    this.ctx.closePath()
  }
  this.i = 0;
  // rebonds
  this.speed = 2;
  this.moveSpeed = function(){
    if (this.y === 640 || this.y === 0){this.i+=1}
    if (this.i % 2 === 1){
      this.y += 2;
    } else {this.y -= 2}
  }
  // reset
  this.resetObs = function(){
    this.x = 4000
    this.y = 4000
  }
}

// final destination features
function finalDest(){
  // boolean to know if the gift is taken by one player
  this.isDrawable = function(gift){
    return(gift.x === 2000 && gift.y === 2000)
  }
  // random coordinates
  this.i = Math.floor(Math.random()*2)+1
  this.i ===2 ? this.x = Math.floor(Math.random()*190)+810 : this.x = Math.floor(Math.random()*190 + 50);
  this.i ===1 ? this.y = Math.floor(Math.random()*200)+50   : this.y = Math.floor(Math.random()*200)+300;
  this.width = 100
  this.height = 100
  // picture of finalDest
  this.giftImg = new Image();
  this.giftImg.src = "https://s3.ca-central-1.amazonaws.com/test-public-420/loader.png";
  this.draw = function() {
    context = bulldog.ctx;
    context.drawImage(this.giftImg, this.x, this.y, this.width, this.height);
  }
  this.margin = 50;
  // end of the round
  this.isTheEnd = function(player){
    
    if (player.x <= this.x + this.margin && player.y <= this.y + this.margin
      && player.x >= this.x - this.margin && player.y >= this.y - this.margin && player.indexOwner === 1){
        setTimeout(() => {
          this.x = 475;
          this.y = 325;
          this.width = 250;
          this.height = 250;
          this.giftImg.src = "https://i1.sndcdn.com/avatars-000309423131-0x23ql-t500x500.jpg";
        }, 500);
        // on met à jour les scores (en projet)
        this.resultList = document.getElementsByClassName("round-result")
    }
    this.winner = player
  }
  this.isNextRound = function(){
    return (this.giftImg.src === "https://i1.sndcdn.com/avatars-000309423131-0x23ql-t500x500.jpg")
  }

}


// Start new game
var btn = document.getElementById('start-game-button')
var roundLeft = 4
var currentRound = 0;
var index = 1

btn.onclick = function () {
  
  if (!btn.innerHTML.includes(' round')){
    bulldog.newRound()
    roundLeft -= 1;
    currentRound +=1;
  }
  switch (currentRound) {
    case 1:
      btn.innerHTML = 'premier round'
      break;
    case 2:
      btn.innerHTML = 'second round'
      break;
    case 3:
      btn.innerHTML = 'troisieme round'
      break;
    case 4:
      btn.innerHTML = 'quatrieme round'
      break;
    case 5:
      btn.innerHTML = 'fin du game'
      break;
    default:;
  }
};

