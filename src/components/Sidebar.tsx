import React from 'react';
import { CATEGORIES, ELOQUENT_METHODS } from '../data/eloquentMethods';
import styles from './styles/Sidebar.module.css';

interface SidebarProps {
  activeMethodId: string;
  onSelectMethod: (id: string) => void;
}

export default function Sidebar({ activeMethodId, onSelectMethod }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} glass`}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>L</div>
          <div>
            <h1 className={styles.logoText}>Laravel Eloquent</h1>
            <span className={styles.logoSub}>Interactivos</span>
          </div>
        </div>
      </div>
      
      <div className={styles.navContainer}>
        {CATEGORIES.map((category) => {
          const categoryMethods = ELOQUENT_METHODS.filter(
            (m) => m.category === category.id
          );

          if (categoryMethods.length === 0) return null;

          return (
            <div key={category.id} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{category.name}</h2>
              <div className={styles.methodList}>
                {categoryMethods.map((method) => {
                  const isActive = method.id === activeMethodId;
                  return (
                    <button
                      key={method.id}
                      onClick={() => onSelectMethod(method.id)}
                      className={`${styles.methodButton} ${
                        isActive ? styles.activeButton : ''
                      }`}
                    >
                      <span className={styles.methodIndicator}></span>
                      <span className={styles.methodName}>{method.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.footer}>
        <div className={styles.creditsContainer}>
          <span className={styles.creditsLabel}>Creado por</span>
          <span className={styles.creditsName}>Lic. Fernando Aguirre</span>
        </div>
        <div className={styles.footerBadge}>Vercel Ready</div>
      </div>
    </aside>
  );
}
