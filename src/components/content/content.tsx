import React from "react";
import styles from "./content.module.css";

import {useLocation} from "react-router-dom";
import HomeContent from "./home/home-content";
import EntityContent from "./entity/entity-content";

const Content = () => {
  const location = useLocation();

  return (
    <div className={styles.content}>
      {location.pathname === '/home' && <HomeContent />}
      {location.pathname === '/entity/:fileName' && <EntityContent />}
      {location.pathname.startsWith('/entity/') && <EntityContent />}
    </div>
  )
}

export default Content;