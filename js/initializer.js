// All the EventListeners and all other types of actions to perform after the document is completely loaded

const init = () => {
  sheetEl.addEventListener("keyup", sheetHandler);
  refreshOptionsPanel();
  optionsSidebarEl.addEventListener("input", optionsHandler);
  optionsSidebarEl.addEventListener("click", ({target}) => {
    saveNewLetterToHighlight(target);
    deleteHighlightedLetter(target);
  });
  loadStyleOptions();
};

document.addEventListener("DOMContentLoaded", init);
