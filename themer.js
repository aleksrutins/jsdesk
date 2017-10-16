var save = wnd.querySelector("#save");
var theme = wnd.querySelector("#theme");
if(localStorage["theme"]) {
  for (let i = 0; i < theme.options.length; i++) {
    if(theme.options[i].value == localStorage["theme"]) {
      theme.selectedIndex = i;
    }
  }
}
save.onclick = function() {
  localStorage["theme"] = theme.selectedOptions[0].value;
  location.reload();
}