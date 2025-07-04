import type { CollectionConfig, Field } from 'payload'
import WithAIFillButton from './WithAIFillButton'

const targetFieldTypes = ['text', 'email', 'number', 'textarea']

const isTargetSimpleField = (field: Field): boolean => {
  return typeof field === 'object' && 'type' in field && targetFieldTypes.includes(field.type)
}

const enhanceField = (field: Field): Field => {
  if (isTargetSimpleField(field)) {
    const existingAdmin = field.admin || {}

    const newAdmin = {
      ...existingAdmin,
      components: {
        ...(existingAdmin.components || {}),
        Field: WithAIFillButton as any,
      },
    }

    return {
      ...field,
      admin: newAdmin as any,
    }
  }

  if ('fields' in field && Array.isArray(field.fields)) {
    return {
      ...field,
      fields: field.fields.map(enhanceField),
    }
  }

  return field
}

export function injectAIFillButton(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    fields: collection.fields.map(enhanceField),
  }
}
