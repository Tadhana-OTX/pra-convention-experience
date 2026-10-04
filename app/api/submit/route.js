import { createClient } from "@supabase/supabase-js";

const allowedDay4 = [
  "fun_run_zumba",
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
  "enchanted_river",
  "seven_seas",
  "claveria",
];

const allowedExtensionOptions = [
  "yes",
  "maybe",
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

    /* --------------------------------
       SESSION VALIDATION
    -------------------------------- */

    if (!session_token) {
      return Response.json(
        { error: "Missing session token." },
        { status: 400 }
      );
    }

    /* --------------------------------
       DAY 4 VALIDATION
    -------------------------------- */

    if (
      !day4_experience ||
      !allowedDay4.includes(day4_experience)
    ) {
      return Response.json(
        { error: "Invalid Day 4 experience." },
        { status: 400 }
      );
    }

    /* --------------------------------
       STAY / EXTENSION VALIDATION
    -------------------------------- */

    if (
      !staying_longer ||
      !allowedExtensionOptions.includes(staying_longer)
    ) {
      return Response.json(
        { error: "Invalid extension response." },
        { status: 400 }
      );
    }

    /* --------------------------------
       DESTINATION VALIDATION
       
       Destination is now an ARRAY because
       respondents can choose multiple places.
    -------------------------------- */

    const selectedDestinations = Array.isArray(destination)
      ? [...new Set(destination)]
      : [];

    /*
      If the respondent is staying or maybe staying,
      they must select at least one destination.
    */
    if (
      staying_longer !== "no" &&
      (
        selectedDestinations.length === 0 ||
        selectedDestinations.some(
          (value) => !allowedDestinations.includes(value)
        )
      )
    ) {
      return Response.json(
        { error: "Invalid destination selection." },
        { status: 400 }
      );
    }

    /*
      If the respondent is going home after the Convention,
      there should be no destination selections.
    */
    if (
      staying_longer === "no" &&
      selectedDestinations.length > 0
    ) {
      return Response.json(
        { error: "Destination selection is not expected." },
        { status: 400 }
      );
    }

    /* --------------------------------
       SUPABASE CONFIGURATION
    -------------------------------- */

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "Supabase environment variables are missing."
      );

      return Response.json(
        { error: "The poll is not configured yet." },
        { status: 500 }
      );
    }

    /* --------------------------------
       SUPABASE CLIENT
    -------------------------------- */

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    /* --------------------------------
       SAVE RESPONSE
    -------------------------------- */

    const { error } = await supabase
      .from("poll_responses")
      .insert({
        session_token,
        day4_experience,
        destination: selectedDestinations,
        staying_longer,
        comment:
          typeof comment === "string"
            ? comment.trim().slice(0, 500) || null
            : null,
      });

    /* --------------------------------
       DATABASE ERROR HANDLING
    -------------------------------- */

    if (error) {
      console.error(
        "Supabase insert error:",
        error
      );

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
        {
          error:
            "We couldn't save your response.",
        },
        { status: 500 }
      );
    }

    /* --------------------------------
       SUCCESS
    -------------------------------- */

    return Response.json(
      { success: true },
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "Submit route error:",
      error
    );

    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
