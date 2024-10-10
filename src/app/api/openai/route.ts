import { NextResponse } from "next/server";
import OpenAI from "openai";

type Message = {
    role: "system" | "user" | "assistant";
    content: string;
};

export async function POST(req: Request): Promise<NextResponse> {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
    });

    // grab user input and drone data
    const { input, droneData }: 
    { input: string; droneData: any } = await req.json();

    // instructions for system
    const systemContent = `
    You are a drone data analyst. The user will ask questions specifically about the provided drone data. 
    You have access to the following drone data: ${JSON.stringify(droneData)}. 
    Ensure your responses are limited to this dataset and provide clear and concise information based on the user's query.
    If you're going to reference an image, reference it by its ID.
    `;

    // append sys message and user input
    const messages: Message[] = [
        { role: "system", content: systemContent }, 
        { role: "user", content: input },
    ];

    // api call to generate response
    const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-4o-mini",
        temperature: 0.5,
        max_tokens: 100,
    });

    const responseContent = completion.choices[0].message.content;

    // return bot response
    return NextResponse.json({
        response: responseContent ?? "", 
    });
}
