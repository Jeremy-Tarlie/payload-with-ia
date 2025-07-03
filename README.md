# Payload with IA (Next.js + PayloadCMS)

Ce projet combine [PayloadCMS](https://payloadcms.com/) et [Next.js] pour offrir une interface d'admin moderne avec un bouton d'auto-remplissage IA pour les collections.

## Fonctionnalités principales
- **Admin Payload** intégré à Next.js
- **Bouton "Remplir avec AI"** dans les collections (Articles, Media, etc.)
- Remplissage automatique des champs vides via une API IA

---

## Installation

1. **Cloner le repo**

```bash
pnpm install
```

2. **Configurer l'environnement**

Copiez le fichier `.env.example` ou `test.env` en `.env` et adaptez les variables si besoin (API IA, etc).

3. **Lancer le projet**

```bash
pnpm dev
```

L'admin Payload est accessible sur `/admin`.

---

## Utilisation du bouton IA

- Dans l'admin, ouvrez une collection (ex: Articles, Media).
- Cliquez sur le bouton **Remplir avec AI** dans la barre latérale.
- Seuls les champs vides seront envoyés à l'API IA pour être complétés automatiquement.

---

## Structure du projet

- `src/collections/components/FillFieldsButtonClient.tsx` : Composant client React, gère la logique d'auto-remplissage.
- `src/collections/components/FillFieldsButton.tsx` : Wrapper pour Payload, importe le composant client.
- `src/app/(payload)/admin/importMap.js` : Mappe le composant pour l'admin Payload.
- `src/app/(payload)/api/fill-fields/route.ts` : Endpoint API pour l'IA (à adapter selon votre backend IA).

---

## Personnalisation

- Pour ajouter le bouton à une autre collection, ajoutez dans le tableau `fields` :

```js
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
```

---

## Dépendances principales
- PayloadCMS
- Next.js
- React
- pnpm

---

## Aide

Pour toute question, ouvrez une issue ou contactez le mainteneur du projet.
