export const COLORS = [
  "black",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
  "grey",
  "white",
]

export function decodedValue(colors: string[]): number {
  if (colors.length < 2) {
    throw new Error("At least two colors are required")
  }

  const firstDigit = COLORS.indexOf(colors[0])
  const secondDigit = COLORS.indexOf(colors[1])
  return firstDigit * 10 + secondDigit
}
