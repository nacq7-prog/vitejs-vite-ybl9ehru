import React from 'react';

export default function Menu({ setPage, userRole, onLogout }) {
  const isFinanzas = userRole === 'Finanzas';

  // Enlace directo a la imagen oficial de IJM para evitar problemas de SVG
  const logoIJM =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOpr2SaeT9TYlaVAErlHRYiwYHAoHx6eYCl0Q4JJe-CvoVZrUW7dPC3XLD&s=10';

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* LOGO OFICIAL IJM Y NOMBRE DEL SISTEMA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={logoIJM}
            alt="Logo IJM"
            style={{ height: '120px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.3px',
                textAlign: 'center',
              }}
            >
              IJM
            </span>
            <span style={roleBadgeStyle}>Rol: {userRole}</span>
          </div>
        </div>

        {/* BOTONES DE NAVEGACIÓN */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button onClick={() => setPage('dashboard')} style={buttonStyle}>
            {isFinanzas ? '📊 Dashboard Global' : '📊 Mi Dashboard'}
          </button>

          <button onClick={() => setPage('solicitudes')} style={buttonStyle}>
            📝 Solicitudes de Avance
          </button>

          <button onClick={() => setPage('reembolsos')} style={buttonStyle}>
            🧾 Reembolsos
          </button>

          {/* Exclusivo Finanzas */}
          {isFinanzas && (
            <>
              <button
                onClick={() => setPage('revision')}
                style={{ ...buttonStyle, backgroundColor: '#2563eb' }}
              >
                🔍 Bandeja de Revisión
              </button>
              <button onClick={() => setPage('catalogos')} style={buttonStyle}>
                ⚙️ Catálogos
              </button>
              <button onClick={() => setPage('usuarios')} style={buttonStyle}>
                👥 Usuarios
              </button>
              <button onClick={() => setPage('reportes')} style={buttonStyle}>
                📈 Reportes PDF
              </button>
              <button onClick={() => setPage('bitacora')} style={buttonStyle}>
                📜 Bitácora
              </button>
            </>
          )}

          {/* Cerrar Sesión */}
          <button
            onClick={onLogout}
            style={{
              ...buttonStyle,
              backgroundColor: '#dc2626',
              marginLeft: '6px',
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

// Estilos de la barra ajustados
const navStyle = {
  backgroundColor: '#black',
  color: 'black',
  padding: '10px 20px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
};

const roleBadgeStyle = {
  background: '#3b82f6',
  fontSize: '11px',
  padding: '2px 8px',
  borderRadius: '12px',
  fontWeight: 'bold',
  display: 'inline-block',
  width: 'fit-content',
};

const buttonStyle = {
  background: 'transparent',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  color: 'white',
  cursor: 'pointer',
  fontSize: '12.5px',
  fontWeight: 'bold',
  padding: '6px 10px',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
};
