import $ from 'jquery';
import findAndReplaceDOMText from 'findandreplacedomtext';

const CLASS_NAME = 'octo-linker-link';

function createLinkElement(text, dataAttr = {}) {
  const linkEl = document.createElement('span');

  // Set link text
  linkEl.innerHTML = text;

  // Add css classes
  linkEl.classList.add(CLASS_NAME);

  // Add data-* attributes
  for (const key in dataAttr) {
    if (dataAttr.hasOwnProperty(key)) {
      linkEl.dataset[key] = dataAttr[key];
    }
  }

  return linkEl;
}

function replace(portion, match, type, path) {
  const isAlreadyWrapped = portion.node.parentNode.classList.contains(CLASS_NAME);

  if (isAlreadyWrapped) {
    return portion.text;
  }

  const value = match[1].replace(/['|"]/g, '');

  let offset = 0;
  if (match[1].length !== value.length) {
    offset = 1;
  }

  const valueStartPos = match[0].indexOf(match[1]) + offset;
  const valueEndPos = valueStartPos + value.length;
  const portionEndPos = portion.indexInMatch + portion.text.length;

  if (valueStartPos === portion.indexInMatch) {
    if (portionEndPos === valueEndPos) {
      return createLinkElement(portion.text, { value, type, path });
    }

    let node = portion.node;
    while (!node.textContent.includes(match[1])) {
      node = node.parentNode;
    }

    if (node) {
      $(node).wrap(createLinkElement('', { value, type, path }));
    }
  }

  return portion.text;
}

export default function (blob, regexs) {
  const { el, type, path } = blob;

  regexs.forEach((regex) => {
    findAndReplaceDOMText(el, {
      find: regex,
      replace: (portion, match) => replace(portion, match, type, path),
    });
  });
}
