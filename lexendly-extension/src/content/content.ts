function applyStyles(fontSize: string, fontFamily: string) {
  document.body.style.fontSize = fontSize;
  document.body.style.fontFamily = fontFamily;
}

chrome.storage.sync.get(["fontSize", "fontFamily"], (data) => {
  applyStyles(data.fontSize || "16px", data.fontFamily || "Arial");
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.fontSize || changes.fontFamily) {
    const newFontSize = changes.fontSize?.newValue || "16px";
    const newFontFamily = changes.fontFamily?.newValue || "Arial";
    applyStyles(newFontSize, newFontFamily);
  }
});
