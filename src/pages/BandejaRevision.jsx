import React, { useState } from 'react';

export default function BandejaRevision({
  solicitudes = [],
  reembolsos = [],
  onAprobarSolicitud,
  onObservarSolicitud,
  onAprobarReembolso,
  onObservarReembolso,
}) {
  const [tipoVista, setTipoVista] = useState('solicitudes'); // 'solicitudes' o 'reembolsos'
  const [reembolsoExpandido, setReembolsoExpandido] = useState(null);

  const solicitudesPendientes = solicitudes.filter(
    (s) => s.estado === 'Pendiente Finanzas'
  );
  const reembolsosPendientes = reembolsos.filter(
    (r) => r.estado === 'Pendiente Finanzas'
  );

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a8a' }}>
        🔍 Módulo 5: Bandeja de Revisión y Auditoría (Finanzas)
      </h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Valide montos, cuentas contables y comprobantes/facturas adjuntos antes
        de derivar al supervisor o aprobador [Req. 5][cite: 1].
      </p>

      {/* Control de Filtro / Pestañas de Revisión */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          marginTop: '15px',
        }}
      >
        <button
          onClick={() => setTipoVista('solicitudes')}
          style={{
            padding: '10px 18px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            backgroundColor:
              tipoVista === 'solicitudes' ? '#1e3a8a' : '#e2e8f0',
            color: tipoVista === 'solicitudes' ? 'white' : '#334155',
          }}
        >
          📄 Avances de Efectivo ({solicitudesPendientes.length})
        </button>

        <button
          onClick={() => setTipoVista('reembolsos')}
          style={{
            padding: '10px 18px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            backgroundColor: tipoVista === 'reembolsos' ? '#1e3a8a' : '#e2e8f0',
            color: tipoVista === 'reembolsos' ? 'white' : '#334155',
          }}
        >
          🧾 Reembolsos y Rendiciones ({reembolsosPendientes.length})
        </button>
      </div>

      {/* VISTA 1: REVISIÓN DE AVANCES DE EFECTIVO */}
      {tipoVista === 'solicitudes' && (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            border: '1px solid #cbd5e1',
          }}
        >
          <thead>
            <tr
              style={{
                background: '#0f172a',
                color: 'white',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '10px' }}>Código</th>
              <th style={{ padding: '10px' }}>Solicitante</th>
              <th style={{ padding: '10px' }}>Cuenta Contable</th>
              <th style={{ padding: '10px' }}>Detalle</th>
              <th style={{ padding: '10px' }}>Monto</th>
              <th style={{ padding: '10px' }}>Acciones de Auditoría</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesPendientes.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: 'center',
                    padding: '25px',
                    color: '#64748b',
                  }}
                >
                  🎉 No hay solicitudes de avance pendientes de revisión.
                </td>
              </tr>
            ) : (
              solicitudesPendientes.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>
                    {s.id}
                  </td>
                  <td style={{ padding: '10px' }}>{s.solicitante}</td>
                  <td
                    style={{
                      padding: '10px',
                      fontSize: '12px',
                      color: '#475569',
                    }}
                  >
                    {s.cuenta}
                  </td>
                  <td style={{ padding: '10px', fontSize: '13px' }}>
                    {s.detalle}
                  </td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>
                    ${s.monto} USD
                  </td>
                  <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onAprobarSolicitud(s.id)}
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      ✔ Validar y Derivar
                    </button>
                    <button
                      onClick={() => onObservarSolicitud(s.id)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      ✖ Observar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* VISTA 2: REVISIÓN DE REEMBOLSOS Y RENDICIONES (PADRE-HIJO + ARCHIVOS) */}
      {tipoVista === 'reembolsos' && (
        <div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              border: '1px solid #cbd5e1',
            }}
          >
            <thead>
              <tr
                style={{
                  background: '#0f172a',
                  color: 'white',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '10px' }}>Código</th>
                <th style={{ padding: '10px' }}>Solicitante</th>
                <th style={{ padding: '10px' }}>Fecha</th>
                <th style={{ padding: '10px' }}>Líneas de Gasto</th>
                <th style={{ padding: '10px' }}>Monto Total</th>
                <th style={{ padding: '10px' }}>Acciones de Auditoría</th>
              </tr>
            </thead>
            <tbody>
              {reembolsosPendientes.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '25px',
                      color: '#64748b',
                    }}
                  >
                    🎉 No hay reembolsos ni rendiciones pendientes de revisión.
                  </td>
                </tr>
              ) : (
                reembolsosPendientes.map((r) => (
                  <React.Fragment key={r.id}>
                    <tr
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        background:
                          reembolsoExpandido === r.id ? '#f8fafc' : 'white',
                      }}
                    >
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>
                        {r.id}
                      </td>
                      <td style={{ padding: '10px' }}>{r.solicitante}</td>
                      <td style={{ padding: '10px', fontSize: '13px' }}>
                        {r.fecha}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button
                          onClick={() =>
                            setReembolsoExpandido(
                              reembolsoExpandido === r.id ? null : r.id
                            )
                          }
                          style={{
                            background: '#0284c7',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold',
                          }}
                        >
                          {reembolsoExpandido === r.id
                            ? '🔼 Ocultar Detalle'
                            : `🔽 Ver ${
                                r.detalles ? r.detalles.length : 1
                              } Ítem(s)`}
                        </button>
                      </td>
                      <td
                        style={{
                          padding: '10px',
                          fontWeight: 'bold',
                          color: '#15803d',
                        }}
                      >
                        ${parseFloat(r.total).toFixed(2)} USD
                      </td>
                      <td
                        style={{ padding: '10px', display: 'flex', gap: '6px' }}
                      >
                        <button
                          onClick={() => onAprobarReembolso(r.id)}
                          style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          ✔ Validar y Derivar
                        </button>
                        <button
                          onClick={() => onObservarReembolso(r.id)}
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          ✖ Observar
                        </button>
                      </td>
                    </tr>

                    {/* Despliegue de los Ítems de Gasto y Comprobantes Adjuntos */}
                    {reembolsoExpandido === r.id && (
                      <tr>
                        <td
                          colSpan="6"
                          style={{
                            padding: '15px',
                            background: '#f1f5f9',
                            borderBottom: '2px solid #cbd5e1',
                          }}
                        >
                          <h4
                            style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}
                          >
                            Desglose de Gastos y Comprobantes de Respaldo (
                            {r.id})
                          </h4>
                          <table
                            style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                              background: 'white',
                              fontSize: '12px',
                              border: '1px solid #cbd5e1',
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  background: '#334155',
                                  color: 'white',
                                  textAlign: 'left',
                                }}
                              >
                                <th style={{ padding: '6px' }}>
                                  Cuenta Contable
                                </th>
                                <th style={{ padding: '6px' }}>
                                  Class / Proyecto
                                </th>
                                <th style={{ padding: '6px' }}>Respaldo</th>
                                <th style={{ padding: '6px' }}>
                                  # Comprobante
                                </th>
                                <th style={{ padding: '6px' }}>Fecha Gasto</th>
                                <th style={{ padding: '6px' }}>Descripción</th>
                                <th style={{ padding: '6px' }}>Monto</th>
                                <th style={{ padding: '6px' }}>
                                  Comprobante (Módulo 4)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.detalles &&
                                r.detalles.map((d, idx) => (
                                  <tr
                                    key={idx}
                                    style={{
                                      borderBottom: '1px solid #e2e8f0',
                                    }}
                                  >
                                    <td style={{ padding: '6px' }}>
                                      {d.cuenta}
                                    </td>
                                    <td style={{ padding: '6px' }}>
                                      {d.classCode}
                                    </td>
                                    <td style={{ padding: '6px' }}>
                                      <span
                                        style={{
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          fontSize: '10px',
                                          background:
                                            d.tipoRespaldar === 'Factura'
                                              ? '#dbeafe'
                                              : '#fef3c7',
                                        }}
                                      >
                                        {d.tipoRespaldar}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        padding: '6px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {d.numComprobante}
                                    </td>
                                    <td style={{ padding: '6px' }}>
                                      {d.fechaGasto}
                                    </td>
                                    <td style={{ padding: '6px' }}>
                                      {d.descripcion}
                                    </td>
                                    <td
                                      style={{
                                        padding: '6px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      ${parseFloat(d.monto).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '6px' }}>
                                      {d.archivoPreview ? (
                                        <a
                                          href={d.archivoPreview}
                                          target="_blank"
                                          rel="noreferrer"
                                          style={{
                                            backgroundColor: '#2563eb',
                                            color: 'white',
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            display: 'inline-block',
                                          }}
                                        >
                                          📷 Ver Foto / PDF
                                        </a>
                                      ) : (
                                        <span
                                          style={{
                                            color: '#94a3b8',
                                            fontSize: '11px',
                                          }}
                                        >
                                          Sin archivo
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
