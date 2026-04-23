import React from 'react';
import ReactDOM from 'react-dom/client';
import '../locales/i18n';
import App from './components/app/app';
import '../src/assets/styles/index.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <React.StrictMode>
    {/*<Provider store={store}>*/}
      <BrowserRouter>
        <App />
      </BrowserRouter>

    {/*</Provider>*/}
    </React.StrictMode>
  </>
);