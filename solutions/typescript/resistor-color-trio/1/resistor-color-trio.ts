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

export function decodedResistorValue(colors: string[]): string {
  if (colors.length < 2) {
    throw new Error("At least two colors are required")
  }

  const firstDigit = COLORS.indexOf(colors[0])
  const secondDigit = COLORS.indexOf(colors[1])
  const thirdDigit = COLORS.indexOf(colors[2])

  if (thirdDigit >= 2) {
    const value = (firstDigit * 10 + secondDigit) * Math.pow(10, thirdDigit)
    if (value >= 1000000000) {
      return `${value / 1000000000} gigaohms`
    }
    if (value >= 1000000) {
      return `${value / 1000000} megaohms`
    }
    if (value >= 1000) {
      return `${value / 1000} kiloohms`
    }
    return `${value} ohms`
  } else {
    return `${firstDigit * 10 + secondDigit + "0".repeat(thirdDigit)} ohms`
  }
}
