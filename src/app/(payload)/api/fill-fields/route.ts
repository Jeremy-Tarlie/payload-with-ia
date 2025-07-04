import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { fields, collection } = await request.json()

    const prompt = `
    Tu es un assistant qui génère des valeurs intelligentes pour remplir des champs dans une base de données.
    
    Contexte :
    - J'ai une collection dans Payload CMS qui s'appelle "${collection}".
    - Elle contient les champs suivants : ${fields.map((f: any) => f.name).join(', ')}.
    - Un seul de ces champs est vide et a besoin d'une valeur générée : "${fields[0]?.name}".
    
    Instruction :
    Génère une valeur pertinente pour ce champ "${fields[0]?.name}" en fonction de son nom. Retourne uniquement un objet JSON valide au format suivant :
    
    {
      "${fields[0]?.name}": "ta valeur générée ici"
    }
    
    ⚠️ Ne retourne rien d'autre que cet objet JSON.
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
