var rowLen = 1;
var i = 0;
var filesTable = wnd.querySelector("#filesTable");
var dir = wnd.querySelector("#dir");
var curDir = fs;
var curDir_str = "";
var newBtn = wnd.querySelector("#newBtn");
var rootBtn = wnd.querySelector("#rootBtn");
var deleteBtn = wnd.querySelector("#deleteBtn");
filesTable.innerHTML += "<tr>";
updateState();
var openSelected = function() {Window(250,250,'fm-opendlg', {flags: flags_useCustomTitlebar});}
wnd.querySelector("#openBtn").onclick = openSelected;
newBtn.onclick = function() {
  fsapi.newFile(("_path" in curDir? curDir._path + "/" : "") + prompt("File Name:"), "This is a new file.");
  updateState();
}
rootBtn.onclick = function() {
  curDir = fs;
  curDir_str = "";
  updateState();
}
deleteBtn.onclick = function() {
  var fname = prompt("File: ");
  if(typeof(curDir[fname]) == "object") {
    if(confirm("Are you sure you want to delete the folder '" + fname + "' and all its contents?")) {
      delete curDir[fname];
    }
  } else {
    delete curDir[fname];
  }
  fsapi.saveFs();
  updateState();
}
function updateState() {
  var finnerHTML = "";
  for(var file in curDir) {
    if(file != "_path") {
      finnerHTML += `<div class='flex-item'>${(typeof(curDir[file])).toLowerCase() == "string"? file : "<b>" + file + "</b>"}</div>`;
    }
  }
  dir.textContent = "/" + (curDir._path? curDir._path : "");
  curDir_str = curDir._path;
  filesTable.innerHTML = finnerHTML;
  updateDirEventHandlers(filesTable.querySelectorAll('.flex-item'));
}
function updateDirEventHandlers(dirbtns) {
  for(let btn of dirbtns) {
    btn.ondblclick = function(e) {
      if((typeof(curDir[e.target.innerText])).toLowerCase() != "string") {
        curDir = curDir[e.target.innerText];
        updateState();
      } else {
        updateState();
        Window(200,200,"text",{params: {file: (curDir._path != ""? curDir._path + "/" : "") + e.target.innerText}});
      }
    }
  }
}