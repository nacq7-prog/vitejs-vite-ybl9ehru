import React from 'react';

export default function Dashboard({ userRole }) {
  const isFinanzas = userRole === 'Finanzas';

  // Datos de prueba para Solicitante (Por cuenta contable)
  const gastosPorCuenta = [
    { cuenta: 'Pasajes y Viáticos', monto: 350 },
    { cuenta: 'Alquiler de Salón / Eventos', monto: 500 },
    { cuenta: 'Material de Escritorio', monto: 120 },
    { cuenta: 'Alimentación en Campo', monto: 280 },
  ];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a8a' }}>
        {isFinanzas
          ? 'Dashboard Financiero General'
          : 'Mi Dashboard de Rendiciones y Gastos'}
      </h2>
      <p style={{ color: '#666' }}>
        {isFinanzas
          ? 'Visión consolidada del presupuesto general de la ONG por mes y proyecto.'
          : 'Resumen personal de tus solicitudes de avance y gastos por cuenta contable.'}
      </p>
      <br></br>

      {/* Tarjetas de Resumen */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '25px',
        }}
      >
        <div style={cardStyle}>
          <span style={cardTitleStyle}>
            {isFinanzas ? 'Presupuesto Ejecutado' : 'Mis Avances Solicitados'}
          </span>
          <h3 style={{ ...cardValueStyle, color: '#1e3a8a' }}>
            {isFinanzas ? 'Bs12,500 BOB' : 'Bs 1,250 BOB'}
          </h3>
        </div>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>
            {isFinanzas ? 'Pendiente por Aprobar' : 'Pendiente por Rendir'}
          </span>
          <h3 style={{ ...cardValueStyle, color: '#f59e0b' }}>
            {isFinanzas ? '5 Solicitudes' : 'Bs 300 BOB'}
          </h3>
        </div>
      </div>

      {/* Gráfico Estadístico por Cuentas Contables (Requerimiento 8) */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <h3>
          {isFinanzas
            ? 'Ejecución Mensual Consolidada'
            : 'Mis Gastos por Cuenta Contable'}
        </h3>

        <div style={{ marginTop: '15px' }}>
          {gastosPorCuenta.map((item, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{item.cuenta}</span>
                <span>Bs{item.monto} BOB</span>
              </div>
              {/* Barra de progreso / gráfico */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#f1f5f9',
                  height: '12px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(item.monto / 500) * 100}%`,
                    backgroundColor: '#2563eb',
                    height: '100%',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#f8fafc',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
};
const cardTitleStyle = {
  fontSize: '12px',
  color: '#64748b',
  textTransform: 'uppercase',
  fontWeight: 'bold',
};
const cardValueStyle = { margin: '8px 0 0 0', fontSize: '20px' };
