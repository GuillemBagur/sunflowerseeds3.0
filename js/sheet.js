// All the code refering exclusively to the sheet HTML element

class Text {
  constructor(lastHistory, currentText) {
    this.lastHistory = lastHistory;
    this.currentText = currentText;
  }

  setNewHistory = (text) => {
    this.lastHistory = this.currentText;
  }

  setNewCurrentText = (text) => {
    this.currentText = text;
  }
}

/**
 * Gets the innerText of the sheet element.
 * @returns The text of the sheet element.
 */
const getMainText = () => getText(sheetEl);

/**
 * Gets the innerHTML of the sheet element.
 * @returns The HTML of the sheet element.
 */
const getMainHTML = () => getHTML(sheetEl);

let mainText = new Text(getMainText(), getMainText());

const saveSheetText = () => saveOptions({ text: getMainText() });

const saveTextToHistory = () => saveOptions({ history: getMainText() });

const checkTextMajorChanges = () =>
  checkMajorChanges(mainText.lastHistory, mainText.currentText);

const checkTextChangesAndSave = () => {
  if (!checkTextMajorChanges()) return;
  mainText.setNewHistory();
  saveTextToHistory();
};

const sheetHandler = () => {
  mainText.setNewCurrentText(getMainText());
  checkTextChangesAndSave();
  saveSheetText();
  copyToClipBoard(getMainText());
};
