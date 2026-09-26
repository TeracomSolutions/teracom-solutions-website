import React from 'react';

const AdminAssistantAvatar = ({ state = 'idle', size = 200 }) => {
  const getAnimationClass = () => {
    switch (state) {
      case 'listening':
        return 'animate-listening';
      case 'thinking':
        return 'animate-thinking';
      case 'speaking':
        return 'animate-speaking';
      default:
        return 'animate-idle';
    }
  };

  const getEyePosition = () => {
    switch (state) {
      case 'listening':
        return { x: 50, y: 40 };
      case 'thinking':
        return { x: 50, y: 35 };
      case 'speaking':
        return { x: 50, y: 45 };
      default:
        return { x: 50, y: 40 };
    }
  };

  const getMouthShape = () => {
    switch (state) {
      case 'listening':
        return 'M 30 70 Q 50 65 70 70';
      case 'thinking':
        return 'M 30 70 Q 50 75 70 70';
      case 'speaking':
        return 'M 30 70 Q 50 80 70 70';
      default:
        return 'M 30 70 Q 50 70 70 70';
    }
  };

  const animationClass = getAnimationClass();
  const eyePosition = getEyePosition();
  const mouthShape = getMouthShape();

  return (
    <div className="admin-assistant-avatar" style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={animationClass}
      >
        {/* Head */}
        <circle cx="50" cy="50" r="45" fill="#4A90E2" stroke="#357ABD" strokeWidth="2" />
        
        {/* Eyes */}
        <circle cx="35" cy="40" r="8" fill="white" />
        <circle cx="65" cy="40" r="8" fill="white" />
        <circle cx={eyePosition.x} cy={eyePosition.y} r="4" fill="#333" />
        
        {/* Eyelids */}
        <path d="M 30 35 Q 50 30 70 35" fill="none" stroke="#333" strokeWidth="1" />
        
        {/* Mouth */}
        <path d={mouthShape} fill="none" stroke="#333" strokeWidth="2" />
        
        {/* Hair */}
        <path d="M 20 20 Q 30 10 50 15 Q 70 10 80 20 Q 75 25 60 20 Q 45 25 30 20 Q 25 25 20 20" fill="#2C3E50" />
        
        {/* Neck */}
        <rect x="45" y="90" width="10" height="10" fill="#4A90E2" />
      </svg>
      
      <style jsx>{`
        .admin-assistant-avatar {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        @keyframes idle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes listening {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.03); }
          75% { transform: scale(1.01); }
        }
        
        @keyframes thinking {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.02); }
          75% { transform: scale(1.03); }
        }
        
        @keyframes speaking {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.04); }
          75% { transform: scale(1.02); }
        }
        
        .animate-idle {
          animation: idle 3s ease-in-out infinite;
        }
        
        .animate-listening {
          animation: listening 2s ease-in-out infinite;
        }
        
        .animate-thinking {
          animation: thinking 4s ease-in-out infinite;
        }
        
        .animate-speaking {
          animation: speaking 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminAssistantAvatar;