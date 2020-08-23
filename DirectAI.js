function DirectAI(){
    if(posX < appleX){
        if(velX == -1){
            inputX = 0;
            inputY = (posY == 0) ? -1 : 1;
        }else{
            inputX = 1;
            inputY = 0;
        }
    }else if(posX > appleX){
        if(velX == 1){
            inputX = 0;
            inputY = (posY == 0) ? -1 : 1;
        }else{
            inputX = -1;
            inputY = 0;
        }
    }else if(posY < appleY){
        if(velY == -1){
            inputX = (posX == 0) ? 1 : -1;
            inputY = 0;
        }else{
            inputX = 0;
            inputY = 1;
        }
    }else if(posY > appleY){
        if(velY == 1){
            inputX = (posX == 0) ? 1 : -1;
            inputY = 0;
        }else{
            inputX = 0;
            inputY = -1;
        }
    }else{
        inputX = 0;
        inputY = 0;
    }
}