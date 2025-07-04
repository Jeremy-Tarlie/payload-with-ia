'use client'

import React, { useState } from 'react'
import { useField } from '@payloadcms/ui'

const WithAIFillButton: React.FC<any> = (props) => {
  const { path } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { value, setValue } = useField<any>({ path })

  const handleClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/fill-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: [{ name: path, value: null }],
          collection: props.schemaPath.split('.')[0],
        }),
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error)
        console.error(result.raw)
        return
      }

      if (result[path] !== undefined) {
        let newValue: any = result[path]

        switch (props.field.type) {
          case 'number':
            newValue = Number(newValue)
            if (isNaN(newValue)) {
              setError('La valeur renvoyée n’est pas un nombre valide.')
              return
            }
            break
          case 'email':
          case 'text':
          case 'textarea':
          default:
            newValue = String(newValue)
        }

        setValue(newValue)
      }
    } catch (err) {
      console.error(err)
      setError('Erreur réseau ou serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-fill-container">
      <div className="input-group">
        {props.field.type !== 'textarea' ? (
          <input
            type={props.field.type}
            value={value ?? ''}
            onChange={(e) =>
              setValue(props.field.type === 'number' ? Number(e.target.value) : e.target.value)
            }
            placeholder={`Saisissez ${path}...`}
            className="field-input"
            disabled={loading}
          />
        ) : (
          <textarea
            value={value ?? ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Saisissez ${path}...`}
            className="field-input"
            disabled={loading}
          />
        )}
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`ai-button ${loading ? 'loading' : ''}`}
          title="Remplir avec l'IA"
        >
          {loading ? <div className="spinner"></div> : <span className="ai-icon">✨</span>}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <style jsx>{`
        .ai-fill-container {
          margin-bottom: 16px;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .field-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: all 0.2s ease;
          background: #ffffff;
          color: #2d3748;
        }

        .field-input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .field-input:disabled {
          background: #f7fafc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .field-input::placeholder {
          color: #a0aec0;
        }

        .ai-button {
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.2s ease;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          min-width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .ai-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
        }

        .ai-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .ai-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
        }

        .ai-button.loading {
          background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
        }

        .ai-icon {
          font-size: 18px;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-message {
          margin-top: 8px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
          border: 1px solid #fc8181;
          border-radius: 8px;
          color: #c53030;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .input-group {
            flex-direction: column;
            gap: 12px;
          }

          .field-input {
            width: 100%;
          }

          .ai-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (prefers-color-scheme: dark) {
          .field-input {
            background: #2d3748;
            border-color: #4a5568;
            color: #e2e8f0;
          }

          .field-input:focus {
            border-color: #63b3ed;
          }

          .field-input:disabled {
            background: #1a202c;
          }

          .field-input::placeholder {
            color: #718096;
          }
        }
      `}</style>
    </div>
  )
}

export default WithAIFillButton
