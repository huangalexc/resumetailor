import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  buildTailoringPrompt,
  validateTailoringResponse,
} from '@/lib/prompts/tailoringPrompt'
import { ResumeData } from '@/lib/types/resume'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface TailorRequest {
  resume: ResumeData
  jobDescription: string
  companyName?: string
  roleTitle?: string
}

export interface TailorResponse {
  success: boolean
  data?: {
    summary: string
    experience: Array<{
      title: string
      company: string
      startDate: string
      endDate: string
      location?: string
      bullets: string[]
    }>
    skills: string[]
    matchScore: number
    keyChanges: string[]
    atsKeywords: string[]
  }
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body: TailorRequest = await request.json()
    const { resume, jobDescription, companyName, roleTitle } = body

    // Validate inputs
    if (!resume || !jobDescription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: resume and jobDescription',
        } as TailorResponse,
        { status: 400 }
      )
    }

    if (jobDescription.length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description must be at least 100 characters',
        } as TailorResponse,
        { status: 400 }
      )
    }

    // Build the tailoring prompt
    const prompt = buildTailoringPrompt({
      resume,
      jobDescription,
      companyName,
      roleTitle,
    })

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume writer and ATS optimization specialist. You provide responses in valid JSON format only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    })

    // Extract and parse response
    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const tailoredData = JSON.parse(responseText)

    // Validate response structure
    if (!validateTailoringResponse(tailoredData)) {
      throw new Error('Invalid response format from AI')
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: tailoredData,
    } as TailorResponse)
  } catch (error) {
    console.error('Error in /api/tailor:', error)

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI response. Please try again.',
        } as TailorResponse,
        { status: 500 }
      )
    }

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          success: false,
          error: `OpenAI API error: ${error.message}`,
        } as TailorResponse,
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      } as TailorResponse,
      { status: 500 }
    )
  }
}
