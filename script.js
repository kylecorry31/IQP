var books = document.getElementsByClassName('section');

var colors = ["#052d4b", "#0299d0", "#59181f", "#d99923", "#f2c0a2"];

function complimentary(color){
    switch (color) {
        case '#052d4b':
            return random(['#d99923', '#0299d0']);
        case '#0299d0':
            return random(['#59181f', '#052d4b']);
        case '#59181f':
            return random(['#0299d0', '#f2c0a2']);
        case '#d99923':
            return random(['#052d4b', '#59181f']);
        default:
            return random(['#59181f', '#052d4b']);
    }
}

function getRGB(color){
    switch(color){
        case '#052d4b':
            return '5, 45, 75';
        case '#0299d0':
            return '2, 153, 208';
        case '#59181f':
            return '89, 24, 31';
        case '#d99923':
            return '217, 153, 35';
        default:
            return '242, 192, 162';
    }
}

function setup(){
    randomSeed(4);
    var availableColors = colors.slice();

    for(var i = 0;i < books.length; i++) {
        var color = random(availableColors);
        var fontSize = random(1, 2);
        var complimentaryColor = complimentary(color);
        
        books[i].style.background = 'linear-gradient(rgba('+getRGB(color)+', 0.85), rgba('+getRGB(color)+', 0.85)), url(\'parchment.jpg\')';
        books[i].style.marginTop = random(5) + "px";
        books[i].style.fontSize = fontSize + "rem";
        books[i].style.minWidth = random(50, 70) + "%";
        books[i].style.color = 'rgba(' + getRGB(complimentaryColor) + ', 0.9)';
        books[i].querySelector('h1').style.lineHeight = fontSize + 1.5 + "rem";
        books[i].querySelector('p').style.color = complimentaryColor;
        books[i].addEventListener('mouseover', function(){
            // var audio = document.getElementById("book_move");
            // audio.play();
        })
        availableColors = colors.slice();
        if (random() < 0.9){
            availableColors.splice(availableColors.indexOf(color), 1);
        }
    };
}