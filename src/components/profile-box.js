import React from 'react'
import styles from "./profile-box-css-modules.module.css";

const ProfileBox = () => (
  <div className={styles.container}>
    <h1>Jon Cravotta</h1>
    <p className={styles.subtitle}>IOS Software Engineer | NYC</p>
    <ul className={styles.menu}>
      <li><a>Work</a></li>
      <li><a>About</a></li>
    </ul>
  </div>
)

export default ProfileBox