
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

const allowedStayOptions = ["yes", "maybe", "no"];

const allowedSidequestDecisions = [
  "think_about_it",
  "might_stay",
  "cannot_stay",
];

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      session_token,
      day4_experience,
      destination,
      staying_longer,
      initial_staying_longer,
      sidequest_decision,
      comment,
    } = body;

    if (!session_token) {
      return Response.json(
        { error: "Missing session token." },
        { status: 400 }
      );
    }

    if (!allowedDay4.includes(day4_experience)) {
      return Response.json(
        { error: "Invalid Day 4 experience." },
        { status: 400 }
      );
    }

    if (!allowedStayOptions.includes(staying_longer)) {
      return Response.json(
        { error: "Invalid extension response." },
        { status: 400 }
      );
    }

    const initialStay = initial_staying_longer || staying_longer;

    if (!allowedStayOptions.includes(initialStay)) {
      return Response.json(
        { error: "Invalid initial extension response." },
        { status: 400 }
      );
    }

    // A participant who initially says No must answer
    // the side-quest follow-up before submitting.
    if (initialStay === "no") {
      if (
        !allowedSidequestDecisions.includes(sidequest_decision)
      ) {
        return Response.json(
          { error: "Please complete the side-quest question." },
          { status: 400 }
        );
      }

      if (
        sidequest_decision === "cannot_stay" &&
        staying_longer !== "no"
      ) {
        return Response.json(
          { error: "Please confirm your final stay response." },
          { status: 400 }
        );
      }

      if (
        sidequest_decision !== "cannot_stay" &&
        staying_longer !== "maybe"
      ) {
        return Response.json(
          { error: "Please record your reconsidered response." },
          { status: 400 }
        );
      }
    } else if (sidequest_decision) {
      return Response.json(
        { error: "Unexpected side-quest response." },
        { status: 400 }
      );
    }

    const selectedDestinations = Array.isArray(destination)
      ? [...new Set(destination)]
      : [];

    if (
      selectedDestinations.some(
        (value) => !allowedDestinations.includes(value)
      )
    ) {
      return Response.json(
        { error: "Invalid destination selection." },
        { status: 400 }
      );
    }

    if (
      staying_longer !== "no" &&
      selectedDestinations.length === 0
    ) {
      return Response.json(
        { error: "Please choose at least one destination." },
        { status: 400 }
      );
    }

    if (
      staying_longer === "no" &&
      selectedDestinations.length > 0
    ) {
      return Response.json(
        { error: "Destination selection is not expected." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

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
        destination: selectedDestinations,
        staying_longer,
        initial_staying_longer: initialStay,
        sidequest_decision:
          initialStay === "no" ? sidequest_decision : null,
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
