import { LitElement, html } from '@polymer/lit-element';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import { VisibilityFilters } from '../redux/reducer';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store';
class TodoView extends connect(store)(LitElement) {
  static get properties() {
    return {
      todos: { type: Array },
      filter: { type: String },
      task: { type: String },
    };
  }

  // NOTE: connecting to redux gives us this helper - we can use it to set properties for our component:
  stateChanged(state) {
    this.todos = state.todos;
    this.filter = state.filter;
  }

  // NOTE: this is not needed anymore as we can initialize the state within `stateChanged` function above:
  // constructor() {
  //   super();
  //   this.todos = [];
  //   this.filter = VisibilityFilters.SHOW_ALL;
  //   this.task = '';
  // }

  // NOTE: shadow DOM scopes the styles so that it only gets applied locally - we can turn off shadow DOM:
  render() {
    return html`
      <style>
        todo-view {
          display: block;
          max-width: 800px;
          margin: 0 auto;
        }
        todo-view .input-layout {
          width: 100%;
          display: flex;
        }
        todo-view .input-layout vaadin-text-field {
          flex: 1;
          margin-right: var(--spacing);
        }
        todo-view .todos-list {
          margin-top: var(--spacing);
        }
        todo-view .visibility-filters {
          margin-top: calc(4 * var(--spacing));
        }
      </style>
      <div class="input-layout" @keyup="${this.shortcutListener}">
        <vaadin-text-field
          placeholder="Task"
          value="${this.task || ''}"
          @change="${this.updateTask}"
        >
        </vaadin-text-field>
        <vaadin-button theme="primary" @click="${this.addTodo}"
          >Add Todo</vaadin-button
        >
      </div>

      <!-- NOTE: ? with checked here indicates that based on a boolean flag, we want/no want to have that attribute set: -->
      <div class="todos-list">
        ${this.applyFilter(this.todos).map(
          (todo) => html`
            <div class="todo-item">
              <vaadin-checkbox
                ?checked="${todo.complete}"
                @change="${(e) =>
                  this.updateTodoStatus(todo, e.target.checked)}"
              >
                > ${todo.task}
              </vaadin-checkbox>
            </div>
          `
        )}
      </div>

      <vaadin-radio-group
        clss="visibility-filters"
        value="${this.filter}"
        @value-changed="${this.filterChanged}"
      >
        ${Object.values(VisibilityFilters).map(
          (filter) => html`
            <vaadin-radio-button value="${filter}"
              >${filter}</vaadin-radio-button
            >
          `
        )}
      </vaadin-radio-group>
      <vaadin-button @click="${this.clearCompleted}"
        >Clear completed</vaadin-button
      >
    `;
  }

  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.complete);
  }

  filterChanged(e) {
    this.filter = e.target.value;
  }

  applyFilter(todos) {
    switch (this.filter) {
      case VisibilityFilters.SHOW_ACTIVE:
        return todos.filter((todo) => !todo.complete);
      case VisibilityFilters.SHOW_COMPLETED:
        return todos.filter((todo) => todo.complete);
      default:
        return todos;
    }
  }

  shortcutListener(e) {
    if (e.key === 'Enter') {
      this.addTodo();
    }
  }

  updateTask(e) {
    this.task = e.target.value;
  }

  addTodo() {
    if (this.task) {
      // NOTE: we create a NEW ARRAY and append the new task to it, this way Lit-Element can detect changes and update the DOM:
      this.todos = [
        ...this.todos,
        {
          task: this.task,
          complete: false,
        },
      ];
      this.task = '';
    }
  }

  updateTodoStatus(updatedTodo, complete) {
    this.todos = this.todos.map((todo) =>
      updatedTodo === todo ? { ...updatedTodo, complete } : todo
    );
  }

  // NOTE: here we disable shadow DOM (hence the styles are NOT scoped anymore, etc.):
  createRenderRoot() {
    return this;
  }
}

// NOTE: we add '-' to our component to avoid any potential clashes with actual HTML tags in future:
customElements.define('todo-view', TodoView);
