
function hideLoader() {
    var loader = document.getElementById("loader");
    loader.style.display = "none";
  }
  
  function showLoader() {
    var loader = document.getElementById("loader");
    loader.style.position="fixed";
  }
  

  setTimeout(function() {
    showLoader();
  
    setTimeout(function() {
      hideLoader();
  
      document.getElementById("app").style.display = "block";
    }, 5000); 
  }, 5000);
  