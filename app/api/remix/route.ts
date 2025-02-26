import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
): Promise<NextResponse<{ result: string } | { error: string; details?: string }>> {
  try {
    // Log the start of the request
    console.log('Starting API request processing...');

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY?.trim();
    
    // Log API key details (safely)
    console.log('API key status:', {
      exists: !!apiKey,
      length: apiKey?.length,
      startsWithSk: apiKey?.startsWith('sk-'),
      hasTrailingSpace: apiKey !== apiKey?.trim()
    });

    if (!apiKey) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add your API key to .env.local' },
        { status: 500 }
      );
    }

    if (!apiKey.startsWith('sk-')) {
      console.error('Invalid API key format');
      return NextResponse.json(
        { error: 'Invalid API key format. OpenAI API keys should start with "sk-"' },
        { status: 500 }
      );
    }

    const { text } = await req.json();
    console.log('Received text input:', text ? 'Text provided' : 'No text provided');

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('Making OpenAI API request...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative content remixer. Take the user's input and create an engaging, unique variation while maintaining the core message."
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    console.log('OpenAI API request successful');
    const result = completion.choices[0]?.message?.content || 'No response generated';
    return NextResponse.json({ result });
  } catch (error: any) {
    // Enhanced error logging
    console.error('Detailed error information:', {
      message: error.message,
      name: error.name,
      status: error.status,
      stack: error.stack,
      type: error.type,
      response: error.response?.data,
    });

    let errorMessage = 'Failed to remix content';
    let statusCode = 500;

    if (error.message.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your OpenAI API key configuration.';
      statusCode = 401;
    } else if (error.message.includes('Rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
} 