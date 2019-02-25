var pageID = 0;

document.body.addEventListener('keypress', function(event){
  if (event.key === "a"){
    pageID--;
    var page = document.getElementById('group' + pageID);
    if (page){
      document.getElementById('group' + (pageID + 1)).classList.add('hidden');
      setTimeout(function () {
        page.classList.remove('hidden');
      }, 1000);
    } else {
      pageID++;
    }
  } else if (event.key === "d" || event.key == " "){
    pageID++;
    var page = document.getElementById('group' + pageID);
    if (page){
      document.getElementById('group' + (pageID - 1)).classList.add('hidden');
      setTimeout(function () {
        page.classList.remove('hidden');
      }, 1000);
    } else {
      pageID--;
    }
  } else if (event.key == 'q'){
    window.history.back();
  }  
});
