const getValue = button => {
    if (!button) {
        return null;
    }
    if (button.hasAttribute('value')) {
        return button.value;
    } else {
        return button.textContent.trim();
    }
};
export default class ButtonGroup extends HTMLElement {
    #value;
    #observer
    #internals
    static formAssociated = true;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<style>@import "/styles/buttongroup.css";</style><slot></slot>`;
        this.#internals = this.attachInternals?.();
        if (this.#internals) {
            this.#internals.role = 'region';
        }
        this.addEventListener('click', ev => {
            let el = ev.target as Node;
            const previousValue = this.value;
            while (el.parentNode !== this) {
                el = el.parentNode;
            }
            if (el) {
                this.#buttonChanged(el as HTMLElement);
                if (previousValue !== this.value) {
                    this.dispatchEvent(new InputEvent('input', { bubbles: true }));
                }
            }
        });
        this.#observer = new MutationObserver(mutations => {
            const curMutations = mutations.filter(m => {
                const target = m.target as HTMLElement;
                if (target === this) {
                    return true;
                }
                if (target.parentNode === this) {
                    if (m.type === 'childList' || m.oldValue !== target.getAttribute('aria-pressed')) {
                        return true;
                    }
                }
                return false;
            });
            if (curMutations.length > 0) {
                this.#buttonChanged();
            }
        });
    }
    #buttonChanged(button?: HTMLElement) {
        if (this.multiple) {
            this.#value ||= [];
            if (button) {
                const value = getValue(button);
                const pressed = button.getAttribute('aria-pressed') === 'true';
                if (pressed) {
                    this.#value = this.#value.filter(v => v !== value);
                } else {
                    this.#value.push(value);
                }
            }
            this.value = this.#value;
        } else {
            this.value = getValue(button ?? this.pressedButton);
        }
    }
    get name() {
        return this.getAttribute('name');
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get multiple() {
        return this.hasAttribute('multiple');
    }
    set multiple(value) {
        if (value) {
            this.setAttribute('multiple', '');
        }
        else {
            this.removeAttribute('multiple');
        }
    }
    get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
        this.#internals?.setFormValue(value);
        for (const button of this.children) {
            if (!button.hasAttribute('type')) {
                button['type'] = 'button';
            }
            const buttonValue = getValue(button);
            const pressed = this.multiple ? this.#value.includes(buttonValue) : this.#value === buttonValue;
            const ariaPressed = pressed.toString();
            if (ariaPressed !== button.getAttribute('aria-pressed')) {
                button.setAttribute('aria-pressed', ariaPressed);
            }
        }
    }
    get pressedButtons() {
        return [...this.querySelectorAll(`:scope > [aria-pressed="true"]`)];
    }
    get pressedButton() {
        return this.pressedButtons.at(-1);
    }
    get labels() {
        return this.#internals?.labels;
    }
    connectedCallback() {
        this.#buttonChanged();
        this.#observer.observe(this, { attributeFilter: ['aria-pressed'], attributeOldValue: true, childList: true, subtree: true });
    }
    disconnectedCallback() {
        this.#observer.disconnect();
    }
}
window.customElements.define('button-group', ButtonGroup);
