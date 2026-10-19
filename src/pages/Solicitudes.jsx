import React, { useState } from 'react';

export default function Solicitudes({
  userName = 'Nashca Cornejo',
  solicitudes,
  onCrearSolicitud,
  onEditarSolicitud,
  onAnularSolicitud,
}) {
  const [detalleInput, setDetalleInput] = useState('Cash advance ');
  const [montoInput, setMontoInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fechaHoy = new Date().toISOString().split('T')[0];
  const cuentaDefecto = `Cash Advance - ${userName}`;

  const misSolicitudes = solicitudes.filter((s) => s.solicitante === userName);

  const handleGuardar = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!detalleInput.toLowerCase().startsWith('cash advance')) {
      setErrorMsg(
        'El detalle debe comenzar obligatoriamente con la frase "Cash advance..."'
      );
      return;
    }

    const montoNum = parseFloat(montoInput);
    if (isNaN(montoNum) || montoNum <= 0 || montoNum > 10000) {
      setErrorMsg(
        'El monto debe ser mayor a Bs0 y hasta un máximo de Bs10,000 BOB.'
      );
      return;
    }

    if (editId) {
      // Editar y reenviar registro observado
      onEditarSolicitud(editId, {
        detalle: detalleInput,
        monto: montoNum,
      });
      setEditId(null);
    } else {
      // Crear nueva solicitud
      onCrearSolicitud({
        solicitante: userName,
        cuenta: cuentaDefecto,
        fecha: fechaHoy,
        detalle: detalleInput,
        monto: montoNum,
      });
    }

    setDetalleInput('Cash advance ');
    setMontoInput('');
  };

  const handleCargarEdicion = (sol) => {
    setEditId(sol.id);
    setDetalleInput(sol.detalle);
    setMontoInput(sol.monto);
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a8a' }}>
        Gestión de Solicitudes y Flujo de Aprobaciones
      </h2>

      {errorMsg && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #f87171',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Formulario de Creación / Edición */}
      <div
        style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          marginBottom: '25px',
        }}
      >
        <h3>
          {editId
            ? `✏️ Corregir y Reenviar Solicitud ${editId}`
            : 'Nueva Solicitud de Avance de Efectivo'}
        </h3>
        <form
          onSubmit={handleGuardar}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
          }}
        >
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Solicitante:
            </label>
            <input
              type="text"
              disabled
              value={userName}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                background: '#e2e8f0',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Cuenta Contable:
            </label>
            <input
              type="text"
              disabled
              value={cuentaDefecto}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                background: '#e2e8f0',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Monto Solicitado (Bs BOB):
            </label>
            <input
              type="number"
              required
              max="10000"
              placeholder="Ej. 500"
              value={montoInput}
              onChange={(e) => setMontoInput(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Fecha de Emisión:
            </label>
            <input
              type="date"
              disabled
              value={fechaHoy}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                background: '#e2e8f0',
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Detalle / Concepto:
            </label>
            <input
              type="text"
              required
              value={detalleInput}
              onChange={(e) => setDetalleInput(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {editId ? 'Reenviar a Revisión de Finanzas' : 'Generar Solicitud'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setDetalleInput('Cash advance ');
                  setMontoInput('');
                }}
                style={{
                  backgroundColor: '#64748b',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Historial con opción de editar observados */}
      <h3>Mis Solicitudes de Avance</h3>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
        }}
      >
        <thead>
          <tr
            style={{ background: '#1e3a8a', color: 'white', textAlign: 'left' }}
          >
            <th style={{ padding: '10px' }}>Código</th>
            <th style={{ padding: '10px' }}>Detalle</th>
            <th style={{ padding: '10px' }}>Monto</th>
            <th style={{ padding: '10px' }}>Estado</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {misSolicitudes.map((s) => {
            const esObservado = s.estado.includes('Observado');
            const esModificable =
              s.estado === 'Pendiente Finanzas' || esObservado;

            return (
              <tr
                key={s.id}
                style={{
                  borderBottom: '1px solid #e2e8f0',
                  opacity: s.estado === 'Anulado' ? 0.5 : 1,
                }}
              >
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.id}</td>
                <td style={{ padding: '10px', fontSize: '13px' }}>
                  {s.detalle}
                </td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>
                  Bs {s.monto} BOB
                </td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background:
                        s.estado === 'Aprobado'
                          ? '#dcfce7'
                          : esObservado
                          ? '#fee2e2'
                          : '#fef3c7',
                      color:
                        s.estado === 'Aprobado'
                          ? '#15803d'
                          : esObservado
                          ? '#991b1b'
                          : '#b45309',
                    }}
                  >
                    {s.estado}
                  </span>
                </td>
                <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                  {/* Permitir editar si fue Observado */}
                  {esObservado && (
                    <button
                      onClick={() => handleCargarEdicion(s)}
                      style={{
                        backgroundColor: '#d97706',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      ✏️ Corregir
                    </button>
                  )}

                  {esModificable && (
                    <button
                      onClick={() => onAnularSolicitud(s.id)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Anular
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
