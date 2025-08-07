import React from 'react';

const ExtensionPreview: React.FC = () => {
  return (
    <div style={{ 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      width: '320px',
      background: '#F0F2F5',
      color: '#333',
      margin: '20px auto',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#3F51B5',
          color: 'white',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>🧠 LeetSolveAI</h1>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: '2px 0 0 0' }}>AI-powered coding assistant</p>
          </div>
          <div style={{
            background: '#FF9800',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 500
          }}>Active</div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid #eee'
          }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Enable AI Assistance</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>Get hints and solutions for LeetCode problems</p>
            </div>
            <label style={{
              position: 'relative',
              display: 'inline-block',
              width: '44px',
              height: '24px'
            }}>
              <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#3F51B5',
                transition: '.3s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: '23px',
                  bottom: '3px',
                  background: 'white',
                  transition: '.3s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '8px',
            borderRadius: '6px',
            fontSize: '12px',
            marginBottom: '16px',
            background: '#E8F5E8',
            color: '#2E7D32'
          }}>AI assistance is enabled</div>

          <div style={{
            marginBottom: '16px',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '12px',
            background: '#E3F2FD',
            border: '1px solid #BBDEFB',
            color: '#1565C0'
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4CAF50',
              marginRight: '8px'
            }}></span>
            <strong>Problem Detected:</strong><br />
            <span style={{ fontWeight: 500, display: 'block', marginTop: '4px' }}>Two Sum</span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              background: '#FF9800',
              color: 'white'
            }}>
              Open LeetCode
            </button>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                background: '#FF9800',
                color: 'white'
              }}>
                💡 Get Hint
              </button>
              <button style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                background: '#3F51B5',
                color: 'white'
              }}>
                🔧 Get Solution
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1,
                padding: '10px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                background: '#f5f5f5',
                color: '#666'
              }}>
                GitHub
              </button>
              <button style={{
                flex: 1,
                padding: '10px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                background: '#f5f5f5',
                color: '#666'
              }}>
                Help
              </button>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #eee',
            fontSize: '11px',
            color: '#666'
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px', color: '#333' }}>How to use:</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '4px', paddingLeft: '12px', position: 'relative' }}>
                <span style={{ content: '•', color: '#FF9800', fontWeight: 'bold', position: 'absolute', left: 0 }}>•</span>
                Navigate to any LeetCode problem
              </li>
              <li style={{ marginBottom: '4px', paddingLeft: '12px', position: 'relative' }}>
                <span style={{ content: '•', color: '#FF9800', fontWeight: 'bold', position: 'absolute', left: 0 }}>•</span>
                Enable AI assistance with the toggle
              </li>
              <li style={{ marginBottom: '4px', paddingLeft: '12px', position: 'relative' }}>
                <span style={{ content: '•', color: '#FF9800', fontWeight: 'bold', position: 'absolute', left: 0 }}>•</span>
                Click "Get Hint" for guidance
              </li>
              <li style={{ marginBottom: '4px', paddingLeft: '12px', position: 'relative' }}>
                <span style={{ content: '•', color: '#FF9800', fontWeight: 'bold', position: 'absolute', left: 0 }}>•</span>
                Click "Get Solution" for full answer
              </li>
              <li style={{ marginBottom: '4px', paddingLeft: '12px', position: 'relative' }}>
                <span style={{ content: '•', color: '#FF9800', fontWeight: 'bold', position: 'absolute', left: 0 }}>•</span>
                Check the LeetCode page for results
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPreview;