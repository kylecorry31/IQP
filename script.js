var books = document.getElementsByClassName('section');

var colors = ["#052d4b", "#0299d0", "#59181f", "#d99923", "#f2c0a2"];

function complimentary(color){
    switch (color) {
        case '#052d4b':
            return chooseRandom(['#d99923', '#0299d0']);
        case '#0299d0':
            return chooseRandom(['#59181f', '#052d4b']);
        case '#59181f':
            return chooseRandom(['#0299d0', '#f2c0a2']);
        case '#d99923':
            return chooseRandom(['#052d4b', '#59181f']);
        default:
            return chooseRandom(['#59181f', '#052d4b']);
    }
}

function chooseRandom(arr){
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

var availableColors = colors.slice();

for(var i = 0;i < books.length; i++) {
    var color = chooseRandom(availableColors);
    var fontSize = (Math.random()) + 1;
    var complimentaryColor = complimentary(color);
    books[i].style.background = color;
    books[i].style.marginTop = Math.floor(Math.random() * 5) + "px";
    books[i].style.fontSize = fontSize + "rem";
    books[i].style.minWidth = 50 + Math.random() * 20 + "%";
    books[i].style.color = complimentaryColor;
    books[i].querySelector('h1').style.lineHeight = fontSize + 1.5 + "rem";
    books[i].querySelector('p').style.color = complimentaryColor;
    books[i].addEventListener('mouseover', function(){
        // var audio = document.getElementById("book_move");
        // audio.play();
    })
    availableColors = colors.slice();
    if (Math.random() < 0.9){
        availableColors.splice(availableColors.indexOf(color), 1);
    }
};
