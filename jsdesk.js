var windows = 0;
var oldHeight = 0;
var oldWidth = 0;
var oldX = 0;
var oldY = 0;
var allWnds = [];
var normWinTitleHt = 0;
var flags_noMaximizeMinimize = 1;
var flags_useCustomTitlebar = 2;
var mouseDown = false;
document.addEventListener('mousedown', function() {
  mouseDown = true;
})
document.addEventListener('mouseup', function() {
  mouseDown = false;
})
var fsapi = {
  newFile(path, content="") {
      var pathParts = path.split("/");
      var fileName = pathParts.pop();
      var dir = "fs";
    var curDir = "fs";
    var lastDir = "fs";
      var i = 0;
      for(; i < pathParts.length; i++) {
        if (lastDir != curDir) {
          lastDir += "." + pathParts[i-1];
        }
          if(typeof((eval(curDir))[pathParts[i]]) == "undefined") {
              (eval(curDir))[pathParts[i]] = {_path: ((eval(lastDir))._path ? (eval(lastDir))._path + "/" : "") + pathParts[i]};
          }
          dir += "." + pathParts[i];
        curDir += '.' + pathParts[i];
      }
      (eval(curDir))[fileName] = content;
      localStorage['fs'] = JSON.stringify(fs);
  },
  readFile(file) {
    file = file.split("/");
    var fileContents = fs;
    for(var i = 0; i < file.length; i++) {
      fileContents = fileContents[file[i]];
    }
    return fileContents;
  },
  saveFs() {
    localStorage['fs'] = JSON.stringify(fs);
  }
};
function Window(x, y, template, options) {
  var elem = document.createElement("table");
  var titleTR = document.createElement("tr");
  var closeTD = document.createElement("td");
  var titleSpan = document.createElement("span");
  var contentTD = document.createElement("td");
  var contentTR = document.createElement("tr");
  var contentxhttp = new XMLHttpRequest();
  elem.id = (document.getElementById(`window${windows}`)? `window${windows}1` : `window${windows}`);
  closeTD.innerHTML = `<button data-window-id="#${elem.id}" onclick='closeWindow(document.querySelector(this.getAttribute("data-window-id")))' class='window-button close'>X</button>
${!(options && (options & flags_noMaximizeMinimize))? `
<button data-window-id="#${elem.id}" onclick='document.querySelector(this.getAttribute("data-window-id")).style.height = oldHeight + "px";document.querySelector(this.getAttribute("data-window-id")).style.width = oldWidth + "px";document.querySelector(this.getAttribute("data-window-id")).style.top = oldY;document.querySelector(this.getAttribute("data-window-id")).style.left = oldX;document.querySelector(this.getAttribute("data-window-id")).querySelector(".window-title").style.height = normWinTitleHt;' class='window-button minimize'>-</button>
<button data-window-id="#${elem.id}" onclick='oldHeight = document.querySelector(this.getAttribute("data-window-id")).clientHeight;oldWidth = document.querySelector(this.getAttribute("data-window-id")).clientWidth;document.querySelector(this.getAttribute("data-window-id")).style.height = "100%";document.querySelector(this.getAttribute("data-window-id")).style.width = "100%";oldY = document.querySelector(this.getAttribute("data-window-id")).style.top;oldX = document.querySelector(this.getAttribute("data-window-id")).style.left;document.querySelector(this.getAttribute("data-window-id")).style.top = "0";document.querySelector(this.getAttribute("data-window-id")).style.left = "0";document.querySelector(this.getAttribute("data-window-id")).querySelector(".window-title").style.height = normWinTitleHt;' class='window-button maximize'>+</button>` : ''}`
  titleTR.classList.add('window-title');
  titleTR.appendChild(closeTD);
  elem.onmousedown = function() {
    elem.style.zIndex = 50;
    for(let wnd of allWnds) {
      if (wnd != elem && typeof(wnd) !== "undefined") {
        wnd.style.zIndex = 0;
      }
    }
  }
  titleTR.onmousemove = (e) => {
    if(mouseDown) {
      elem.style.top = (e.clientY - 20).toString() + "px";
      elem.style.left = (e.clientX - 100).toString() + "px";
    }
  }
  contentTD.innerHTML = "<div class='loader'></div>";
  titleSpan.style.paddingRight = '5px';
  titleSpan.style.wordBreak = 'keep-all';
  normWinTitleHt = titleTR.clientHeight;
  contentxhttp.onreadystatechange = function() {
        if(contentxhttp.readyState == 4 && contentxhttp.status == 200) {
              contentTD.innerHTML = '';
              var nodes = applyComponents(contentxhttp.responseXML.childNodes[0]).childNodes;
              nodes.forEach(function (node) {
                    contentTD.innerHTML += node.outerHTML || "";
              });
              titleSpan.innerHTML = contentxhttp.responseXML.childNodes["0"].attributes["0"].nodeValue;
              closeTD.appendChild(titleSpan);
              (function() {
                var wnd = contentTD;
                var setTitle = function(newTitle) {
                  titleSpan.textContent = newTitle;
                }
                if (options && options.params) {
                  wnd.params = options.params;
                }
                eval(getTextSync(template + '.js'));
              })();
        }
  }
  if(!(options && (options.flags & flags_useCustomTitlebar))) elem.appendChild(titleTR);
  contentTR.appendChild(contentTD);
  elem.appendChild(contentTR);
  if(options && (options.flags & flags_useCustomTitlebar)) elem.classList.add('custom-title');
  elem.style.left = x.toString() + "px";
  elem.style.top = y.toString() + "px";
  windows++;
  elem.classList.add('window');
  contentxhttp.open("GET", template + ".xml", true);
  contentxhttp.send();
  allWnds.push(elem);
  document.body.appendChild(elem);
}
function Element(selector) {
      return document.querySelector(selector);
}
function applyComponents(html) {
      var fileAreas = html.querySelectorAll("file-area");
      fileAreas.forEach(function(area) {
        var file = area.getAttribute("file");
        area.textContent = fsapi.readFile(file);
      });
      var htmlAreas = html.querySelectorAll("html-area");
      htmlAreas.forEach(function(area) {
            var file = area.getAttribute("file");
            area.innerHTML = fsapi.readFile(file);
      });

      return html;
}
function getTextSync(file) {
      var text;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                  text = xhttp.responseText;
            }
      };
      xhttp.open("GET", file, false);
      xhttp.send();
      return text;
}
function getJsonSync(file) {
      return JSON.parse(getTextSync(file));
}
function closeWindow(wnd) {
      if(wnd.nodeName.toLowerCase()  == 'table') {
            document.body.removeChild(wnd);
      } else {
            document.body.removeChild(wnd.parentElement.parentElement);
      }
      windows--;
      delete allWnds[allWnds.indexOf(wnd)];
}