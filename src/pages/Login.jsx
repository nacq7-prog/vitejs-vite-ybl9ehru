import React, { useState } from 'react';

export default function Login({ onLoginSuccess, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Números aleatorios para el CAPTCHA
  const [num1] = useState(Math.floor(Math.random() * 10));
  const [num2] = useState(Math.floor(Math.random() * 10));

  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (isBlocked) return;

    // Validar CAPTCHA
    if (parseInt(captchaInput) !== num1 + num2) {
      setMessage('Respuesta de CAPTCHA incorrecta.');
      return;
    }

    if (email === 'admin@ong.org' && password === '123456') {
      setMessage('¡Inicio de sesión exitoso!');
      onLoginSuccess();
    } else if (email === 'nashca@ijm.org' && password === '123456') {
      setMessage('¡Inicio de sesión como Finanzas!');
      onLoginSuccess('Finanzas');
    } else if (email === 'natalia@ijm.org' && password === '123456') {
      setMessage('¡Inicio de sesión como Aprobador!');
      onLoginSuccess('Aprobador');
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setIsBlocked(true);
        setMessage(
          'Ha superado los 3 intentos permitidos. Sistema bloqueado por 1 minuto.'
        );
        setTimeout(() => {
          setIsBlocked(false);
          setAttempts(0);
          setMessage('');
        }, 60000); // Un minuto de bloqueo
      } else {
        setMessage(`Credenciales incorrectas. Intento ${nextAttempts} de 3.`);
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <h2>Iniciar Sesión - SGC ONG</h2>

      {message && (
        <p style={{ color: isBlocked ? 'red' : 'blue' }}>{message}</p>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            required
            disabled={isBlocked}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            required
            disabled={isBlocked}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Requerimiento 10: CAPTCHA */}
        <div
          style={{
            marginBottom: '10px',
            background: '#f0f0f0',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <label>
            CAPTCHA: ¿Cuánto es {num1} + {num2}?
          </label>
          <input
            type="number"
            required
            disabled={isBlocked}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isBlocked}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isBlocked ? '#gray' : '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isBlocked ? 'Bloqueado' : 'Ingresar'}
        </button>
      </form>

      {/* Requerimiento 12: Olvidó contraseña */}
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        <button
          onClick={() => setPage('forgot')}
          style={{
            background: 'none',
            border: 'none',
            color: '#1e3a8a',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </p>
    </div>
  );
}
