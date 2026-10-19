import React, { useState } from 'react';
import PasswordMeter from '../components/PasswordMeter';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Nashca Cornejo',
      email: 'nashca@ijm.org',
      tipo: 'Staff',
      roles: ['Finanzas', 'Solicitante'],
      estado: 'Activo',
    },
    {
      id: 2,
      nombre: 'Natalia Cornejo',
      email: 'natalia@ijm.org',
      tipo: 'Staff',
      roles: ['Aprobador', 'Solicitante'],
      estado: 'Activo',
    },
    {
      id: 3,
      nombre: 'Juan Pérez (Consultor)',
      email: 'juan.consultor@gmail.com',
      tipo: 'Consultor',
      roles: ['Solicitante'],
      estado: 'Activo',
    },
  ]);

  const [tipoPersonal, setTipoPersonal] = useState('Staff');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Manejo de Roles (máximo 2)
  const [isSolicitante, setIsSolicitante] = useState(true);
  const [isAprobador, setIsAprobador] = useState(false);
  const [isFinanzas, setIsFinanzas] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  // Validar fortaleza de contraseña
  const isPasswordValid = (pass) => {
    return (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass)
    );
  };

  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    setTipoPersonal(tipo);
    if (tipo === 'Consultor') {
      setIsSolicitante(true);
      setIsAprobador(false);
      setIsFinanzas(false);
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Validar dominio si es Staff
    if (tipoPersonal === 'Staff' && !email.toLowerCase().endsWith('@ijm.org')) {
      setErrorMsg(
        'El personal de Staff debe usar obligatoriamente un correo corporativo @ijm.org'
      );
      return;
    }

    // 2. Validar contraseña
    if (!isPasswordValid(password)) {
      setErrorMsg(
        'La contraseña no cumple con los requisitos de seguridad (mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial).'
      );
      return;
    }

    // 3. Construir lista de roles seleccionados
    const rolesSeleccionados = [];
    if (isSolicitante) rolesSeleccionados.push('Solicitante');
    if (isAprobador) rolesSeleccionados.push('Aprobador');
    if (isFinanzas) rolesSeleccionados.push('Finanzas');

    // 4. Validar máximo 2 roles
    if (rolesSeleccionados.length > 2) {
      setErrorMsg('Un usuario no puede tener más de 2 roles asignados.');
      return;
    }

    // 5. Validar que Finanzas no sea Aprobador
    if (isFinanzas && isAprobador) {
      setErrorMsg(
        'Por políticas de control interno, un usuario con rol de Finanzas no puede ser Aprobador.'
      );
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre,
      email,
      tipo: tipoPersonal,
      roles: rolesSeleccionados,
      estado: 'Activo',
    };

    setUsuarios([...usuarios, nuevo]);

    // Limpiar campos
    setNombre('');
    setEmail('');
    setPassword('');
    setErrorMsg('');
  };

  const handleToggleEstado = (id) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === id
          ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' }
          : u
      )
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a8a' }}>Control de Usuarios y Roles (IJM)</h2>

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

      {/* Formulario */}
      <div
        style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          marginBottom: '25px',
        }}
      >
        <h3>Registrar Nuevo Empleado / Consultor</h3>
        <form
          onSubmit={handleGuardar}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
          }}
        >
          <div>
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
              Tipo de Personal:
            </label>
            <select
              value={tipoPersonal}
              onChange={handleTipoChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            >
              <option value="Staff">Staff / Empleado IJM (@ijm.org)</option>
              <option value="Consultor">Consultor Externo (Ej. Gmail)</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
              Nombre Completo:
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
              Correo Electrónico:
            </label>
            <input
              type="email"
              required
              placeholder={
                tipoPersonal === 'Staff'
                  ? 'ejemplo@ijm.org'
                  : 'ejemplo@gmail.com'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
              Contraseña:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
            <PasswordMeter password={password} />
          </div>

          {/* Asignación de Roles */}
          <div
            style={{
              gridColumn: 'span 2',
              background: '#fff',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
            }}
          >
            <label
              style={{
                fontWeight: 'bold',
                fontSize: '13px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Roles Asignados (Máximo 2 roles):
            </label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={isSolicitante}
                  onChange={(e) => setIsSolicitante(e.target.checked)}
                />{' '}
                Solicitante
              </label>

              {tipoPersonal === 'Staff' && (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={isAprobador}
                      disabled={isFinanzas}
                      onChange={(e) => setIsAprobador(e.target.checked)}
                    />{' '}
                    Aprobador
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={isFinanzas}
                      disabled={isAprobador}
                      onChange={(e) => setIsFinanzas(e.target.checked)}
                    />{' '}
                    Finanzas
                  </label>
                </>
              )}
            </div>
            {tipoPersonal === 'Consultor' && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#666',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                * Los consultores externos solo pueden tener el rol de
                Solicitante.
              </span>
            )}
          </div>

          <div style={{ gridColumn: 'span 2' }}>
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
              Guardar Usuario
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Usuarios */}
      <h3>Listado de Personal</h3>
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
            <th style={{ padding: '10px' }}>Nombre</th>
            <th style={{ padding: '10px' }}>Correo</th>
            <th style={{ padding: '10px' }}>Tipo</th>
            <th style={{ padding: '10px' }}>Roles</th>
            <th style={{ padding: '10px' }}>Estado</th>
            <th style={{ padding: '10px' }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px' }}>{u.nombre}</td>
              <td style={{ padding: '10px' }}>{u.email}</td>
              <td style={{ padding: '10px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    background: u.tipo === 'Staff' ? '#dbeafe' : '#fef3c7',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {u.tipo}
                </span>
              </td>
              <td style={{ padding: '10px' }}>{u.roles.join(', ')}</td>
              <td style={{ padding: '10px' }}>
                <span
                  style={{
                    color: u.estado === 'Activo' ? '#16a34a' : '#dc2626',
                    fontWeight: 'bold',
                  }}
                >
                  {u.estado}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleToggleEstado(u.id)}
                  style={{
                    backgroundColor:
                      u.estado === 'Activo' ? '#dc2626' : '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  {u.estado === 'Activo' ? 'Desactivar' : 'Reactivar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
