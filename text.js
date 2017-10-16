var curFile = "fs['AppData']['TextEdit']";
var openBtn = wnd.querySelector("#openBtn");
var area = wnd.querySelector('#area');
var curFileName = "intro.txt"
var openFile = function(fileName) {
  setTitle(fileName + " - TextEdit");
  wnd.querySelector("#area").innerText = fsapi.readFile(fileName);
  curFile = "fs";
  var fileParts = fileName.split("/");
  curFileName = fileParts.pop();
  for(let f of fileParts) {
    curFile += `['${f}']`
  }
}
openBtn.onclick = () => {
  openFile(prompt("File Name:"))
}
if(wnd.params != undefined) {
  openFile(wnd.params.file);
}
var saveBtn = wnd.querySelector("#saveBtn");
saveBtn.onclick = function() {
  (eval(curFile))[curFileName] = area.textContent;
  fsapi.saveFs();
}