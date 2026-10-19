import React, { useState } from 'react';

export default function Catalogos({
  cuentasGlobales = [],
  proyectosClass = [],
  matrizAsignacion = {},
  onAgregarCuenta,
  onToggleEstadoCuenta,
  onGuardarAsignacionClass,
}) {
  const [selectedClass, setSelectedClass] = useState(proyectosClass[0] || '');
  const [nuevaCuentaCodigo, setNuevaCuentaCodigo] = useState('');
  const [nuevaCuentaNombre, setNuevaCuentaNombre] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Cuentas seleccionadas temporalmente para el Class actual
  const cuentasAsignadasActuales = matrizAsignacion[selectedClass] || [];

  // Crear nueva cuenta contable global
  const handleCrearCuenta = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nuevaCuentaCodigo || !nuevaCuentaNombre) {
      setErrorMsg('Debe ingresar el código y el nombre de la cuenta.');
      return;
    }

    const nueva = `${nuevaCuentaCodigo} - ${nuevaCuentaNombre}`;
    if (cuentasGlobales.some((c) => c.nombre === nueva)) {
      setErrorMsg('La cuenta contable ya existe.');
      return;
    }

    onAgregarCuenta({ id: Date.now(), nombre: nueva, activa: true });
    setNuevaCuentaCodigo('');
    setNuevaCuentaNombre('');
  };

  // Marcar/desmarcar cuenta para el Class seleccionado
  const handleToggleCuentaClass = (cuentaNombre) => {
    let nuevasAsignadas;
    if (cuentasAsignadasActuales.includes(cuentaNombre)) {
      nuevasAsignadas = cuentasAsignadasActuales.filter(
        (c) => c !== cuentaNombre
      );
    } else {
      nuevasAsignadas = [...cuentasAsignadasActuales, cuentaNombre];
    }
    onGuardarAsignacionClass(selectedClass, nuevasAsignadas);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a8a' }}>
        Catálogos Contables y Matriz Class ↔ Cuentas
      </h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Administre la lista general de cuentas y restrinja qué cuentas están
        autorizadas para cada proyecto / Class.
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

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        {/* SECCIÓN 1: ALTAS Y BAJAS DE CUENTAS CONTABLES */}
        <div
          style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
          }}
        >
          <h3
            style={{
              borderBottom: '2px solid #cbd5e1',
              paddingBottom: '8px',
              color: '#0f172a',
            }}
          >
            1. Catálogo General de Cuentas
          </h3>

          <form
            onSubmit={handleCrearCuenta}
            style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Código (Ej. 5106)"
              value={nuevaCuentaCodigo}
              onChange={(e) => setNuevaCuentaCodigo(e.target.value)}
              style={{ width: '30%', padding: '6px' }}
            />
            <input
              type="text"
              placeholder="Nombre de la Cuenta"
              value={nuevaCuentaNombre}
              onChange={(e) => setNuevaCuentaNombre(e.target.value)}
              style={{ width: '50%', padding: '6px' }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              + Crear
            </button>
          </form>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              fontSize: '13px',
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
                <th style={{ padding: '8px' }}>Cuenta Contable</th>
                <th style={{ padding: '8px' }}>Estado</th>
                <th style={{ padding: '8px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cuentasGlobales.map((c) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    opacity: c.activa ? 1 : 0.5,
                  }}
                >
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>
                    {c.nombre}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        background: c.activa ? '#dcfce7' : '#fee2e2',
                        color: c.activa ? '#15803d' : '#991b1b',
                      }}
                    >
                      {c.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={() => onToggleEstadoCuenta(c.id)}
                      style={{
                        backgroundColor: c.activa ? '#dc2626' : '#16a34a',
                        color: 'white',
                        border: 'none',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      {c.activa ? 'Dar de Baja' : 'Dar de Alta'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECCIÓN 2: MATRIZ DE ASIGNACIÓN CLASS ↔ CUENTAS */}
        <div
          style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
          }}
        >
          <h3
            style={{
              borderBottom: '2px solid #cbd5e1',
              paddingBottom: '8px',
              color: '#0f172a',
            }}
          >
            2. Asignación por Class / Proyecto
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Seleccione el Class / Proyecto:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
            >
              {proyectosClass.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Marque únicamente las cuentas contables que los solicitantes de este
            proyecto podrán utilizar:
          </p>

          <div
            style={{
              background: 'white',
              border: '1px solid #cbd5e1',
              padding: '10px',
              borderRadius: '6px',
              maxHeight: '250px',
              overflowY: 'auto',
            }}
          >
            {cuentasGlobales
              .filter((c) => c.activa)
              .map((c) => {
                const estaAsignada = cuentasAsignadasActuales.includes(
                  c.nombre
                );
                return (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ fontSize: '13px' }}>{c.nombre}</span>
                    <input
                      type="checkbox"
                      checked={estaAsignada}
                      onChange={() => handleToggleCuentaClass(c.nombre)}
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                  </div>
                );
              })}
          </div>

          <div
            style={{
              marginTop: '12px',
              padding: '8px',
              background: '#eff6ff',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#1e40af',
            }}
          >
            💡 Cuentas habilitadas para <strong>{selectedClass}</strong>:{' '}
            <strong>{cuentasAsignadasActuales.length}</strong> de{' '}
            {cuentasGlobales.filter((c) => c.activa).length}
          </div>
        </div>
      </div>
    </div>
  );
}
