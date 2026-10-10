
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "Supabase environment variables are missing."
      );

      return Response.json(
        { error: "The live pulse is not configured yet." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    const { data, error } = await supabase.rpc(
      "get_pra_live_pulse"
    );

    if (error) {
      console.error("Supabase pulse error:", error);

      return Response.json(
        { error: "We couldn't load the live results." },
        { status: 500 }
      );
    }

    return Response.json(
      data || {
        total_responses: 0,
        day4: [],
        staying: [],
        destinations: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Pulse API error:", error);

    return Response.json(
      {
        error: "Something went wrong while loading the live pulse.",
      },
      { status: 500 }
    );
  }
}
