// components/FillFieldsButtonClient.tsx
'use client'

import React from 'react'
import { useForm, useAllFormFields } from '@payloadcms/ui'

const FillFieldsButtonClient: React.FC = () => {
  const { getData } = useForm()
  const [, dispatchFields] = useAllFormFields()

  const handleClick = async () => {
    const data = getData()
    // On ne garde que les champs vides (null, undefined ou string vide)
    const emptyFields = Object.entries(data)
      .filter(([, value]) => value === '' || value === null || value === undefined)
      .map(([key, value]) => ({
        name: key,
        value,
      }))

    const response = await fetch('/api/fill-fields', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: emptyFields,
      }),
    })

    const result = await response.json()

    if (result.error) {
      alert('Erreur : ' + result.error)
      console.error(result.raw)
      return
    }

    Object.entries(result).forEach(([key, value]) => {
      dispatchFields({
        type: 'UPDATE',
        path: key,
        value,
      })
    })
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        type="button"
        onClick={handleClick}
        style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '10px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Remplir avec AI
      </button>
    </div>
  )
}

export default FillFieldsButtonClient
