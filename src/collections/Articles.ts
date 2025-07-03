import type { CollectionConfig } from 'payload'
import FillFieldsButton from './components/FillFieldsButtonClient'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'name',
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
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
