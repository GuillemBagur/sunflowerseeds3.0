const renderOptions = () => {
  const options = {
    textFormat: {
      fontSize: generateSlider({
        id: "fontSize",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      lineHeight: generateSlider({
        id: "lineHeight",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      wordSpacing: generateSlider({
        id: "wordSpacing",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      letterSpacing: generateSlider({
        id: "letterSpacing",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      fontFamily: generateOptionsSelect({
        id: "fontFamily",
        options: [
          { text: "Comic Sans MS", value: `"Comic Sans", "Comic Sans MS"` },
          { text: "Arial", value: "arial" },
        ],
        changeCSS: true,
      }),
      textAlign: generateOptionsSelect({
        id: "textAlign",
        className: "",
        options: [
          { text: "Justificat", value: "justify" },
          { text: "Esquerra", value: "left" },
          { text: "Centrat", value: "center" },
          { text: "Dreta", value: "right" },
        ],
        changeCSS: true,
      }),
    },

    changeColors: {
      backgroundColor: generateColorPicker({
        id: "backgroundColor",
        changeCSS: true,
      }),
      color: generateColorPicker({
        id: "color",
        changeCSS: true,
      }),
      difficultLetters: generateLettersHighlighterInput({
        id: "difficultLetters",
        idInput: "newDifficultLetter",
        idColorChooser: "newDifficultLetterColor",
        idDump: "difficultLettersDump",
        className: "",
        letters: loadOptions()["difficult-letters"],
        changeCSS: true,
      }),
    },

    langAndAudio: {
      lang: generateOptionsSelect({
        id: "lang",
        className: "",
        options: [
          { text: "Català", value: "ca" },
          { text: "Español", value: "es" },
          { text: "English", value: "en" },
          { text: "Suomi", value: "fi" },
        ],
        changeCSS: true,
      }),
      voiceLang: generateSlider({
        id: "voiceLang",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      voiceAccent: generateSlider({
        id: "voiceAccent",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      voiceSpeed: generateSlider({
        id: "voiceSpeed",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      voiceHighlight: generateSlider({
        id: "voiceHighlight",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      highlightColor: generateSlider({
        id: "highlightColor",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
      automaticCorrection: generateSlider({
        id: "automaticCorrection",
        min: 10,
        max: 30,
        changeCSS: true,
      }),
    },
  };

  let html = "";
  for (let fieldKey in options) {
    const fieldSet = options[fieldKey];
    html += `<fieldset>`;
    for (let optionKey in fieldSet) {
      const option = fieldSet[optionKey];
      html += option;
    }

    html += `</fieldset>`;
  }

  return html;
};

/**
 * Changes (and saves) an option field from its HTML element.
 * @param {HTML element} target The HTML input to get all the data from.
 */
const changeOptionByInput = (target) => {
  if (!target) return;

  if (target.dataset.type !== "options") return;
  const styleToModify = target.dataset.style;
  sheetEl.style[styleToModify] = `${target.value}${
    target.dataset.stylesufix ?? ""
  }`;
  let toSave = {};
  toSave[styleToModify] = target.value;
  saveOptions({ options: toSave });
};

/**
 * Changes the color of an specific letter to highlight (from the user's difficult letters list).
 * @param {HTML Element} target The input that modifies the color of the desired letter in the list.
 */
const changeDifficultLetterColors = (target) => {
  if (!target) return;

  if (target.dataset.type !== "difficult-letters") return;
  const letterToChangeColor = target.dataset.letter;
  const newColor = target.value;
  let toSave = {};
  toSave[letterToChangeColor] = newColor;
  saveOptions({ "difficult-letters": toSave });
};

/**
 * A function that fires everytime there's an input change in the Options Panel.
 * @param {event} e The event that propagates the EventListener.
 */
const optionsHandler = (e) => {
  const target = e.target;
  changeOptionByInput(target);
  changeDifficultLetterColors(target);
};

/**
 * Sets every input's value the value passed by param.
 * @param {object} options All options object (key-value).
 */
const initOptionInputs = (options = {}) => {
  for (let option in options) {
    const el = document.querySelector(`#${option}[data-style="${option}"]`);
    if (!el) continue;
    const newValue = options[option];
    if (newValue) {
      el.value = newValue;
    }

    changeOptionByInput(el);
  }
};

/**
 * Loads all the options from localStorage.
 */
const loadStyleOptions = () => {
  const loadedData = loadOptions();
  const loadedOptions = loadedData.options;
  initOptionInputs(loadedOptions);
};

/**
 * Refreshes the OptionsPanel component. It's very useful make changes visible after modifying the user's difficult letters list.
 */
const refreshOptionsPanel = () => {
  optionsSidebarEl.innerHTML = renderOptions();
  loadStyleOptions();
};

/**
 * Saves the letter that contains the "newDifficultLetter" HTML Select to the user's difficult letters list.
 * Then, it refrseshes the OptionsPanel component.
 * @param {HTML Element} target The target that has received the click (it must be a button with the id "addLetterToHighlight").
 */
const saveNewLetterToHighlight = (target) => {
  if (!target) return;
  if (target.id !== "addLetterToHighlight") return;
  const letter = document.getElementById("newDifficultLetter").value;
  let toSave = {};
  toSave[letter] = "#000000";
  saveOptions({ "difficult-letters": toSave });
  refreshOptionsPanel();
  const letterGetterEl = document.getElementById("newDifficultLetter");
  letterGetterEl.value = "";
};

/**
 * Removes the desired letter from the user's difficult letters list.
 * Then, it refrseshes the OptionsPanel component.
 * @param {HTML Element} target The target that has received the click (it must be a button with the dataset: "deleteHighlightedLetter").
 */
const deleteHighlightedLetter = (target) => {
  if (!target) return;
  if (target.dataset.type !== "deleteHighlightedLetter") return;
  const confirm = popup(
    "confirm",
    "¿Seguro que quieres eliminar el resaltado de esta letra?",
    (res) => res
  );
  if (!confirm) return;
  const letter = target.dataset.letter;
  let toSave = {};
  toSave[letter] = "#000000";
  saveOptions({ "difficult-letters": toSave }, true);
  refreshOptionsPanel();
};
