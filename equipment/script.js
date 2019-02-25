var pageID = 0;

document.body.addEventListener('keypress', function(event){
  if (event.key === "a"){
    pageID--;
    var page = document.getElementById('group' + pageID);
    if (page){
      var pages = document.getElementsByClassName('page-group');
      document.getElementById('group' + (pageID + 1)).classList.add('hidden');
      setTimeout(function () {
        for (var i = 0; i < pages.length; i++){
          if(pages[i].id != "empty-pages")
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
          if(pages[i].id != "empty-pages")
            pages[i].classList.add('hidden');
        }
        page.classList.remove('hidden');
      }, 1000);
    } else {
      pageID--;
    }
  } else if (event.key == 'q'){
    window.history.back();
  }  
});
