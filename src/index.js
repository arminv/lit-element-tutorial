import './styles.css';
import './views/todo-view';
import { Router } from '@vaadin/router';

window.addEventListener('load', () => {
  initRouter();
});

function initRouter() {
  const router = new Router(document.querySelector('main'));
  router.setRoutes([
    {
      path: '/',
      component: 'todo-view',
    },
    {
      path: '/stats',
      component: 'stats-view',
      action: () =>
        // NOTE: this will do a 'Dynamic Import', allowing Webpack to load assets only when we actually navigate to a page:
        // NOTE: we can give names to our bundles (`stats`) in this case, so it's easier to track them in the network tab of the browser dev tools:
        import(/* webpackChunkName: "stats" */ './views/stats-view'), //
    },
    {
      // NOTE: this is a fallback route:
      path: '(.*)',
      component: 'not-found-view',
      action: () =>
        import(
          /* webpackChunkName: "not-found-view" */ './views/not-found-view'
        ),
    },
  ]);
}
