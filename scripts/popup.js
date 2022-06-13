
  document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('setting');
    checkPageButton.addEventListener('click', function() {
      window.open("settingPage.html");
    }, false);
  }, false);

  //document.addEventListener('DOMContentLoaded', documentEvents  , false);

function myAction(input) {
    console.log("input value is : " + input.value);
    alert("The entered data is : " + input.value);
    // do processing with data
    // you need to right click the extension icon and choose "inspect popup"
    // to view the messages appearing on the console.
}

// COPYURL button
var button = document.getElementById("copyUrl_btn");
button.addEventListener("click", function(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      let redditCheck = url.substring(0, 25);
      if (redditCheck != "https://www.reddit.com/r/"){
        errormsg.innerText = "Please copy a Reddit Post URL";
      }
      else {
        document.getElementById("url_textbox").value =  url;
      }
    });

});

// ANALYSE BUTTON
var button = document.getElementById("analyse_btn");
button.addEventListener("click", function(){
    var url = document.getElementById("url_textbox").value;
    console.log(url);
    let redditCheck = url.substring(0, 25);
    if (redditCheck != "https://www.reddit.com/r/"){
      errormsg.innerText = "Please enter a Reddit Post URL";
    }
    else {
      errormsg.innerText = "";
      localStorage.setItem('url', url)
      window.open("../templates/results.html");

    }

});
// function documentEvents() {
//   document.getElementById('analyse_btn').addEventListener('click',
//     function() { myAction(document.getElementById('url_textbox'));
// let pattern = https:\//www.reddit.com/r/.*/(comments|duplicates)/.*/.*;
//   });
// }
//  I commented this function out since it just gives a pop-up with the url data inside.

function getUrl(){
  document.getElementById("url_textbox").value=Window.location.herf
}

document.addEventListener('DOMContentLoaded', function(){
  var checkPageButton = document.getElementById('copyUrl');
  checkPageButton.addEventListener('click',function(){
    document.getElementById("url_textbox").value=window.location.href
  },false);

},false);
