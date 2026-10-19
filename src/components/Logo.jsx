import React from 'react';

export const Logo = ({ size = 38 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48" fill="#0080ca" />
      {/* Esfera del Mundo */}
      <circle
        cx="50"
        cy="42"
        r="22"
        stroke="#ffffff"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M32 42 Q40 32 50 42 T68 42"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
      <path d="M50 20 V64" stroke="#ffffff" strokeWidth="2" />
      {/* Hojas / Laureles inferiores */}
      <path
        d="M30 68 Q50 80 70 68"
        stroke="#ffffff"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M35 63 Q42 66 45 72"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M65 63 Q58 66 55 72"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};
