import React, { useMemo } from 'react';
import { 
  MOCK_USERS, 
  MOCK_POSTS, 
  SimulationResult 
} from '../data/eloquentMethods';
import styles from './styles/DatabaseVisualizer.module.css';

interface DatabaseVisualizerProps {
  methodId: string;
  simulationResult: SimulationResult;
}

export default function DatabaseVisualizer({ 
  methodId, 
  simulationResult 
}: DatabaseVisualizerProps) {
  // Sync lists when the simulation runs (for inserts / updates) using useMemo
  const usersList = useMemo(() => {
    let currentUsers = [...MOCK_USERS];
    
    // If simulation inserted a user
    if (simulationResult.insertedUser) {
      currentUsers.push(simulationResult.insertedUser);
    }

    // If simulation updated a user
    if (simulationResult.updatedUser) {
      currentUsers = currentUsers.map(u => 
        u.email.toLowerCase() === simulationResult.updatedUser!.email.toLowerCase()
          ? simulationResult.updatedUser! 
          : u
      );
    }
    return currentUsers;
  }, [simulationResult]);

  const postsList = MOCK_POSTS;

  // Determine whether to display the post table
  const showPostsTable = methodId === 'with' || methodId === 'whereHas';

  // Performance efficiency level helper
  const getEfficiencyClass = () => {
    const { queriesCount, durationMs } = simulationResult.stats;
    if (queriesCount > 3 || durationMs > 20) return styles.danger;
    if (queriesCount === 2) return styles.warning;
    return styles.success;
  };

  return (
    <div className={styles.container}>
      {/* 1. Performance Panel */}
      <div className={`${styles.statsBar} glass`}>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>CONSULTAS SQL</div>
          <div className={`${styles.statValue} ${getEfficiencyClass()}`}>
            {simulationResult.stats.queriesCount}
          </div>
          <div className={styles.statSub}>
            {simulationResult.stats.queriesCount > 3 ? 'Problema N+1!' : 'Optimizado'}
          </div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>TIEMPO DE BD</div>
          <div className={styles.statValue}>
            {simulationResult.stats.durationMs.toFixed(1)} ms
          </div>
          <div className={styles.statSub}>Simulado</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>RAM CONSUMIDA</div>
          <div className={`${styles.statValue} ${simulationResult.stats.memoryMb > 3 ? styles.warning : styles.success}`}>
            {simulationResult.stats.memoryMb.toFixed(2)} MB
          </div>
          <div className={styles.statSub}>Objetos en RAM</div>
        </div>
      </div>

      {/* 2. Database Tables Visualizer */}
      <div className={styles.workspace}>
        <div className={styles.tablesContainer}>
          {/* USERS TABLE */}
          <div className={`${styles.tableWrapper} glass`}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Tabla: users</span>
              <span className={styles.tableCount}>{usersList.length} filas</span>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>email</th>
                    <th>status</th>
                    <th>role</th>
                    <th>created_at</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => {
                    const isMatched = simulationResult.matchedUserIds.includes(user.id);
                    const isInserted = simulationResult.insertedUser?.id === user.id;
                    const isUpdated = simulationResult.updatedUser?.id === user.id;

                    let rowClass = '';
                    if (isInserted) rowClass = 'animate-insert';
                    else if (isUpdated) rowClass = 'success-pulse';
                    else if (isMatched) rowClass = 'sql-pulse';

                    return (
                      <tr 
                        key={user.id} 
                        className={`${rowClass} ${isMatched ? styles.matchedRow : ''}`}
                      >
                        <td className={styles.boldCell}>{user.id}</td>
                        <td>{user.name}</td>
                        <td className={styles.emailCell}>{user.email}</td>
                        <td>
                          <span className={`${styles.badge} ${
                            user.status === 'active' ? styles.badgeActive : styles.badgeInactive
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <span className={styles.roleText}>{user.role}</span>
                        </td>
                        <td className={styles.dateCell}>{user.created_at}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* POSTS TABLE (conditional) */}
          {showPostsTable && (
            <div className={`${styles.tableWrapper} glass`}>
              <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>Tabla: posts</span>
                <span className={styles.tableCount}>{postsList.length} filas</span>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>user_id</th>
                      <th>title</th>
                      <th>status</th>
                      <th>likes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postsList.map((post) => {
                      const isMatched = simulationResult.matchedPostIds.includes(post.id);
                      const rowClass = isMatched ? 'success-pulse' : '';

                      return (
                        <tr 
                          key={post.id} 
                          className={`${rowClass} ${isMatched ? styles.matchedRow : ''}`}
                        >
                          <td className={styles.boldCell}>{post.id}</td>
                          <td className={styles.boldCell}>{post.user_id}</td>
                          <td>{post.title}</td>
                          <td>
                            <span className={`${styles.badge} ${
                              post.status === 'published' ? styles.badgeActive : styles.badgeInactive
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className={styles.likesCell}>{post.likes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 3. Output Consoles: SQL & Returned Objects */}
        <div className={styles.consoleGrid}>
          {/* SQL terminal console */}
          <div className={`${styles.consoleWrapper} glass`}>
            <div className={styles.consoleHeader}>
              <div className={styles.terminalDots}>
                <span className={styles.dotRed}></span>
                <span className={styles.dotYellow}></span>
                <span className={styles.dotGreen}></span>
              </div>
              <span className={styles.consoleTitle}>Consola SQL - Registro de Consultas</span>
            </div>
            <div className={styles.consoleContent}>
              {simulationResult.querySteps.map((step, idx) => (
                <div key={idx} className={styles.sqlStep}>
                  <div className={styles.sqlStepMeta}>
                    <span className={styles.stepNumber}>PASO {idx + 1}</span>
                    <span className={styles.stepPurpose}>{step.purpose}</span>
                  </div>
                  <pre className={styles.sqlCode}>{step.sql}</pre>
                </div>
              ))}
            </div>
          </div>

          {/* JSON output response console */}
          <div className={`${styles.consoleWrapper} glass`}>
            <div className={styles.consoleHeader}>
              <div className={styles.terminalDots}>
                <span className={styles.dotGrey}></span>
                <span className={styles.dotGrey}></span>
                <span className={styles.dotGrey}></span>
              </div>
              <span className={styles.consoleTitle}>Respuesta de Retorno (JSON)</span>
            </div>
            <pre className={styles.jsonContent}>
              <code>{simulationResult.resultJson}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
