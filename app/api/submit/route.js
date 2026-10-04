import { createClient } from "@supabase/supabase-js";

const allowedDay4 = [
  "fun_run",
  "zumba",
  "coastal_cleanup",
  "sunrise_walk",
];

const allowedDestinations = [
  "iligan",
  "cagayan_de_oro",
  "bukidnon",
  "misamis_oriental",
  "camiguin",
  "siargao",
  "agusan_norte",
];

const allowedExtensionOptions = [
  "yes",
  "maybe",
  "depends_on_cost",
  "no",
];

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      session_token,
      day4_experience,
      destination,
      staying_longer,
      comment,
    } = body;

    if (!session_token) {
      return Response.json(
        { error: "Missing session token." },
        { status: 400 }
      );
    }

    if (!day4_experience || !allowedDay4.includes(day4_experience)) {
      return Response.json(
        { error: "Invalid Day 4 experience." },
        { status: 400 }
      );
    }

    if (
      !destination ||
      !allowedDestinations.includes(destination)
    ) {
      return Response.json(
        { error: "Invalid destination." },
        { status: 400 }
      );
    }

    if (
      !staying_longer ||
      !allowedExtensionOptions.includes(staying_longer)
    ) {
      return Response.json(
        { error: "Invalid extension response." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables are missing.");

      return Response.json(
        { error: "The poll is not configured yet." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    const { error } = await supabase
      .from("poll_responses")
      .insert({
        session_token,
        day4_experience,
        destination,
        staying_longer,
        comment:
          typeof comment === "string"
            ? comment.trim().slice(0, 500) || null
            : null,
      });

    if (error) {
      console.error("Supabase insert error:", error);

      if (error.code === "23505") {
        return Response.json(
          {
            error:
              "This response has already been submitted from this device.",
          },
          { status: 409 }
        );
      }

      return Response.json(
        { error: "We couldn't save your response." },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit route error:", error);

    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
