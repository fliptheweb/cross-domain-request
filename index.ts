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
 * Transport for POST cross-domain requests without CORS
 * by using approach with form submited to hidden iframe, without reloading the page
 * @param  {string} url
 * @param  {Object} data
 * @param  {Object} [options={}]
 */
export default (url: string, data: {}, options: Options = {}) => {
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
  const form = document.getElementById(formId)
  const frame = document.getElementById(frameId)

  if (!containerEl || !form || !frame) {
    throw new Error("Unable to create elements for transport");
  }

  // FIXME: rewrite to https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event
  frame.addEventListener('load', () => {
    // Clean up
    if (isFormSubmited) document.body.removeChild(containerEl)
  });
  (form as HTMLFormElement).submit()
  isFormSubmited = true
}
