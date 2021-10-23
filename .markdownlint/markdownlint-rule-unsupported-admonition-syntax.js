// @ts-check

"use strict";

const { addErrorContext, filterTokens, addError } = require("./helpers");

module.exports = {
  "names": ['unsupported-admonition-syntax'],
  "description": 'Syntax not supported in either docusaurus or pandoc',
  "tags": ['containers'],
  "function": function noAdmonitionTitle(params, onError) {

    params.tokens.forEach( (token) => {
      if (token.type.includes("container_")) {
        if (token.type.includes("_open")) {
          let containerType = token.type.split("_")[1];

          if (token.info !== containerType) {
            let line = params.lines[token.map[0]]
            let lineTrimmed = line.trim();
            let index = line.search(lineTrimmed);
            let length = lineTrimmed.length;

            addError(
              onError,
              token.lineNumber,
              token.info[0] === ' '
                ? 'use ":::' + containerType + '" instead of ":::'
                  + token.info + '"'
                : 'remove title for admonition type: ' + containerType,
              null,
              [ index + 1, length ],
              {
                "editColumn": index + 1,
                "deleteCount": length,
                "insertText": `:::${containerType}`
              }
            )
          }
        }
      }
    }); 
  }
};
