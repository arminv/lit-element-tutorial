import { LitElement } from '@polymer/lit-element';

import { LitElement } from '@polymer/lit-element';

export class BaseView extends LitElement {
  // NOTE: here we disable shadow DOM (hence the styles are NOT scoped anymore, etc.) and instead load into the 'light DOM':
  createRenderRoot() {
    return this;
  }
}
