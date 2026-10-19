import React, { useState } from 'react';

export default function Reembolsos({
  userName = 'Nashca Cornejo',
  reembolsos = [],
  matrizAsignacion = {},
  cuentasGlobales = [],
  proyectosClass = [],
  onCrearReembolso,
  onEditarReembolso,
  onAnularReembolso,
}) {
  const fechaHoy = new Date().toISOString().split('T')[0];

  // Proyectos / Class por defecto si no vienen por props
  const proyectosDisponibles =
    proyectosClass.length > 0
      ? proyectosClass
      : [
          'CLASS-001: Protección Infantil IJM',
          'CLASS-002: Fortalecimiento de Justicia',
          'CLASS-003: Operaciones y Administración General',
        ];

  // Cuentas globales activas por defecto
  const cuentasActivas = cuentasGlobales
    .filter((c) => c.activa)
    .map((c) => c.nombre);

  // Función para obtener solo las cuentas permitidas según el Class/Proyecto (Módulo 7)
  const getCuentasParaClass = (classCode) => {
    const permitidas = matrizAsignacion[classCode];
    if (permitidas && permitidas.length > 0) {
      return permitidas;
    }
    return cuentasActivas.length > 0
      ? cuentasActivas
      : [
          '5101 - Pasajes y Viáticos',
          '5102 - Alimentación y Hospitalidad',
          '5103 - Materiales y Suministros',
          '5104 - Alquileres y Eventos',
          '5105 - Servicios Profesionales / Consultoría',
        ];
  };

  // Fila de gasto por defecto
  const crearFilaInicial = () => {
    const classInicial = proyectosDisponibles[0];
    const cuentasIniciales = getCuentasParaClass(classInicial);
    return {
      id: Date.now(),
      cuenta: cuentasIniciales[0] || '',
      classCode: classInicial,
      tipoRespaldar: 'Factura',
      numComprobante: '',
      fechaGasto: fechaHoy,
      descripcion: '',
      monto: '',
      archivo: null,
      archivoPreview: null,
    };
  };

  // Estado del Formulario
  const [items, setItems] = useState([crearFilaInicial()]);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Agregar una nueva fila de gasto (Hijo)
  const handleAgregarFila = () => {
    setItems([...items, crearFilaInicial()]);
  };

  // Eliminar fila
  const handleEliminarFila = (id) => {
    if (items.length === 1) {
      alert('Un reembolso debe contener al menos un ítem de gasto.');
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  // Modificar campo de una fila específica
  const handleChangeItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const itemActualizado = { ...item, [field]: value };

          // Si cambia el Class/Proyecto, actualizar la lista de cuentas contables válidas (Módulo 7)
          if (field === 'classCode') {
            const cuentasPermitidas = getCuentasParaClass(value);
            itemActualizado.cuenta = cuentasPermitidas[0] || '';
          }

          return itemActualizado;
        }
        return item;
      })
    );
  };

  // Manejar la carga de archivos de comprobante (Módulo 4)
  const handleFileChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setItems(
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                archivo: file.name,
                archivoPreview: previewUrl,
                archivoTipo: file.type,
              }
            : item
        )
      );
    }
  };

  // Calcular el total dinámico del reembolso
  const totalReembolso = items.reduce(
    (sum, item) => sum + (parseFloat(item.monto) || 0),
    0
  );

  // Guardar o Actualizar Reembolso
  const handleGuardar = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validaciones de los campos obligatorios y comprobantes
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (
        !it.numComprobante ||
        !it.descripcion ||
        !it.monto ||
        parseFloat(it.monto) <= 0
      ) {
        setErrorMsg(
          `Por favor complete los campos obligatorios en el ítem de gasto #${
            i + 1
          }.`
        );
        return;
      }
      if (!it.archivo) {
        setErrorMsg(
          `Módulo 4: Debe adjuntar la foto o PDF del comprobante/factura en el ítem de gasto #${
            i + 1
          }.`
        );
        return;
      }
    }

    if (editId) {
      // Reenviar Reembolso Observado (Módulo 5)
      onEditarReembolso(editId, {
        total: totalReembolso,
        detalles: items,
      });
      setEditId(null);
    } else {
      // Crear Nuevo Reembolso
      onCrearReembolso({
        solicitante: userName,
        fecha: fechaHoy,
        total: totalReembolso,
        detalles: items,
      });
    }

    // Resetear formulario
    setItems([crearFilaInicial()]);
  };

  // Cargar un reembolso observado para edición
  const handleCargarEdicion = (reembolso) => {
    setEditId(reembolso.id);
    setItems(reembolso.detalles || []);
  };

  const misReembolsos = reembolsos.filter((r) => r.solicitante === userName);

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a8a' }}>
        Reembolsos, Comprobantes y Asignación por Class
      </h2>
      <p style={{ color: '#555' }}>
        Registro de rendiciones de gastos extraordinarios con cuentas
        restringidas por proyecto y adjuntos de respaldo.
      </p>

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

      {/* Formulario Estructurado Padre-Hijo */}
      <div
        style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          marginBottom: '30px',
        }}
      >
        <h3
          style={{
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '8px',
            color: '#0f172a',
          }}
        >
          {editId
            ? `✏️ Corregir y Reenviar Reembolso ${editId}`
            : 'Cabecera del Reembolso (Datos Padre)'}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            marginBottom: '20px',
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

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Monto Total a Reembolsar:
            </label>
            <input
              type="text"
              disabled
              value={`$ ${totalReembolso.toFixed(2)} USD`}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                background: '#dcfce7',
                fontWeight: 'bold',
                color: '#15803d',
              }}
            />
          </div>
        </div>

        <h3
          style={{
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '8px',
            color: '#0f172a',
          }}
        >
          Líneas de Gasto y Comprobantes (Datos Hijo)
        </h3>

        <form onSubmit={handleGuardar}>
          {items.map((item, index) => {
            const cuentasPermitidas = getCuentasParaClass(item.classCode);

            return (
              <div
                key={item.id || index}
                style={{
                  background: '#fff',
                  border: '1px solid #cbd5e1',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '15px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#1e3a8a',
                  }}
                >
                  <span>Ítem de Gasto #{index + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleEliminarFila(item.id)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      🗑️ Eliminar Fila
                    </button>
                  )}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      Proyecto / Class:
                    </label>
                    <select
                      value={item.classCode}
                      onChange={(e) =>
                        handleChangeItem(item.id, 'classCode', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '6px',
                        marginTop: '2px',
                      }}
                    >
                      {proyectosDisponibles.map((cl, i) => (
                        <option key={i} value={cl}>
                          {cl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      Cuenta Contable (Módulo 7):
                    </label>
                    <select
                      value={item.cuenta}
                      onChange={(e) =>
                        handleChangeItem(item.id, 'cuenta', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '6px',
                        marginTop: '2px',
                      }}
                    >
                      {cuentasPermitidas.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      Tipo Respaldo:
                    </label>
                    <select
                      value={item.tipoRespaldar}
                      onChange={(e) =>
                        handleChangeItem(
                          item.id,
                          'tipoRespaldar',
                          e.target.value
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '6px',
                        marginTop: '2px',
                      }}
                    >
                      <option value="Factura">Factura Oficial</option>
                      <option value="Recibo">Recibo / Recibo Simple</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1.5fr',
                    gap: '10px',
                    alignItems: 'end',
                  }}
                >
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      # Nro. Comprobante:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. F-102"
                      value={item.numComprobante}
                      onChange={(e) =>
                        handleChangeItem(
                          item.id,
                          'numComprobante',
                          e.target.value
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '6px',
                        marginTop: '2px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      Fecha del Gasto:
                    </label>
                    <input
                      type="date"
                      required
                      value={item.fechaGasto}
                      onChange={(e) =>
                        handleChangeItem(item.id, 'fechaGasto', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '6px',
                        marginTop: '2px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      Descripción del Gasto:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Almuerzo de trabajo con autoridades"
                      value={item.descripcion}
                      onChange={(e) =>
                        handleChangeItem(item.id, 'descripcion', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '6px',
                        marginTop: '2px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      Monto ($ USD):
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={item.monto}
                      onChange={(e) =>
                        handleChangeItem(item.id, 'monto', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '6px',
                        marginTop: '2px',
                      }}
                    />
                  </div>

                  {/* Subida de Archivo Respaldo (Módulo 4) */}
                  <div>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#1e3a8a',
                      }}
                    >
                      📎 Subir Factura / Recibo:
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(item.id, e)}
                      style={{
                        width: '100%',
                        fontSize: '11px',
                        marginTop: '2px',
                      }}
                    />
                    {item.archivoPreview && (
                      <div style={{ marginTop: '5px' }}>
                        <a
                          href={item.archivoPreview}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '11px',
                            color: '#2563eb',
                            fontWeight: 'bold',
                          }}
                        >
                          👁️ Previsualizar ({item.archivo})
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '15px',
            }}
          >
            <button
              type="button"
              onClick={handleAgregarFila}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ➕ Agregar Otro Ítem de Gasto
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '10px 25px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                {editId ? 'Reenviar a Finanzas' : 'Enviar Reembolso a Finanzas'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setItems([crearFilaInicial()]);
                  }}
                  style={{
                    backgroundColor: '#64748b',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Historial de Reembolsos */}
      <h3>Mis Rendiciones y Reembolsos Solicitados</h3>
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
            style={{ background: '#1e3a8a', color: 'white', textAlign: 'left' }}
          >
            <th style={{ padding: '10px' }}>Código</th>
            <th style={{ padding: '10px' }}>Fecha</th>
            <th style={{ padding: '10px' }}>Ítems</th>
            <th style={{ padding: '10px' }}>Total ($ USD)</th>
            <th style={{ padding: '10px' }}>Estado</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {misReembolsos.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#64748b',
                }}
              >
                No tiene reembolsos registrados.
              </td>
            </tr>
          ) : (
            misReembolsos.map((r) => {
              const esObservado = r.estado.includes('Observado');
              const esModificable =
                r.estado === 'Pendiente Finanzas' || esObservado;

              return (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    opacity: r.estado === 'Anulado' ? 0.5 : 1,
                  }}
                >
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>
                    {r.id}
                  </td>
                  <td style={{ padding: '10px' }}>{r.fecha}</td>
                  <td style={{ padding: '10px' }}>
                    {r.detalles ? r.detalles.length : 1} ítems
                  </td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>
                    ${parseFloat(r.total).toFixed(2)} USD
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background:
                          r.estado === 'Aprobado'
                            ? '#dcfce7'
                            : esObservado
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          r.estado === 'Aprobado'
                            ? '#15803d'
                            : esObservado
                            ? '#991b1b'
                            : '#b45309',
                      }}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                    {/* Botón de corrección activado al observarse */}
                    {esObservado && (
                      <button
                        onClick={() => handleCargarEdicion(r)}
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
                        onClick={() => onAnularReembolso(r.id)}
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
