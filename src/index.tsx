import React from 'react';
import ReactDOM from 'react-dom/client';
import '../locales/i18n';
import App from './components/app/app';
import '../src/assets/styles/index.css';
import {BrowserRouter, HashRouter} from 'react-router-dom';

const isElectron = !!(window as any).electronAPI?.isElectron;
const Router = isElectron ? HashRouter : BrowserRouter;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <React.StrictMode>
    {/*<Provider store={store}>*/}
      <Router>
        <App />
      </Router>

    {/*</Provider>*/}
    </React.StrictMode>
  </>
);