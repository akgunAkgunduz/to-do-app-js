const select = (selector, element) => {
  return (element || document).querySelector(selector)
}

const sanitize = (string) => {
  return DOMPurify.sanitize(string, { ALLOWED_TAGS: ['strong', 'em'] })
}