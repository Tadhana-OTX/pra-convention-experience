"use client";

import { useEffect, useState } from "react";

const day4Options = [
  {
    value: "fun_run_zumba",
    title: "Fun Run + Zumba",
    description:
      "Start the day moving together, then cool down with a short, fun Zumba session.",
  },
  {
    value: "coastal_cleanup",
    title: "Coastal Cleanup & Coffee by the Bay",
    description: "Give back to the coast, then slow down over coffee.",
  },
  {
    value: "sunrise_walk",
    title: "Sunrise Walk",
    description: "A quiet start to the day with the Northmin sunrise.",
  },
];
const destinations = [
  {
    value: "iligan",
    title: "Iligan's Majestic Waterfalls",
    description: "Chase waterfalls and discover the City of Majestic Falls.",
    travel: "~90 km from CdeO • ~1.5–2.5 hrs by car",
  },
  {
    value: "cagayan_de_oro",
    title: "Cagayan de Oro's Whitewaters",
    description: "Raft, splash, and experience the City of Golden Friendship.",
    travel: "Within/near CdeO • ~30–60 min by car",
  },
  {
    value: "bukidnon",
    title: "Bukidnon's Scenic Mountains",
    description: "Cool air, mountain views, and wide-open landscapes.",
    travel: "~130 km to Dahilayan • ~2 hrs by car",
  },
  {
    value: "misamis_oriental",
    title: "Misamis Oriental's Coastline",
    description: "Discover beaches, bays, and coastal escapes.",
    travel: "Varies by site • ~1–2.5 hrs by car",
  },
  {
    value: "camiguin",
    title: "Camiguin's Island Adventure",
    description: "Volcanoes, waterfalls, springs, and island life.",
    travel: "~2 hrs to Balingoan + ferry",
  },
  {
    value: "siargao",
    title: "Siargao's Paradise Vibe",
    description: "Slow down, explore, and soak up island energy.",
    travel: "~6–8 hrs+ including road travel & ferry",
  },
  {
    value: "agusan_norte",
    title: "Agusan Norte's Dive Spots",
    description: "Go beneath the surface and discover underwater treasures.",
    travel: "Varies by site • ~2–4 hrs by car",
  },
  {
    value: "enchanted_river",
    title: "Enchanted River",
    subtitle: "Hinatuan, Surigao del Sur",
    description:
      "Crystal-clear waters and one of Mindanao's iconic inland escapes.",
    travel: "~300 km from CdeO • ~5 hrs by car",
  },
  {
    value: "seven_seas",
    title: "Seven Seas Waterpark",
    subtitle: "Opol, Misamis Oriental",
    description:
      "Slides, waves, and a high-energy day just outside CdeO.",
    travel: "~10–15 km from CdeO • ~15–30 min by car",
  },
  {
    value: "claveria",
    title: "Claveria",
    subtitle: "Misamis Oriental",
    description:
      "Cooler air, scenic countryside, and a slower Northern Mindanao escape.",
    travel: "~42 km from CdeO • ~45–60 min by car",
  },
];
const extensionOptions = [
  {
    value: "yes",
    title: "Yes!",
    description: "I'm definitely staying longer.",
  },
  {
    value: "maybe",
    title: "Maybe",
    description: "I'm open to extending my trip.",
  },
  {
    value: "depends_on_cost",
    title: "Depends on the cost",
    description: "Show me the options first.",
  },
  {
    value: "no",
    title: "No",
    description: "I'll be heading home after the Convention.",
  },
];

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [day4, setDay4] = useState("");
  const [destination, setDestination] = useState("");
  const [stayingLonger, setStayingLonger] = useState("");
  const [comment, setComment] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("pra_poll_session");

    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem("pra_poll_session", token);
    }

    setSessionToken(token);
  }, []);

  const totalQuestions = 4;

  const progress =
    screen === 0
      ? 0
      : screen >= 5
        ? 100
        : ((screen - 1) / totalQuestions) * 100;

  const goNext = () => {
    setErrorMessage("");

    if (screen === 1 && !day4) {
      setErrorMessage("Please choose one experience.");
      return;
    }

    if (screen === 2 && !destination) {
      setErrorMessage("Please choose a destination.");
      return;
    }

    if (screen === 3 && !stayingLonger) {
      setErrorMessage("Please choose an answer.");
      return;
    }

    setScreen((current) => current + 1);
  };

  const goBack = () => {
    setErrorMessage("");
    setScreen((current) => Math.max(0, current - 1));
  };

  const submitResponse = async () => {
    setErrorMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_token: sessionToken,
          day4_experience: day4,
          destination,
          staying_longer: stayingLonger,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setScreen(5);
    } catch (error) {
      setErrorMessage(
        error.message || "We couldn't save your response. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderOptions = (options, selectedValue, setValue) => (
    <div className="options">
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          className={`option-card ${
            selectedValue === option.value ? "selected" : ""
          }`}
          onClick={() => setValue(option.value)}
        >
          <span className="option-number">{index + 1}</span>

          <span className="option-arrow">
            {selectedValue === option.value ? "✓" : "→"}
          </span>

          <span className="option-title">{option.title}</span>

          <span className="option-description">
            {option.description}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <main className="app-shell">
      <div className="top-wave" />

      <div className="poll-container">

        {/* PRA EVENT HEADER */}
        <header className="brand-header">
          <div className="brand-logos">
            <img
              src="/PRA_edited.png-3.avif"
              alt="Philippine Rheumatology Association"
              className="pra-logo"
            />
          </div>

          <div className="event-label">
            PRA 33rd Annual Meeting
            <span>February 24–27, 2027 • Cagayan de Oro</span>
          </div>
        </header>

        {screen > 0 && screen < 5 && (
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Your PRA Experience</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* WELCOME */}
        {screen === 0 && (
          <section className="screen welcome-card">

         <div className="poster-kicker">
  <strong>Back to CdeO</strong>
  <span>Northern Mindanao</span>
</div>
            <p className="eyebrow">
              PRA 33rd Annual Meeting
            </p>

            <h1 className="hero-title">
              YOUR PRA.
              <br />
              <span>YOUR EXPERIENCE.</span>
            </h1>

            <p className="hero-copy">
              The Convention is more than a program.
              <br />
              It is a shared experience — and
              <strong> you help shape it.</strong>
            </p>

            <div className="experience-banner">
              <span>YOU CHOOSE.</span>
              <strong>WE MAKE IT HAPPEN.</strong>
            </div>

            <div className="welcome-meta">
              <span className="meta-pill">60 seconds</span>
              <span className="meta-pill">4 quick questions</span>
            </div>

            <div className="actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => setScreen(1)}
              >
                LET'S GO →
              </button>
            </div>

          </section>
        )}

        {/* DAY 4 */}
        {screen === 1 && (
          <section className="screen">

            <p className="eyebrow">DAY 4</p>

            <h1 className="question-title">
              YOU CHOOSE.
              <br />
              <span>WE MAKE IT HAPPEN.</span>
            </h1>

            <p className="question-copy">
              If you could choose ONE experience for our Day 4,
              what would you join?
            </p>

            {renderOptions(day4Options, day4, setDay4)}

            <div className="actions">
              <button
                type="button"
                className="secondary-button"
                onClick={goBack}
              >
                ← Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={goNext}
                disabled={!day4}
              >
                CONTINUE →
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

          </section>
        )}

        {/* DESTINATION */}
        {screen === 2 && (
          <section className="screen">

            <p className="eyebrow">POST-CONVENTION</p>

            <h1 className="question-title">
              THE CONVENTION ENDS.
              <br />
              <span>NORTHMIN DOESN'T.</span>
            </h1>

            <p className="question-copy">
              If you're staying a little longer,
              where would you love to go?
            </p>

            {renderOptions(
              destinations,
              destination,
              setDestination
            )}

            <div className="actions">
              <button
                type="button"
                className="secondary-button"
                onClick={goBack}
              >
                ← Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={goNext}
                disabled={!destination}
              >
                CONTINUE →
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

          </section>
        )}

        {/* STAYING LONGER */}
        {screen === 3 && (
          <section className="screen">

            <p className="eyebrow">ONE MORE THING</p>

            <h1 className="question-title">
              ARE YOU STAYING
              <br />
              <span>A LITTLE LONGER?</span>
            </h1>

            <p className="question-copy">
              Would you consider extending your trip
              after the Convention?
            </p>

            {renderOptions(
              extensionOptions,
              stayingLonger,
              setStayingLonger
            )}

            <div className="actions">
              <button
                type="button"
                className="secondary-button"
                onClick={goBack}
              >
                ← Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={goNext}
                disabled={!stayingLonger}
              >
                CONTINUE →
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

          </section>
        )}

        {/* OPTIONAL COMMENT */}
        {screen === 4 && (
          <section className="screen">

            <p className="eyebrow">ALMOST THERE</p>

            <h1 className="question-title">
              WHAT WOULD MAKE
              <br />
              <span>IT UNFORGETTABLE?</span>
            </h1>

            <p className="question-copy">
              Tell us anything you'd love to see,
              experience, eat, discover, or remember.
            </p>

            <textarea
              className="textarea"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Your idea..."
              maxLength={500}
            />

            <p className="optional-note">
              Optional · {comment.length}/500
            </p>

            <div className="actions">
              <button
                type="button"
                className="secondary-button"
                onClick={goBack}
                disabled={submitting}
              >
                ← Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={submitResponse}
                disabled={submitting}
              >
                {submitting ? "SAVING..." : "SUBMIT MY CHOICES →"}
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

          </section>
        )}

        {/* THANK YOU */}
        {screen === 5 && (
          <section className="screen thank-you">

            <div className="checkmark">✓</div>

            <p className="eyebrow">YOU'RE IN</p>

            <h1>
              THANK
              <br />
              <span>YOU!</span>
            </h1>

            <p>
              Your choices have been recorded.
              <br />
              Now let's see what Northmin wants
              to experience together.
            </p>

            <div className="thank-you-line">
              YOUR PRA. YOUR EXPERIENCE.
            </div>

          </section>
        )}

       {/* ONE TADHANA ATTRIBUTION - PRA EXPERIENCE PARTNER */}
     <footer className="footer">
  <strong>An Experience Initiative by One Tadhana Inc.</strong>

  <span>
    The events logistics management and experience partner of PRA 33rd Annual Meeting
  </span>

  <a
    href="https://www.tadhanasolutions.com"
    target="_blank"
    rel="noreferrer"
  >
    www.tadhanasolutions.com
  </a>
</footer>

      </div>
    </main>
  );
}
