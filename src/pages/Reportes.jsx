import React, { useState } from 'react';

export default function Reportes({ solicitudes = [], reembolsos = [] }) {
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroProyecto, setFiltroProyecto] = useState('TODOS');

  // Unificar Avances y Reembolsos para el Reporte Consolidado
  const reporteConsolidado = [
    ...solicitudes.map((s) => ({
      id: s.id,
      tipo: 'Avance de Efectivo',
      solicitante: s.solicitante,
      fecha: s.fecha,
      concepto: s.detalle,
      monto: s.monto,
      estado: s.estado,
    })),
    ...reembolsos.map((r) => ({
      id: r.id,
      tipo: 'Reembolso / Rendición',
      solicitante: r.solicitante,
      fecha: r.fecha,
      concepto: `Reembolso por ${
        r.detalles ? r.detalles.length : 1
      } ítems de gasto`,
      monto: r.total,
      estado: r.estado,
    })),
  ];

  // Aplicar Filtros
  const datosFiltrados = reporteConsolidado.filter((item) => {
    const coincideEstado =
      filtroEstado === 'TODOS' || item.estado === filtroEstado;
    return coincideEstado;
  });

  const totalMontoFiltrado = datosFiltrados.reduce(
    (sum, item) => sum + parseFloat(item.monto || 0),
    0
  );

  // 1. Exportación a Excel (CSV) 100% Frontend
  const exportarExcel = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent +=
      'Código,Tipo,Solicitante,Fecha,Concepto / Detalle,Monto ($ USD),Estado\n';

    datosFiltrados.forEach((item) => {
      const fila = `"${item.id}","${item.tipo}","${item.solicitante}","${
        item.fecha
      }","${item.concepto.replace(/"/g, '""')}","${item.monto}","${
        item.estado
      }"`;
      csvContent += fila + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Reporte_Financiero_SGC_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Exportación a PDF (Nativa del Navegador)
  const exportarPDF = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Estilos para impresión limpia en PDF */}
      <style>
        {`
          @media print {
            nav, button, select, label, .no-print {
              display: none !important;
            }
            body {
              background: white;
              font-size: 12pt;
            }
            .print-only-title {
              display: block !important;
              text-align: center;
              margin-bottom: 20px;
            }
          }
        `}
      </style>

      <div className="no-print">
        <h2 style={{ color: '#1e3a8a' }}>
          📊 Reportes y Exportación Financiera
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Generación de reportes consolidados por estado y proyecto con opción
          de descarga instantánea.
        </p>

        {/* Barra de Filtros */}
        <div
          style={{
            background: '#f8fafc',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            marginBottom: '20px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'block',
                }}
              >
                Filtrar por Estado:
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                style={{
                  padding: '6px',
                  marginTop: '2px',
                  borderRadius: '4px',
                }}
              >
                <option value="TODOS">Todos los Estados</option>
                <option value="Pendiente Finanzas">Pendiente Finanzas</option>
                <option value="En Revisión por Supervisor">
                  En Revisión por Supervisor
                </option>
                <option value="Aprobado">Aprobado</option>
                <option value="Anulado">Anulado</option>
              </select>
            </div>
          </div>

          {/* Botones de Exportación */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={exportarExcel}
              style={{
                backgroundColor: '#15803d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              📊 Exportar a Excel (CSV)
            </button>
            <button
              onClick={exportarPDF}
              style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              📄 Guardar / Imprimir PDF
            </button>
          </div>
        </div>
      </div>

      {/* Encabezado visible solo en PDF impreso */}
      <div className="print-only-title" style={{ display: 'none' }}>
        <h2>ONG IJM - REPORTE DE CONSOLIDADO FINANCIERO</h2>
        <p>Fecha de Generación: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Tarjeta de Resumen */}
      <div
        style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span
            style={{ fontSize: '13px', color: '#1e40af', fontWeight: 'bold' }}
          >
            Total de Registros Filtrados:
          </span>
          <h3 style={{ margin: '4px 0 0 0', color: '#1e3a8a' }}>
            {datosFiltrados.length} Registros
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            style={{ fontSize: '13px', color: '#1e40af', fontWeight: 'bold' }}
          >
            Monto Consolidado Total:
          </span>
          <h2 style={{ margin: '4px 0 0 0', color: '#15803d' }}>
            ${totalMontoFiltrado.toFixed(2)} USD
          </h2>
        </div>
      </div>

      {/* Tabla del Reporte */}
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
            style={{ background: '#0f172a', color: 'white', textAlign: 'left' }}
          >
            <th style={{ padding: '10px' }}>Código</th>
            <th style={{ padding: '10px' }}>Tipo</th>
            <th style={{ padding: '10px' }}>Solicitante</th>
            <th style={{ padding: '10px' }}>Fecha</th>
            <th style={{ padding: '10px' }}>Concepto</th>
            <th style={{ padding: '10px' }}>Monto ($ USD)</th>
            <th style={{ padding: '10px' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {datosFiltrados.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  padding: '25px',
                  color: '#64748b',
                }}
              >
                No se encontraron registros para los filtros seleccionados.
              </td>
            </tr>
          ) : (
            datosFiltrados.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>
                  {item.id}
                </td>
                <td style={{ padding: '10px', fontSize: '12px' }}>
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: '#e2e8f0',
                    }}
                  >
                    {item.tipo}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{item.solicitante}</td>
                <td style={{ padding: '10px', fontSize: '13px' }}>
                  {item.fecha}
                </td>
                <td style={{ padding: '10px', fontSize: '13px' }}>
                  {item.concepto}
                </td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>
                  ${parseFloat(item.monto).toFixed(2)}
                </td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background:
                        item.estado === 'Aprobado'
                          ? '#dcfce7'
                          : item.estado === 'Anulado'
                          ? '#f3f4f6'
                          : '#fef3c7',
                      color:
                        item.estado === 'Aprobado'
                          ? '#15803d'
                          : item.estado === 'Anulado'
                          ? '#6b7280'
                          : '#b45309',
                    }}
                  >
                    {item.estado}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
