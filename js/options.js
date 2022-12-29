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
    backgroundColor: generateSlider({
      id: "changeColors",
      min: 10,
      max: 30,
      changeCSS: true,
    }),
    color: generateSlider({
      id: "color",
      min: 10,
      max: 30,
      changeCSS: true,
    }),
    difficultLetters: generateSlider({
      id: "difficultLetters",
      min: 10,
      max: 30,
      changeCSS: true,
    }),
  },

  langAndAudio: {
    lang: generateSlider({
      id: "lang",
      min: 10,
      max: 30,
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

const renderOptions = () => {
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

const changeOptionByInput = (target) => {
  if(!target) return;
  if (target.dataset.type !== "options") return;
  const styleToModify = target.dataset.style;
  sheetEl.style[styleToModify] = `${target.value}${
    target.dataset.stylesufix ?? ""
  }`;
  let toSave = [];
  toSave[styleToModify] = target.value;
  saveOptions({ options: toSave });
};

const optionsHandler = (e) => {
  const target = e.target;
  changeOptionByInput(target);
};


const initOptionInputs = (options = {}) => {
  for (let option in options) {
    const el = document.querySelector(`#${option}[data-style="${option}"]`);
    if(!el) continue;
    const newValue = options[option];
    if (newValue) {
      el.value = newValue;
    }

    changeOptionByInput(el);
  }
};

const loadStyleOptions = () => {
  const loadedData = loadOptions();
  const loadedOptions = loadedData.options;
  initOptionInputs(loadedOptions);
};