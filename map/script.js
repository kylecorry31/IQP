var pageID = 0;

document.body.addEventListener('keypress', function(event){
  if (event.key === "a"){
    pageID--;
    var page = document.getElementById('group' + pageID);
    if (page){
      document.getElementById('group' + (pageID + 1)).classList.add('hidden');
      var pages = document.getElementsByClassName('page-group');
      setTimeout(function () {
        for (var i = 0; i < pages.length; i++){
          pages[i].classList.add('hidden');
        }
        page.classList.remove('hidden');
      }, 1000);
    } else {
      pageID++;
    }
  } else if (event.key === "d" || event.key == " "){
    pageID++;
    var page = document.getElementById('group' + pageID);
    if (page){
      var pages = document.getElementsByClassName('page-group');
      document.getElementById('group' + (pageID - 1)).classList.add('hidden');
      setTimeout(function () {
        for (var i = 0; i < pages.length; i++){
          pages[i].classList.add('hidden');
        }
        page.classList.remove('hidden');
      }, 1000);
    } else {
      pageID--;
    }
  }
});
