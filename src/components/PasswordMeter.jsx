import React from 'react';

export default function PasswordMeter({ password }) {
  const evaluatePassword = (pass) => {
    if (!pass) return { label: '', color: '#ccc', percent: 0, isValid: false };

    let score = 0;
    const hasLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (score <= 2)
      return {
        label: 'Débil (Requiere mayúscula, número y símbolo)',
        color: '#ef4444',
        percent: 33,
        isValid: false,
      };
    if (score === 3)
      return {
        label: 'Intermedio',
        color: '#f59e0b',
        percent: 66,
        isValid: true,
      };
    return { label: 'Fuerte', color: '#10b981', percent: 100, isValid: true };
  };

  const strength = evaluatePassword(password);

  return (
    <div style={{ marginTop: '8px' }}>
      <div
        style={{
          width: '100%',
          backgroundColor: '#e5e7eb',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${strength.percent}%`,
            backgroundColor: strength.color,
            height: '100%',
            transition: 'width 0.3s',
          }}
        ></div>
      </div>
      {password && (
        <span
          style={{
            fontSize: '12px',
            color: strength.color,
            marginTop: '4px',
            display: 'block',
            fontWeight: 'bold',
          }}
        >
          {strength.label}
        </span>
      )}
    </div>
  );
}
