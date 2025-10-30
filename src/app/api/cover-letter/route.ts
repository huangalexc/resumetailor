import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  buildCoverLetterPrompt,
  validateCoverLetterResponse,
} from '@/lib/prompts/tailoringPrompt'
import { ResumeData } from '@/lib/types/resume'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface CoverLetterRequest {
  resume: ResumeData
  jobDescription: string
  companyName?: string
  roleTitle?: string
}

export interface CoverLetterResponse {
  success: boolean
  data?: {
    coverLetter: string
    tone: string
    keyPoints: string[]
  }
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body: CoverLetterRequest = await request.json()
    const { resume, jobDescription, companyName, roleTitle } = body

    // Validate inputs
    if (!resume || !jobDescription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: resume and jobDescription',
        } as CoverLetterResponse,
        { status: 400 }
      )
    }

    // Build the cover letter prompt
    const prompt = buildCoverLetterPrompt({
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
            'You are an expert cover letter writer specializing in professional job applications. You provide responses in valid JSON format only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    })

    // Extract and parse response
    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const coverLetterData = JSON.parse(responseText)

    // Validate response structure
    if (!validateCoverLetterResponse(coverLetterData)) {
      throw new Error('Invalid cover letter format from AI')
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: coverLetterData,
    } as CoverLetterResponse)
  } catch (error) {
    console.error('Error in /api/cover-letter:', error)

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI response. Please try again.',
        } as CoverLetterResponse,
        { status: 500 }
      )
    }

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          success: false,
          error: `OpenAI API error: ${error.message}`,
        } as CoverLetterResponse,
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      } as CoverLetterResponse,
      { status: 500 }
    )
  }
}
