// @ts-check

"use strict";

const { addError, forEachLine, overlapsAnyRange, getLineMetadata, inlineCodeSpanRanges } = require("./helpers");

const imageWithAltTextRe = /(^|[^\\])!\[([^)]+)\]\(([^\]^][^\]]*)\)(?!\()/g;

module.exports = {
  "names": ['alt-text'],
  "description": 'Do not use Alt text for images to ensure proper pdf rendering, use title syntax instead',
  "tags": ['images'],
  "function": function altTextInsideAdmonition(params, onError) {
    const exclusions = inlineCodeSpanRanges(params.lines);
        
    forEachLine(getLineMetadata(params), (line, lineIndex, inCode, onFence) => {
      if (!inCode && !onFence) {
        let match = null;
        while ((match = imageWithAltTextRe.exec(line)) !== null) {
          const [ imageWithAltText, preChar, imageTitle, imageUrl ] = match;
          const index = match.index + preChar.length;
          const length = match[0].length - preChar.length;
          if (
            !imageTitle.endsWith("\\") &&
            !imageUrl.endsWith("\\") &&
            !overlapsAnyRange(exclusions, lineIndex, index, length)
          ) {
            addError(
              onError,
              lineIndex + 1,
              imageWithAltText.slice(preChar.length),
              null,
              [ index + 1, length ],
              {
                "editColumn": index + 1,
                "deleteCount": length,
                "insertText": `![](${imageUrl} "${imageTitle}")`
              }
            );
          }
        }
      }
    });
  }
};
