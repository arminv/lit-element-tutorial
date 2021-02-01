import { LitElement, html } from '@polymer/lit-element';

class TodoView extends LitElement {
  render() {
    return html` <p>Hello World!</p> `;
  }
}

// NOTE: we add '-' to our component to avoid any potential clashes with actual HTML tags in future:
customElements.define('todo-view', TodoView);
