var list1 = ["PARLIAMENT","IMPEACHMENT","STATELEGISLATURES","OATH","FIVE","SIX","THIRTYFIVE"];
var let1 = ["P","A","R","L","I","A","M","E","N","T","I","M","P","E","A","C","H","M","E","N","T","S","T","A","T","E","L","E","G","I","S","L","A","T","U","R","E","S","O","A","T","H","F","I","V","E","S","I","X","T","H","I","R","T","Y","F","I","V","E"];
var score1=0;
var score2=0;
var score3=0;
var score4=0;
var score5=0;
var score6=0;
var score7=0;

function Submit1(){
    var enterWord = input1.value;
    enterWord = enterWord.toUpperCase();

    if(enterWord == list1[0])
    {
        a1.innerHTML = let1[0];
        a2.innerHTML = let1[1];
        a3.innerHTML = let1[2];
        a4.innerHTML = let1[3];
        a5.innerHTML = let1[4];
        a6.innerHTML = let1[5];
        a7.innerHTML = let1[6];
        a8.innerHTML = let1[7];
        a9.innerHTML = let1[8];
        a10.innerHTML =let1[9];
        input1.value = "";
        score1 = 1;
    }

    if(enterWord == list1[1])
    {
        b1.innerHTML = let1[10];
        b2.innerHTML = let1[11];
        b3.innerHTML = let1[12];
        b4.innerHTML = let1[13];
        b5.innerHTML = let1[14];
        b6.innerHTML = let1[15];
        b7.innerHTML = let1[16];
        b8.innerHTML = let1[17];
        b9.innerHTML = let1[18];
        b10.innerHTML = let1[19];
        a10.innerHTML = let1[20];
        input1.value = "";
        score2 = 1;
    }

    if(enterWord == list1[2] || enterWord == "STATE LEGISLATURES")
    {
        c1.innerHTML = let1[21];
        c2.innerHTML = let1[22];
        c3.innerHTML = let1[23];
        c4.innerHTML = let1[24];
        c5.innerHTML = let1[25];
        c6.innerHTML = let1[26];
        a8.innerHTML = let1[27];
        c7.innerHTML = let1[28];
        c8.innerHTML = let1[29];
        c9.innerHTML = let1[30];
        c10.innerHTML = let1[31];
        c11.innerHTML = let1[32];
        c12.innerHTML = let1[33];
        c13.innerHTML = let1[34];
        c14.innerHTML = let1[35];
        c15.innerHTML = let1[36];
        c16.innerHTML = let1[37];
        input1.value = "";
        score3 = 1
    }

    if(enterWord == list1[3])
    {
                
        d1.innerHTML = let1[38];
        c3.innerHTML = let1[39];
        d2.innerHTML = let1[40];
        b7.innerHTML = let1[41];
        input1.value = "";
        score1 = 1
    }
    
    if(enterWord == list1[4])
    {        
        e1.innerHTML = let1[42];
        e2.innerHTML = let1[43];
        e3.innerHTML = let1[44];
        c5.innerHTML = let1[45];
        input1.value = "";
        score1 = 1
    }

    if(enterWord == list1[5])
    {
        c16.innerHTML = let1[46];
        f1.innerHTML = let1[47];
        f2.innerHTML = let1[48];
        input1.value = "";
        score1 = 1
    }
                
    if(enterWord == list1[6] || enterWord == "THIRTY FIVE")
    {
        g1.innerHTML = let1[49];
        g2.innerHTML = let1[50];
        c8.innerHTML = let1[51];
        g3.innerHTML = let1[52];
        g4.innerHTML = let1[53];
        g5.innerHTML = let1[54];
        g6.innerHTML = let1[55];
        g7.innerHTML = let1[56];
        g8.innerHTML = let1[57];
        g9.innerHTML = let1[58];
        input1.value = "";
        score1 = 1
    }
    else
    {
        input1.value = "";
    }
        
        var result = score1+score2+score3+score1+score1+score1+score1;

        
         if (result == 7) {
                 var end = Date.now() + (15 * 1000);
var duration = 15 * 1000;
var animationEnd = Date.now() + duration;
var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

var interval = setInterval(function() {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
        return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
}, 250);
                }
             

        
}