import{j as n,L as a}from"./vendor-react-Dd0bvrP_.js";import"./vendor-BAdBCfSz.js";function t(){return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .landing-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 24px;
          overflow-y: auto;
          z-index: 1;
        }
        
        .landing-hero {
          text-align: center;
          max-width: 900px;
          width: 100%;
          animation: fadeInUp 0.8s ease-out;
        }
        
        .landing-title {
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 24px;
          background: linear-gradient(135deg, #7dd3fc 0%, #a78bfa 50%, #34d399 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite, fadeInUp 0.8s ease-out 0.2s both;
          letter-spacing: -0.02em;
        }
        
        .landing-subtitle {
          font-size: clamp(18px, 2.5vw, 28px);
          color: var(--muted);
          margin: 0 0 64px;
          font-weight: 400;
          animation: fadeInUp 0.8s ease-out 0.4s both;
          opacity: 0.9;
        }
        
        .landing-actions {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }
        
        .landing-btn {
          padding: 20px 32px;
          font-size: 20px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 180px;
          border: 1px solid transparent;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          font-smooth: always;
        }
        
        .landing-btn-primary {
          background: #ffffff;
          color: #0b0d10;
          border: 1px solid rgba(0, 0, 0, 0.15);
        }
        
        .landing-btn-primary:hover {
          background: linear-gradient(90deg, rgba(255,255,255,1), rgba(248,249,255,0.98));
          border-color: rgba(0, 0, 0, 0.18);
          box-shadow: 0 1px 0 rgba(255,255,255,0.25) inset, 0 0 0 1px rgba(255,255,255,0.02) inset;
        }
        
        .landing-btn-secondary {
          background: #1f2430;
          color: var(--text);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        
        .landing-btn-secondary:hover {
          background: linear-gradient(90deg, rgba(125,211,252,0.14), rgba(167,139,250,0.16));
          border-color: rgba(255, 255, 255, 0.18);
        }
        
        .landing-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(125, 211, 252, 0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse 4s ease-in-out infinite;
          z-index: -1;
        }
        
        .landing-glow-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .landing-glow-2 {
          bottom: 10%;
          right: 10%;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%);
          animation-delay: 2s;
        }
        
        @media (max-width: 768px) {
          .landing-container {
            padding: 60px 16px 16px;
          }
          
          .landing-actions {
            flex-direction: column;
            width: 100%;
          }
          
          .landing-btn {
            width: 100%;
            min-width: unset;
            padding: 18px 24px;
            font-size: 18px;
          }
        }
      `}),n.jsxs("div",{className:"landing-container",children:[n.jsx("div",{className:"landing-glow landing-glow-1"}),n.jsx("div",{className:"landing-glow landing-glow-2"}),n.jsxs("div",{className:"landing-hero",children:[n.jsx("h1",{className:"landing-title",children:"mappi!"}),n.jsx("p",{className:"landing-subtitle",children:"Navigate to.."}),n.jsxs("div",{className:"landing-actions",children:[n.jsx(a,{to:"/mp/discover",className:"landing-btn landing-btn-secondary",children:"mappi.ng"}),n.jsx(a,{to:"/md/feed",className:"landing-btn landing-btn-secondary",children:"moddi.ng"})]})]})]})]})}export{t as default};
