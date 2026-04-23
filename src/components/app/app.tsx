import React, {useEffect} from 'react';
import styles from './app.module.css';
import {Routes, Route, replace, Navigate} from 'react-router-dom';
import { HomePage } from '../../pages/HomePage/HomePage';
import { EntityPage } from '../../pages/EntityPage/EntityPage';
import {useLanguage} from "../../hooks/useLanguage";

function App() {

  useEffect(() => {
    const path = window.location.pathname;

    switch (true) {
      case path.startsWith('/home'):
        document.title = 'Home';
        break;
      case path.startsWith('/entity/'):
        document.title = 'Entity';
        break;
      default:
        document.title = 'Graph Tracker';
    }
  }, [window.location.pathname]);

  useLanguage();

  return (
    <div className={styles.page}>
      <div className={styles.mainBox}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/entity/:fileName" element={<EntityPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;