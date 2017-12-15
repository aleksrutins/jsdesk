var save = wnd.querySelector("#save");
var theme = wnd.querySelector("#theme");
var ios = wnd.querySelector("#ios");
if(localStorage["theme"]) {
  for (let i = 0; i < theme.options.length; i++) {
    if(theme.options[i].value == localStorage["theme"]) {
      theme.selectedIndex = i;
    }
  }
  if(localStorage["theme"] === "macosx") {
    ios.style.display = "inline";
    ios.querySelector("#ioscb").checked = localStorage["iOS"] == "true";
  }
}
theme.onchange = (e) => {
  if(theme.selectedOptions[0].value == "macosx") {
    ios.style.display = "inline";
  } else {
    ios.style.display = "none";
  }
}
save.onclick = function() {
  localStorage["theme"] = theme.selectedOptions[0].value;
  localStorage["iOS"] = ios.querySelector("#ioscb").checked;
  location.reload();
}