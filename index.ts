enum Method {
  GET = 'GET',
  POST = 'POST',
}

type Options = {
  method?: Method
}

const DEFAULT_OPTIONS: Options = {
  method: Method.POST,
}

const HIDDEN_STYLES = {
  display: 'none',
  position: 'absolute',
  left: '-900px',
  top: '-900px',
}

const HIDDEN_STYLES_STRING = Object.entries(HIDDEN_STYLES).map(([prop, val]) => `${prop}: ${val}`).join(';')

/**
 * Cross-domain request without CORS
 * @param  {string} url              URL for submission
 * @param  {Object} data             Submission data
 * @param  {Object} [options={}]     Form options
 */
export default (url: string, data: {}, options: Options = {}): void => {
  if (!url) throw new Error('Missing url param')
  options = { ...DEFAULT_OPTIONS, ...options }

  let isFormSubmited = false
  const id = String(Math.random()).replace('.', '')
  const frameId = `frame${id}`
  const formId = `form${id}`
  const container = document.createRange().createContextualFragment(`
    <div id="${id}" style="${HIDDEN_STYLES_STRING}">
      <iframe id="${frameId}" name="${frameId}"></iframe>
      <form id="${formId}" target="${frameId}" action="${url}" method="${options.method}" tabindex="-1">
        ${data ? Object.entries(data).map(([fieldName, value]) =>
          `<input type="text" name="${fieldName}" value='${value}' tabindex="-1" />`
        ) : ''}
      </form>
    </div>
  `)
  document.body.appendChild(container)

  const containerEl = document.getElementById(id)
  const form = document.getElementById(formId) as HTMLFormElement
  const frame = document.getElementById(frameId) as HTMLIFrameElement

  if (!containerEl || !form || !frame) {
    throw new Error("Unable to create elements for transport");
  }

  // FIXME: rewrite to https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event
  frame.addEventListener('load', () => {
    // Clean up
    if (isFormSubmited) document.body.removeChild(containerEl)
  });
  form.submit()
  isFormSubmited = true
}
