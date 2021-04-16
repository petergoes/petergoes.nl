function splitInLines(string, maxChars) {
  if (string.length <= 40) return [string]

  const spacesWithinFirstLine = string
    .trim()
    .split('')
    .reduce((indexList, char, index) => char === ' ' ? [...indexList, index] : indexList, [])
    .filter(index => index < 40)

  const splitIndex = spacesWithinFirstLine[spacesWithinFirstLine.length - 1]
  const lineOne = string.substring(0, splitIndex)
  let lineTwo = string.substring(splitIndex + 1)

  if (lineTwo.length > maxChars) {
    lineTwo = `${lineTwo.substring(0, maxChars - 3)}...`
  }

  return [lineOne, lineTwo]
}

module.exports = function splitStringInTspans(string, category, maxChars = 38, x = 140, y = 311, lineHeight = 64) {
  let lines = []

  if (category) {
    lines.push(`${category}:`)
  }

  lines = [...lines, ...splitInLines(string, maxChars)]
  return lines
    .map((line, index) => `<tspan x="${category && index === 0 ? x - 40 : x}" y="${y + (index * lineHeight)}">${line}</tspan>`)
    .join('\n')
}
