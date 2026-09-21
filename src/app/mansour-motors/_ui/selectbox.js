/* Accessible, dependency-free select UI. The native select remains the source of truth
   so forms, URL state and the imperative catalogue filters keep one state model. */
const boxes = new Set()

function nextEnabled(items, from, step) {
  for (let offset = 1; offset <= items.length; offset += 1) {
    const item = items[(from + offset * step + items.length) % items.length]
    if (!item.disabled) return item
  }
  return null
}

export function mountSelectbox(select, { signal } = {}) {
  const host = document.createElement('div')
  const trigger = document.createElement('button')
  const value = document.createElement('span')
  const icon = document.createElement('span')
  const menu = document.createElement('div')
  const label = select.getAttribute('aria-label') || 'Sélection'

  host.className = `custom-select${select.hasAttribute('data-sort') ? ' is-sort' : ''}${select.name ? ` is-${select.name}` : ''}`
  trigger.type = 'button'
  trigger.className = 'custom-select-trigger'
  trigger.setAttribute('aria-haspopup', 'listbox')
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute('aria-label', label)
  value.className = 'custom-select-value'
  icon.className = 'custom-select-icon'
  icon.setAttribute('aria-hidden', 'true')
  icon.innerHTML = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1.25L5 4.75L9 1.25" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  menu.className = 'custom-select-menu'
  menu.setAttribute('role', 'listbox')
  menu.setAttribute('aria-label', label)
  menu.hidden = true
  trigger.append(value, icon)
  host.append(trigger, menu)
  select.after(host)
  select.classList.add('select-native')
  select.tabIndex = -1
  select.setAttribute('aria-hidden', 'true')

  const close = ({ focus = false } = {}) => {
    host.classList.remove('is-open')
    trigger.setAttribute('aria-expanded', 'false')
    menu.hidden = true
    if (focus) trigger.focus()
  }

  const open = (focusOption = false) => {
    if (select.disabled) return
    for (const box of boxes) if (box.host !== host) box.close()
    host.classList.add('is-open')
    trigger.setAttribute('aria-expanded', 'true')
    menu.hidden = false
    if (focusOption) {
      const selected = menu.querySelector('[aria-selected="true"]')
      const first = menu.querySelector('button:not(:disabled)')
      ;(selected || first)?.focus()
    }
  }

  const choose = (button) => {
    const next = button.dataset.value ?? ''
    const option = [...select.options].find((item) => item.value === next)
    if (option) option.selected = true
    else select.value = next
    select.dispatchEvent(new Event('change', { bubbles: true }))
    render()
    close({ focus: true })
  }

  const render = () => {
    const options = [...select.options]
    const selected = options.find((option) => option.value === select.value) || options[0]
    value.textContent = selected?.textContent || label
    trigger.disabled = select.disabled
    host.classList.toggle('is-disabled', select.disabled)
    host.classList.toggle('has-value', Boolean(select.value))
    menu.replaceChildren(...options.map((option) => {
      const button = document.createElement('button')
      const text = document.createElement('span')
      const meta = document.createElement('span')
      const count = document.createElement('span')
      const check = document.createElement('span')
      button.type = 'button'
      button.dataset.value = option.value
      button.setAttribute('role', 'option')
      button.setAttribute('aria-selected', String(option === selected))
      button.disabled = option.disabled
      text.textContent = option.textContent
      meta.className = 'custom-select-option-meta'
      count.className = 'custom-select-count'
      count.textContent = option.dataset.count || ''
      count.hidden = !option.dataset.count
      check.className = 'custom-select-check'
      check.innerHTML = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.25L4.75 8.5L9.5 3.75" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      check.setAttribute('aria-hidden', 'true')
      meta.append(count, check)
      button.append(text, meta)
      return button
    }))
  }

  trigger.addEventListener('click', () => {
    if (host.classList.contains('is-open')) close()
    else open()
  }, { signal })

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      open(true)
    }
  }, { signal })

  menu.addEventListener('pointerdown', (event) => {
    const button = event.target.closest('button[data-value]')
    if (!button || button.disabled) return
    // press applies the choice; a later click is lost if the menu closes on blur
    event.preventDefault()
    choose(button)
  }, { signal })

  menu.addEventListener('keydown', (event) => {
    const items = [...menu.querySelectorAll('button')]
    const current = items.indexOf(document.activeElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      close({ focus: true })
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (current >= 0) choose(items[current])
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      nextEnabled(items, Math.max(current, 0), event.key === 'ArrowDown' ? 1 : -1)?.focus()
    }
  }, { signal })

  select.addEventListener('change', render, { signal })
  select.form?.addEventListener('reset', () => queueMicrotask(render), { signal })
  document.addEventListener('pointerdown', (event) => {
    if (!host.contains(event.target)) close()
  }, { signal })
  host.addEventListener('focusout', (event) => {
    if (host.contains(event.relatedTarget)) return
    queueMicrotask(() => {
      if (!host.contains(document.activeElement)) close()
    })
  }, { signal })

  const observer = new MutationObserver(render)
  observer.observe(select, { attributes: true, childList: true, subtree: true })
  signal?.addEventListener('abort', () => {
    observer.disconnect()
    boxes.delete(api)
    host.remove()
    select.classList.remove('select-native')
    select.removeAttribute('aria-hidden')
    select.removeAttribute('tabindex')
  }, { once: true })

  const api = { host, close }
  boxes.add(api)
  render()
  return api
}
