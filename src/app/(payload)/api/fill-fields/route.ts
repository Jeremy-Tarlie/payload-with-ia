import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { fields } = await request.json()

    const prompt = `
Voici la liste des champs : ${fields.map((f: any) => f.name).join(', ')}.
Je veux que tu me crées un objet JSON de test avec ces champs remplis intelligemment.
Format :
{
  "champ1": "valeur",
  "champ2": "valeur"
}
Ne retourne que l'objet JSON, sans explication.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.choices[0].message.content

    try {
      const json = JSON.parse(content || '{}')
      return NextResponse.json(json)
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON returned by OpenAI', raw: content },
        { status: 500 },
      )
    }
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
