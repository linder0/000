import React from 'react';
import { Link } from 'react-router-dom';

const monoFont = { fontFamily: 'Space Mono, monospace', letterSpacing: '0.15em' };

const ProjectsPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', flexDirection: 'column', ...monoFont, textTransform: 'uppercase' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Projects coming soon.</div>
      <Link
        to="/"
        style={{ fontSize: '0.85rem', color: '#fff', opacity: 0.7, textDecoration: 'none', marginTop: '0.5rem', letterSpacing: '0.15em' }}
        className="hover:underline focus:underline"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ProjectsPage;
