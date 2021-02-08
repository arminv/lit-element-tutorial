import { LitElement, html } from '@polymer/lit-element';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import { VisibilityFilters, getVisibleTodosSelector } from '../redux/reducer';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store';
import {
  updateTodoStatus,
  updateFilter,
  clearCompleted,
  addTodo,
} from '../redux/actions';
import { BaseView } from './base-view';

class TodoView extends connect(store)(BaseView) {
  static get properties() {
    return {
      todos: { type: Array },
      filter: { type: String },
      task: { type: String },
    };
  }

  // NOTE: connecting to redux gives us this helper - we can use it to set properties for our component:
  stateChanged(state) {
    this.todos = getVisibleTodosSelector(state);
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
        ${this.todos.map(
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
    store.dispatch(clearCompleted());
  }

  filterChanged(e) {
    store.dispatch(updateFilter(e.detail.value));
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
      store.dispatch(addTodo(this.task));
      this.task = '';
    }
  }

  updateTodoStatus(updatedTodo, complete) {
    store.dispatch(updateTodoStatus(updatedTodo, complete));
  }
}

// NOTE: we add '-' to our component to avoid any potential clashes with actual HTML tags in future:
customElements.define('todo-view', TodoView);
