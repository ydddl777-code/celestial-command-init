const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HUME_API_KEY = Deno.env.get('HUME_API_KEY');
    const HUME_SECRET_KEY = Deno.env.get('HUME_SECRET_KEY');

    if (!HUME_API_KEY || !HUME_SECRET_KEY) {
      console.error('Hume keys not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Hume not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hume uses HTTP Basic auth (api_key:secret_key) on the OAuth2 client_credentials endpoint
    const basic = btoa(`${HUME_API_KEY}:${HUME_SECRET_KEY}`);

    const response = await fetch('https://api.hume.ai/oauth2-cc/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hume token error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `Hume token error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Hume token issued, expires_in:', data.expires_in);

    return new Response(
      JSON.stringify({
        success: true,
        accessToken: data.access_token,
        expiresIn: data.expires_in,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error issuing Hume token:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get token';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
