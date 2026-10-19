import React from 'react';

export default function Bitacora() {
  // Datos simulados de eventos guardados en la base de datos
  const registros = [
    {
      id: 1,
      usuario: 'nashca@ong.org',
      ip: '192.168.1.15',
      evento: 'Ingreso',
      browser: 'Chrome / Windows',
      fecha: '2026-10-17 08:30:12',
    },
    {
      id: 2,
      usuario: 'natalia@ong.org',
      ip: '190.181.24.5',
      evento: 'Ingreso',
      browser: 'Firefox / Android',
      fecha: '2026-10-17 09:15:00',
    },
    {
      id: 3,
      usuario: 'nashca@ong.org',
      ip: '192.168.1.15',
      evento: 'Salida',
      browser: 'Chrome / Windows',
      fecha: '2026-10-17 12:45:00',
    },
  ];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <h2>Bitácora de Accesos al Sistema</h2>
      <p style={{ color: '#666' }}>
        Registro de accesos (IP, Navegador, Fecha y Eventos de Usuario) .
      </p>

      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}
      >
        <thead>
          <tr
            style={{ background: '#1e3a8a', color: 'white', textAlign: 'left' }}
          >
            <th style={{ padding: '8px' }}>Usuario</th>
            <th style={{ padding: '8px' }}>IP</th>
            <th style={{ padding: '8px' }}>Evento</th>
            <th style={{ padding: '8px' }}>Navegador / SO</th>
            <th style={{ padding: '8px' }}>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{r.usuario}</td>
              <td style={{ padding: '8px' }}>{r.ip}</td>
              <td style={{ padding: '8px' }}>
                <span
                  style={{
                    color: r.evento === 'Ingreso' ? 'green' : 'orange',
                    fontWeight: 'bold',
                  }}
                >
                  {r.evento}
                </span>
              </td>
              <td style={{ padding: '8px' }}>{r.browser}</td>
              <td style={{ padding: '8px' }}>{r.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
