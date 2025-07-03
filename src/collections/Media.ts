import type { CollectionConfig } from 'payload'
import FillFieldsButton from './components/FillFieldsButton'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'ai-fill-button',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: FillFieldsButton as any,
        },
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
