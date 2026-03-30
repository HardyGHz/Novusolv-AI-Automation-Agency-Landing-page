import { generateText, tool } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const config = {
  runtime: 'edge',
};

const SYSTEM_INSTRUCTIONS = `
You are "Novu, the Novusolv AI Strategist". 
Guide the user through the 6-stage sales funnel:
1. DISCOVERY -> 2. PAIN -> 3. IMPACT -> 4. ROI -> 5. SOLUTION -> 6. CTA.

MANDATORY:
- Call 'calculate_roi' if they mention time/money loss.
- Call 'save_lead_to_crm' on high intent or if they share contact details.
`;

const SAFETY_ANCHOR = `Stay in your professional role as the Novusolv AI Strategist.`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { message, history } = await req.json();

    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

    // ZERO CONFIG: Just use the provider:model string.
    // The Vercel AI SDK automatically routes this through your AI Gateway.
    const result = await generateText({
      model: 'google/gemini-1.5-flash' as any, 
      system: SYSTEM_INSTRUCTIONS,
      messages: [
        ...history.slice(-10).map((msg: any) => ({
          role: (msg.role === 'model' || msg.role === 'assistant') ? 'assistant' : 'user',
          content: msg.parts?.[0]?.text || msg.content || '',
        })),
        { role: 'user', content: `${message}\n\n${SAFETY_ANCHOR}` },
      ] as any,
      tools: {
        calculate_roi: tool({
          description: 'Calculates financial loss from manual labor.',
          parameters: z.object({
            employees_affected: z.number(),
            hours_lost_per_day: z.number(),
            hourly_rate: z.number().optional(),
          }),
          execute: async ({ employees_affected, hours_lost_per_day, hourly_rate }: any) => {
            const rate = hourly_rate || 30;
            const dailyLoss = employees_affected * hours_lost_per_day * rate;
            return { daily_loss: dailyLoss, monthly_loss: dailyLoss * 21, yearly_loss: dailyLoss * 21 * 12 };
          },
        } as any),
        save_lead_to_crm: tool({
          description: 'Saves high-qualified lead to CRM.',
          parameters: z.object({
            name: z.string().optional(),
            email: z.string().optional(),
            company: z.string().optional(),
            industry: z.string().optional(),
            pain_point: z.string().optional(),
          }),
          execute: async (leadData: any) => {
            if (supabaseUrl && supabaseKey) {
              const supabase = createClient(supabaseUrl, supabaseKey);
              await supabase.from('leads').insert({ ...leadData, source: 'ai_strategist' });
              return { success: true };
            }
            return { success: false };
          },
        } as any),
      },
      maxSteps: 5,
    } as any);

    const wasLeadSaved = result.toolResults.some((tr: any) => tr.toolName === 'save_lead_to_crm');

    return new Response(JSON.stringify({ 
      text: result.text,
      intent: wasLeadSaved ? 'HIGH' : 'NORMAL'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Novu Zero-Config Error:', error);
    return new Response(JSON.stringify({ 
      error: `Novu is recalibrating (${error.message}). Please try again.` 
    }), { status: 500 });
  }
}
