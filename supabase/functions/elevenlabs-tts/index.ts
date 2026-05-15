const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId, voiceSettings } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'ElevenLabs not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prophet Gad voice — falls back to a public deep male voice (Daniel)
    // if the cloned voice isn't available in this ElevenLabs account.
    const FALLBACK_VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'; // Daniel
    const selectedVoiceId = voiceId || FALLBACK_VOICE_ID;

    // Default voice settings, can be overridden per request
    const defaultSettings = {
      stability: 0.75,
      similarity_boost: 0.95,
      style: 0.4,
      use_speaker_boost: true,
      speed: 0.9,
    };

    const mergedSettings = voiceSettings ? { ...defaultSettings, ...voiceSettings } : defaultSettings;

    console.log('Generating TTS for:', text.substring(0, 50) + '...');

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: mergedSettings,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `ElevenLabs API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('TTS generated successfully, size:', audioBuffer.byteLength);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating TTS:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate speech';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
