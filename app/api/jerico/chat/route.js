import { NextResponse } from 'next/server';

// This is a deliberate stub pending the real backend (Cloudflare-fronted LLM service)
// Whoever wires up the real integration later will know exactly what to replace and why this exists.
export async function POST(request) {
  const { message } = await request.json();
  
  return NextResponse.json({ 
    reply: "Thanks for your message! Jerico's full AI backend isn't connected yet -- check back soon, or contact us directly in the meantime."
  });
}