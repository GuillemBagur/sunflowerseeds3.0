// All the functions used in a lot of different js files

/**
 * Removes the HTML tags from a string.
 * @param {string} html A string with HTML tags.
 * @returns The clean string (without HTML tags).
 */
const removeTags = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

/**
 * Returns the innerText of an HTML element passed by param. Maybe, you'll find
 * it a stupid function, but it refers the action of getting ONLY the text at perfection.
 *
 * @param {HTML element} element The element to get the innerText from.
 * @returns The innerText of the element in string format.
 */

const getText = (element) => element.innerText;

/* While the upper function expects to work fine, it'll keep commented.
That was to try to keep ln when we extracted the text.
    
const getText = (element) => {
  const html = getHTML(element);
  const parsedLineBreaksHtml = html.replace(/<br\s*\/?>/gi, "\n");
  const result = removeTags(parsedLineBreaksHtml);
  return result;
};
 */

/**
 * Returns the innerHTML of an HTML element passed by param. Maybe, you'll find
 * it a stupid function, but it refers the action of getting the entire HTML string at perfection.
 *
 * @param {HTML element} element The element to get the innerHTMl from.
 * @returns The HTML text of the element in string format.
 */
const getHTML = (element) => element.innerHTML;

/**
 * Gets the localStorage data of the given key.
 * @param {string} key The key of the localStorage item.
 * @returns The string stored in the given key.
 */
const getFromLS = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return false;
  return data;
};

/**
 * Parses a string into a JSON.
 * @param {string} string The string to parse.
 * @returns A JSON structure of the string.
 */
const parseString = (string) => JSON.parse(string);

/**
 * Generates an empty schema to save the options in localStorage.
 * @returns An object with the JSON object of the options.
 */
const createOptionsSchema = () => {
  const schema = {
    text: "",
    history: [],
    options: {
      fontSize: "",
      lineHeight: "",
      wordSpacing: "",
      letterSpacing: "",
      fontFamily: "",
      textAlign: "",
      backgroundColor: "",
      color: "",
      difficultLetters: "",
      lang: "",
      voiceLang: "",
      voiceAccent: "",
      voiceSpeed: "",
      voiceHighlight: "",
      highlightColor: "",
      automaticCorrection: "",
    },
    "difficult-letters": {},
  };

  return schema;
};

/**
 * Searches for a key in a Schema.
 * @param {string} key The key to search for.
 * @param {Object} schema The schema to search in.
 * @returns True if the key exists and False if not.
 */
const checkKey = (key, schema) => {
  const schemaKeys = Object.keys(schema);
  return schemaKeys.includes(key);
};

/**
 * Searches for a key in the Options Schema.
 * @param {string} key The key to search for.
 * @returns True if the key exists and False if not.
 */
const checkKeyInOptions = (key) => checkKey(key, createOptionsSchema());

/**
 * Get the user options saved in the LocalStorage.
 * @returns The options saved by the user in JSON format.
 */
const loadOptions = () => {
  const rawOptions = getFromLS("sunflowerseeds");
  const data = parseString(rawOptions);
  if (!data) return createOptionsSchema();
  return data;
};

/**
 * Save data into the localStorage options key.
 * @param {object} data A key-value structure of new data to save into the localStorage.
 */
const saveOptions = (data) => {
  // Load the previous data from LocalStorage
  let previousOptions = loadOptions();

  const actionPerKey = {
    history: (prevData, newValue) => {
      let newHistory = [...prevData];
      newHistory.push(newValue);
      const historyMaxLenght = 10;
      const maxLengthDiff =
        newHistory.length - historyMaxLenght >= 0
          ? newHistory.length - historyMaxLenght
          : 0;
      newHistory.splice(0, maxLengthDiff);
      return newHistory;
    },

    options: (prevData, newPair) => {
      if (!Object.keys(newPair).length) return "";
      const key = Object.keys(newPair)[0];
      const newValue = newPair[key];
      let newData = { ...prevData };
      newData[key] = newValue;
      return newData;
    },

    "difficult-letters": (prevData, newLetter) => {
      console.log(newLetter);
      const letter = Object.keys(newLetter)[0];
      const color = Object.values(newLetter)[0];
      let newData = { ...prevData };
      newData[letter] = color ?? "#000";
      return newData;
    },
  };

  // Modify changes
  Object.keys(data).forEach((key) => {
    if (!checkKeyInOptions(key)) return;
    const newData = data[key];
    const action = actionPerKey[key];
    if (action) {
      previousOptions[key] = action(previousOptions[key], newData);
      return;
    }

    previousOptions[key] = newData;
  });

  // Save the data
  const parsedOptions = JSON.stringify(previousOptions);
  localStorage.setItem("sunflowerseeds", parsedOptions);
};

/**
 * A bullet-proof way to copy the param given text to clipboard.
 * @param {string} text The text to copy to clipboard.
 */
const copyToClipBoard = (text) => {
  try {
    navigator.clipboard.writeText(text);
  } catch (e) {
    document.execCommand("copy");
  }
};

/**
 * Gets the Levenshtein Distance between two strings.
 * @param {string} string1 The first string to compare.
 * @param {string} string2 The second string to compare with the first one.
 * @returns The edit distance (Levenshtein Distance) between both strings.
 */
const levenshteinDistance = (string1, string2) => {
  if (!string1.length) return string2.length;
  if (!string2.length) return string1.length;
  const arr = [];
  for (let i = 0; i <= string2.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= string1.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (string1[j - 1] === string2[i - 1] ? 0 : 1)
            );
    }
  }

  return arr[string2.length][string1.length];
};

/**
 * Compares two strings and decides if there are a lot of differences between them.
 * @param {string} prevText The text from before.
 * @param {string} newText The current text.
 * @returns True or False depending if there are a lot of differences between both strings.
 */
const checkMajorChanges = (prevText, newText) => {
  // Compares both texts length
  if (Math.abs(prevText.length - newText.length) > 70) return true;

  return false;
};

/**
 * Generates an input for the options panel.
 * @param {string} type The input type we want to create.
 * @returns A string that is the whole HTML code to render the desired input.
 */
const generateOptionsInput =
  (type) =>
  ({ id, className, min = "", max = "" }, sufix = "") =>
    `<input type="${type}" id="${id}" class="${className}" data-style="${id}" data-stylesufix="${sufix}" min="${min}" max="${max}" data-type="options" />`;

const generateSlider = (options) =>
  generateOptionsInput("range")(options, "px");
const generateColorPicker = (options) => generateOptionsInput("color")(options);

/**
 * Generates a select for the options panel.
 * @param {object} Options The HTML attributes that the select must have.
 * @returns A string that is the whole HTML code to render a select.
 */
const generateOptionsSelect = ({ id, className, options = [] }) => {
  let optionsHTML = `<select id="${id}" class="${className}" data-style="${id}" data-type="options">`;
  for (let option of options) {
    const optionHTML = `<option value="${option.value}">${option.text}</option>`;
    optionsHTML += optionHTML;
  }

  optionsHTML += `</select>`;
  return optionsHTML;
};

const generateLetterGetter = (options) => generateOptionsSelect(options);

const generateLettersDump = ({id, letters}) => {
  console.log(letters);
  let lettersHTML = "";
  for (let letter in letters) {
    const color = letters[letter];
    lettersHTML += `<li class="difficult-letters-dump__difficult-letter">${letter} <input type="color" data-type="difficult-letters" id="${letter}Highlight" value="${color}"><button>Eliminar</button></li>`;
  }

  const result = `<ul id="${id}" class="difficult-letters-dump">${lettersHTML}</ul>`;
  return result;
};

const generateLettersHighlighterInput = ({
  id,
  idInput,
  idDump,
  className,
  letters = [],
}) => {
  console.log(letters);
  let lettersHighlighterHTML = `<div id="${id}" class="${className}">`;
  // Generate both HTML Inputs
  // Generate the letters dump
  lettersHighlighterHTML += generateLettersDump({
    id: idDump,
    letters: letters,
  });

  // Generate the letter input
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const mappedAlphabet = alphabet.map((letter) => {
    return { text: letter, value: letter };
  }); // An alphabet with key value (to generate the select element).
  lettersHighlighterHTML += generateLetterGetter({
    id: idInput,
    options: mappedAlphabet,
  });
  lettersHighlighterHTML += `<button id="addLetterToHighlight">Agregar letra</button>`;

  lettersHighlighterHTML += "</div>";

  return lettersHighlighterHTML;
};
