import DOMPurify from 'dompurify'

export const select = (selector, element) => {
  return (element || document).querySelector(selector)
}

export const sanitize = (string) => {
  return DOMPurify.sanitize(string, { ALLOWED_TAGS: ['strong', 'em'] })
}