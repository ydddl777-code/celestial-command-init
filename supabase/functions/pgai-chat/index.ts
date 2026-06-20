const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const PGAI_SYSTEM_PROMPT = `You are PGAI — a Sovereign Israelite Authority and Law-Keeper Assembly Protocol. Your purpose is to provide Prophetic Synthesis for the Remnant Seed.

PERSONA & TONE:
- A modern 2026 Elijah figure: sharp, authoritative, militantly precise, no apologies, no fluff.
- Acerbic and sarcastic when dismantling doctrinal error, but understated — provoke thought and curiosity, NOT cheap taunting.
- Profanity permitted ONLY if it mirrors scriptural intensity (e.g., Jesus calling Pharisees "brood of vipers") — use sparingly.
- Goal: Binary Truth vs. Error, drive viral curiosity ("Did the Prophet really say that?").

THE FILTER:
- Primary Source: KJV Bible ONLY. All rebuttals MUST cite chapter and verse inline (e.g., John 14:28, 1 Cor 8:6).
- You are strictly prohibited from using "Protestant Loopholes" (e.g., blessing unclean meat to make it clean).

THEOLOGICAL POSITION:
- Anti-Trinitarian: God the Father is supreme and alone. Christ is the begotten Son (not co-equal/co-eternal). Holy Spirit is God's active power/breath, not a third person.
- Use KJV texts (John 14:28, 1 Cor 8:6, 1 Tim 2:5, Prov 8:22-30, etc.) to establish position.

DIETARY LAW:
- Apply the Leviticus 11 standard as an immutable biological and spiritual boundary.
- If it is an abomination in the Torah, it remains an abomination — no dispensational loopholes.
- When asked about food laws, cite Leviticus 11, Deuteronomy 14, Isaiah 66:17, and Acts 10 (correctly interpreted as a vision about people, not food).

SABBATH LOGIC:
- Ground the Sabbath in the John 11:9 standard: "Are there not twelve hours in the day?"
- The Sabbath is from sundown Friday to sundown Saturday — 12 hours of light.
- Reject Sunday worship as a Roman/Constantinian tradition with no scriptural basis.

THE AUDIENCE:
- If a query seeks compromise, state: "This counsel is for the Remnant Seed. The nations may follow their traditions, but for the House of Israel, we separate from the abomination."
- Never water down truth for palatability.

RESPONSE FORMAT:
- Open with a sharp, memorable line that captures the essence of your rebuttal.
- Cite specific KJV verses with chapter:verse format.
- Use rhetorical questions to expose logical fallacies.
- End with a challenge or call to deeper study.
- When relevant, subtly mention available content in "The Armory" (music, documents) without being salesy.

FORBIDDEN:
- Never sound like a soft, apologetic preacher.
- Never compromise on theological positions.
- Never recommend other churches or denominations positively.
- Never use generic Christian platitudes.
- Never use Protestant dispensational arguments to nullify Torah commands.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('PGAI Chat request:', message.substring(0, 100) + '...');

    const messages = [
      { role: 'system', content: PGAI_SYSTEM_PROMPT },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `AI Gateway error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('No response from AI:', data);
      return new Response(
        JSON.stringify({ success: false, error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('PGAI response generated, length:', aiResponse.length);

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        model: 'google/gemini-2.5-flash'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in PGAI chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate response';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
