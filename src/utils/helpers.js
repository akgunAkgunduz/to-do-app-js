export const select = (selector, element) => {
  return (element || document).querySelector(selector)
}