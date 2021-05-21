function splitInLines(string, maxChars) {
  if (string.length <= maxChars) return [string]

  const spacesWithinFirstLine = string
    .trim()
    .split('')
    .reduce((indexList, char, index) => char === ' ' ? [...indexList, index] : indexList, [])
    .filter(index => index < maxChars)

  const splitIndex = spacesWithinFirstLine[spacesWithinFirstLine.length - 1]
  const lineOne = string.substring(0, splitIndex)
  let lineTwo = string.substring(splitIndex + 1)

  if (lineTwo.length < maxChars) {
    return [lineOne, lineTwo]
  }

  const spacesWithinSecondLine = lineTwo
    .trim()
    .split('')
    .reduce((indexList, char, index) => char === ' ' ? [...indexList, index] : indexList, [])
    .filter(index => index < maxChars)

  const splitIndex2 = spacesWithinSecondLine[spacesWithinSecondLine.length - 1]
  let lineThree = lineTwo.substring(splitIndex2 + 1)
  lineTwo = lineTwo.substring(0, splitIndex2)

  if (lineThree.length > maxChars) {
    lineThree = `${lineThree.substring(0, maxChars - 3)}...`
  }
  
  return [lineOne, lineTwo, lineThree]
}

module.exports = function splitStringInTspans(string, maxChars = 27, x = 140, y = 177, lineHeight = 64) {
  let lines = []

  lines = splitInLines(string, maxChars)
  return lines
    .map((line, index) => `<tspan x="${x}" y="${y + (index * lineHeight)}">${line}</tspan>`)
    .join('\n')
}
