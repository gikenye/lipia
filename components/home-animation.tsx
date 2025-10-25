'use client';

export default function HomeAnimation() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: 'linear-gradient(45deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
        pointerEvents: 'none'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, gold, orange)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'spin 3s linear infinite'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          left: '70%',
          width: '40px',
          height: '40px',
          background: 'radial-gradient(circle, silver, gray)',
          borderRadius: '50%',
          animation: 'float 4s ease-in-out infinite'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: '70%',
          left: '20%',
          width: '35px',
          height: '35px',
          background: 'radial-gradient(circle, #ccc, #999)',
          borderRadius: '50%',
          animation: 'float 5s ease-in-out infinite reverse'
        }}
      />
    </div>
  );
}