// All the EventListeners and all other types of actions to perform after the document is completely loaded

const init = () => {
  sheetEl.addEventListener("keyup", sheetHandler);
  optionsSidebarEl.innerHTML = renderOptions();
  optionsSidebarEl.addEventListener("input", optionsHandler);
  optionsSidebarEl.addEventListener("click", saveNewLetterToHighlight);
  loadStyleOptions();
};

document.addEventListener("DOMContentLoaded", init);
