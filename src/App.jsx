import React, { useState } from 'react';
import Menu from './components/Menu';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Solicitudes from './pages/Solicitudes';
import Reembolsos from './pages/Reembolsos';
import BandejaRevision from './pages/BandejaRevision';
import Reportes from './pages/Reportes';
import Catalogos from './pages/Catalogos';
import Bitacora from './pages/Bitacora';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('Solicitante');
  const [userName, setUserName] = useState('Nashca Cornejo');
  const [currentPage, setCurrentPage] = useState('login');

  // ----------------------------------------------------
  // ESTADO MÓDULO 7: CATÁLOGOS CONTABLES Y MATRIZ CLASS
  // ----------------------------------------------------
  const [proyectosClass] = useState([
    'CLASS-001: Protección Infantil IJM',
    'CLASS-002: Fortalecimiento de Justicia',
    'CLASS-003: Operaciones y Administración General',
  ]);

  const [cuentasGlobales, setCuentasGlobales] = useState([
    { id: 1, nombre: '5101 - Pasajes y Viáticos', activa: true },
    { id: 2, nombre: '5102 - Alimentación y Hospitalidad', activa: true },
    { id: 3, nombre: '5103 - Materiales y Suministros', activa: true },
    { id: 4, nombre: '5104 - Alquileres y Eventos', activa: true },
    {
      id: 5,
      nombre: '5105 - Servicios Profesionales / Consultoría',
      activa: true,
    },
    { id: 6, nombre: '5106 - Combustible y Mantenimiento', activa: true },
  ]);

  // Matriz Class ↔ Cuentas Habilitadas
  const [matrizAsignacion, setMatrizAsignacion] = useState({
    'CLASS-001: Protección Infantil IJM': [
      '5101 - Pasajes y Viáticos',
      '5102 - Alimentación y Hospitalidad',
      '5103 - Materiales y Suministros',
    ],
    'CLASS-002: Fortalecimiento de Justicia': [
      '5101 - Pasajes y Viáticos',
      '5104 - Alquileres y Eventos',
      '5105 - Servicios Profesionales / Consultoría',
    ],
    'CLASS-003: Operaciones y Administración General': [
      '5102 - Alimentación y Hospitalidad',
      '5103 - Materiales y Suministros',
      '5106 - Combustible y Mantenimiento',
    ],
  });

  // Manejadores Módulo 7
  const handleAgregarCuenta = (nuevaCuenta) => {
    setCuentasGlobales([...cuentasGlobales, nuevaCuenta]);
  };

  const handleToggleEstadoCuenta = (id) => {
    setCuentasGlobales(
      cuentasGlobales.map((c) =>
        c.id === id ? { ...c, activa: !c.activa } : c
      )
    );
  };

  const handleGuardarAsignacionClass = (classCode, cuentas) => {
    setMatrizAsignacion({
      ...matrizAsignacion,
      [classCode]: cuentas,
    });
  };

  // ----------------------------------------------------
  // ESTADO MÓDULO 2 Y 5: SOLICITUDES DE AVANCE DE EFECTIVO
  // ----------------------------------------------------
  const [solicitudes, setSolicitudes] = useState([
    {
      id: 'RMB-0001',
      solicitante: 'Natalia Cornejo',
      cuenta: 'Cash Advance - Natalia Cornejo',
      fecha: '2026-10-17',
      detalle: 'Cash advance para taller regional',
      monto: 450,
      estado: 'Aprobado',
    },
    {
      id: 'RMB-0002',
      solicitante: 'Carlos López (Consultor)',
      cuenta: 'Cash Advance - Carlos López',
      fecha: '2026-10-17',
      detalle: 'Cash advance viajes de campo',
      monto: 1200,
      estado: 'Pendiente Finanzas',
    },
  ]);

  // Manejadores Módulo 2 y 5 (Solicitudes)
  const handleCrearSolicitud = (data) => {
    const correlativo = String(solicitudes.length + 1).padStart(4, '0');
    setSolicitudes([
      ...solicitudes,
      { id: `RMB-${correlativo}`, ...data, estado: 'Pendiente Finanzas' },
    ]);
  };

  const handleEditarSolicitud = (id, nuevosDatos) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, ...nuevosDatos, estado: 'Pendiente Finanzas' } : s
      )
    );
  };

  const handleAnularSolicitud = (id) => {
    setSolicitudes(
      solicitudes.map((s) => (s.id === id ? { ...s, estado: 'Anulado' } : s))
    );
  };

  const handleAprobarSolicitudFinanzas = (id) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado: 'En Revisión por Supervisor' } : s
      )
    );
  };

  const handleObservarSolicitudFinanzas = (id) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado: 'Observado por Finanzas' } : s
      )
    );
  };

  // ----------------------------------------------------
  // ESTADO MÓDULO 3, 4 Y 5: REEMBOLSOS Y RENDICIONES
  // ----------------------------------------------------
  const [reembolsos, setReembolsos] = useState([
    {
      id: 'REEMB-0001',
      solicitante: 'Natalia Cornejo',
      fecha: '2026-10-17',
      total: 180,
      estado: 'Pendiente Finanzas',
      detalles: [
        {
          id: 1,
          cuenta: '5101 - Pasajes y Viáticos',
          classCode: 'CLASS-001: Protección Infantil IJM',
          tipoRespaldar: 'Factura',
          numComprobante: 'F-102',
          fechaGasto: '2026-10-16',
          descripcion: 'Pasajes de bus a campo',
          monto: 180,
          archivo: 'factura_bus.pdf',
          archivoPreview: null,
        },
      ],
    },
  ]);

  // Manejadores Módulo 3, 4 y 5 (Reembolsos)
  const handleCrearReembolso = (data) => {
    const correlativo = String(reembolsos.length + 1).padStart(4, '0');
    setReembolsos([
      ...reembolsos,
      { id: `REEMB-${correlativo}`, ...data, estado: 'Pendiente Finanzas' },
    ]);
  };

  const handleEditarReembolso = (id, nuevosDatos) => {
    setReembolsos(
      reembolsos.map((r) =>
        r.id === id ? { ...r, ...nuevosDatos, estado: 'Pendiente Finanzas' } : r
      )
    );
  };

  const handleAnularReembolso = (id) => {
    setReembolsos(
      reembolsos.map((r) => (r.id === id ? { ...r, estado: 'Anulado' } : r))
    );
  };

  const handleAprobarReembolsoFinanzas = (id) => {
    setReembolsos(
      reembolsos.map((r) =>
        r.id === id ? { ...r, estado: 'En Revisión por Supervisor' } : r
      )
    );
  };

  const handleObservarReembolsoFinanzas = (id) => {
    setReembolsos(
      reembolsos.map((r) =>
        r.id === id ? { ...r, estado: 'Observado por Finanzas' } : r
      )
    );
  };

  // ----------------------------------------------------
  // AUTENTICACIÓN Y NAVEGACIÓN
  // ----------------------------------------------------
  const handleLoginSuccess = (
    role = 'Solicitante',
    name = 'Nashca Cornejo'
  ) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('Solicitante');
    setCurrentPage('login');
  };

  return (
    <div>
      {isAuthenticated && (
        <Menu
          setPage={setCurrentPage}
          userRole={userRole}
          onLogout={handleLogout}
        />
      )}

      <main style={{ padding: '20px' }}>
        {!isAuthenticated && currentPage === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} setPage={setCurrentPage} />
        )}

        {isAuthenticated && currentPage === 'dashboard' && (
          <Dashboard userRole={userRole} />
        )}

        {isAuthenticated && currentPage === 'solicitudes' && (
          <Solicitudes
            userName={userName}
            solicitudes={solicitudes}
            onCrearSolicitud={handleCrearSolicitud}
            onEditarSolicitud={handleEditarSolicitud}
            onAnularSolicitud={handleAnularSolicitud}
          />
        )}

        {isAuthenticated && currentPage === 'reembolsos' && (
          <Reembolsos
            userName={userName}
            reembolsos={reembolsos}
            matrizAsignacion={matrizAsignacion}
            cuentasGlobales={cuentasGlobales}
            proyectosClass={proyectosClass}
            onCrearReembolso={handleCrearReembolso}
            onEditarReembolso={handleEditarReembolso}
            onAnularReembolso={handleAnularReembolso}
          />
        )}

        {isAuthenticated &&
          currentPage === 'revision' &&
          userRole === 'Finanzas' && (
            <BandejaRevision
              solicitudes={solicitudes}
              reembolsos={reembolsos}
              onAprobarSolicitud={handleAprobarSolicitudFinanzas}
              onObservarSolicitud={handleObservarSolicitudFinanzas}
              onAprobarReembolso={handleAprobarReembolsoFinanzas}
              onObservarReembolso={handleObservarReembolsoFinanzas}
            />
          )}

        {isAuthenticated &&
          currentPage === 'catalogos' &&
          userRole === 'Finanzas' && (
            <Catalogos
              cuentasGlobales={cuentasGlobales}
              proyectosClass={proyectosClass}
              matrizAsignacion={matrizAsignacion}
              onAgregarCuenta={handleAgregarCuenta}
              onToggleEstadoCuenta={handleToggleEstadoCuenta}
              onGuardarAsignacionClass={handleGuardarAsignacionClass}
            />
          )}

        {isAuthenticated &&
          currentPage === 'usuarios' &&
          userRole === 'Finanzas' && <Usuarios />}

        {isAuthenticated &&
          currentPage === 'reportes' &&
          userRole === 'Finanzas' && (
            <Reportes solicitudes={solicitudes} reembolsos={reembolsos} />
          )}

        {isAuthenticated &&
          currentPage === 'bitacora' &&
          userRole === 'Finanzas' && <Bitacora />}
      </main>
    </div>
  );
}
