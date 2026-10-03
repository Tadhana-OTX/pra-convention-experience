"use client";

import { useEffect, useState } from "react";

const day4Options = [
  {
    id: "fun_run",
    title: "Fun Run as One",
    description:
      "Start the day moving, laughing, and crossing the finish line together.",
    icon: "🏃",
  },
  {
    id: "zumba",
    title: "Zumba at the Boulevard",
    description:
      "Bring the energy outside and dance the morning into life.",
    icon: "💃",
  },
  {
    id: "coastal_cleanup",
    title: "Coastal Cleanup + Coffee by the Bay",
    description:
      "Do something good for the coast, then slow down over coffee by the water.",
    icon: "🌊",
  },
  {
    id: "sunrise_walk",
    title: "Sunrise Walk",
    description:
      "A beautiful start with fresh air, good company, and the sea nearby.",
    icon: "🌅",
  },
];

const destinations = [
  {
    id: "iligan",
    title: "Iligan’s majestic waterfalls",
  },
  {
    id: "cagayan_de_oro",
    title: "Cagayan de Oro’s whitewaters",
  },
  {
    id: "bukidnon",
    title: "Bukidnon’s scenic mountains",
  },
  {
    id: "misamis_oriental",
    title: "Misamis Oriental’s coastline",
  },
  {
    id: "camiguin",
    title: "Camiguin’s island adventure",
  },
  {
    id: "siargao",
    title: "Siargao’s paradise vibe",
  },
  {
    id: "agusan_norte",
    title: "Agusan Norte’s dive spots",
  },
];

const extensionOptions = [
  {
    id: "yes",
    title: "Yes",
    description: "I’d love to stay longer.",
  },
  {
    id: "maybe",
    title: "Maybe",
    description: "I’m open to it.",
  },
  {
    id: "depends_on_cost",
    title: "Depends on cost",
    description: "Show me the possibilities.",
  },
  {
    id: "no",
    title: "No",
    description: "I’ll head home after the Convention.",
  },
];

const TOTAL_QUESTIONS = 4;

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
    let token = window.localStorage.getItem(
      "pra-experience-session"
    );

    if (!token) {
      token = window.crypto.randomUUID();

      window.localStorage.setItem(
        "pra-experience-session",
        token
      );
    }

    setSessionToken(token);
  }, []);

  function next() {
    setErrorMessage("");

    if (screen === 1 && !day4) {
      setErrorMessage("Choose one experience to continue.");
      return;
    }

    if (screen === 2 && !destination) {
      setErrorMessage("Choose a destination to continue.");
      return;
    }

    if (screen === 3 && !stayingLonger) {
      setErrorMessage("Choose one answer to continue.");
      return;
    }

    setScreen((current) =>
      Math.min(current + 1, TOTAL_QUESTIONS + 1)
    );
  }

  function back() {
    setErrorMessage("");

    setScreen((current) =>
      Math.max(current - 1, 0)
    );
  }

  async function submit() {
    if (!sessionToken) {
      setErrorMessage(
        "We're still preparing your response. Please try again."
      );
      return;
    }

    if (!day4 || !destination || !stayingLonger) {
      setErrorMessage(
        "Please complete your choices before submitting."
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "We couldn't save your response."
        );
      }

      window.localStorage.setItem(
        "pra-experience-submitted",
        "true"
      );

      setScreen(TOTAL_QUESTIONS + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (screen === TOTAL_QUESTIONS + 1) {
    return (
      <main className="experience-shell thank-you-shell">
        <div className="grain" />

        <section className="thank-you-card">
          <div className="brand-mark">
            PRA
          </div>

          <span className="eyebrow">
            THANK YOU
          </span>

          <h1>
            Your voice just shaped the experience.
          </h1>

          <p>
            We’ll take what you chose and turn
            the strongest ideas into a NorthMin
            experience worth remembering.
          </p>

          <div className="thank-you-line">
            YOUR PRA. YOUR EXPERIENCE.
          </div>
        </section>
      </main>
    );
  }

  const progress =
    screen === 0
      ? 0
      : Math.min(
          (screen / TOTAL_QUESTIONS) * 100,
          100
        );

  return (
    <main className="experience-shell">
      <div className="grain" />

      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-dot" />
          <span>PRA CONVENTION</span>
        </div>

        {screen > 0 && (
          <span className="step-count">
            {screen} / {TOTAL_QUESTIONS}
          </span>
        )}
      </header>

      {screen > 0 && (
        <div
          className="progress-track"
          aria-hidden="true"
        >
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}

      <div className="content-wrap">

        {/* WELCOME */}

        {screen === 0 && (
          <section className="hero-screen">
            <span className="eyebrow">
              NORTHMIN • FEB 24–27
            </span>

            <h1>
              YOUR PRA.
              <br />
              <em>YOUR EXPERIENCE.</em>
            </h1>

            <p className="hero-copy">
              The Convention gives us four days
              together. Let’s make the last one
              count — and discover what NorthMin
              could mean beyond the Convention.
            </p>

            <button
              className="primary-button"
              onClick={() => setScreen(1)}
            >
              Let me choose
              <span>→</span>
            </button>

            <p className="microcopy">
              Takes about 60 seconds • No name required
            </p>
          </section>
        )}

        {/* DAY 4 */}

        {screen === 1 && (
          <QuestionScreen
            eyebrow="DAY 4"
            title="YOU CHOOSE. WE MAKE IT HAPPEN."
            subtitle="If you could choose ONE experience for our Day 4, what would you join?"
          >
            <div className="option-grid">
              {day4Options.map((option) => (
                <button
                  key={option.id}
                  className={`experience-card ${
                    day4 === option.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setDay4(option.id)
                  }
                >
                  <span className="option-icon">
                    {option.icon}
                  </span>

                  <span className="option-content">
                    <strong>
                      {option.title}
                    </strong>

                    <small>
                      {option.description}
                    </small>
                  </span>

                  <span className="checkmark">
                    {day4 === option.id
                      ? "✓"
                      : ""}
                  </span>
                </button>
              ))}
            </div>

            <Navigation
              onBack={back}
              onNext={next}
              nextLabel="That’s my pick"
            />

            {errorMessage && (
              <p className="error-message">
                {errorMessage}
              </p>
            )}
          </QuestionScreen>
        )}

        {/* DESTINATION */}

        {screen === 2 && (
          <QuestionScreen
            eyebrow="STAY A LITTLE LONGER"
            title="THE CONVENTION ENDS. NORTHMIN DOESN’T."
            subtitle="If you’re staying a little longer, where would you love to go?"
          >
            <div className="destination-list">
              {destinations.map(
                (option, index) => (
                  <button
                    key={option.id}
                    className={`destination-card ${
                      destination === option.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setDestination(option.id)
                    }
                  >
                    <span className="destination-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <strong>
                      {option.title}
                    </strong>

                    <span className="arrow">
                      ↗
                    </span>
                  </button>
                )
              )}
            </div>

            <Navigation
              onBack={back}
              onNext={next}
              nextLabel="Next"
            />

            {errorMessage && (
              <p className="error-message">
                {errorMessage}
              </p>
            )}
          </QuestionScreen>
        )}

        {/* EXTENSION */}

        {screen === 3 && (
          <QuestionScreen
            eyebrow="ONE MORE THING"
            title="ARE YOU STAYING LONGER?"
            subtitle="Your answer helps us understand what kind of NorthMin experiences to design."
          >
            <div className="extension-grid">
              {extensionOptions.map(
                (option) => (
                  <button
                    key={option.id}
                    className={`extension-card ${
                      stayingLonger ===
                      option.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setStayingLonger(
                        option.id
                      )
                    }
                  >
                    <strong>
                      {option.title}
                    </strong>

                    <small>
                      {option.description}
                    </small>
                  </button>
                )
              )}
            </div>

            <Navigation
              onBack={back}
              onNext={next}
              nextLabel="Almost there"
            />

            {errorMessage && (
              <p className="error-message">
                {errorMessage}
              </p>
            )}
          </QuestionScreen>
        )}

        {/* COMMENT */}

        {screen === 4 && (
          <QuestionScreen
            eyebrow="OPTIONAL"
            title="WHAT WOULD MAKE IT UNFORGETTABLE?"
            subtitle="Give us one idea, detail, or little thing that would make the experience stick with you."
          >
            <textarea
              className="comment-box"
              value={comment}
              maxLength={500}
              onChange={(event) =>
                setComment(event.target.value)
              }
              placeholder="For example: great coffee, live music, something I can do with new friends…"
            />

            <div className="character-count">
              {comment.length} / 500
            </div>

            <div className="submit-area">
              <button
                className="primary-button"
                onClick={submit}
                disabled={submitting}
              >
                {submitting
                  ? "Saving your choice…"
                  : "Submit my choices →"}
              </button>

              <button
                className="back-button"
                onClick={back}
                disabled={submitting}
              >
                ← Back
              </button>
            </div>

            {errorMessage && (
              <p className="error-message">
                {errorMessage}
              </p>
            )}
          </QuestionScreen>
        )}
      </div>

      <footer className="footer">
        <span>
          Built for the PRA Convention
        </span>

        <span>
          One Tadhana
        </span>
      </footer>
    </main>
  );
}

function QuestionScreen({
  eyebrow,
  title,
  subtitle,
  children,
}) {
  return (
    <section className="question-screen">
      <div className="question-heading">
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h2>{title}</h2>

        <p>{subtitle}</p>
      </div>

      {children}
    </section>
  );
}

function Navigation({
  onBack,
  onNext,
  nextLabel,
}) {
  return (
    <div className="navigation">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back
      </button>

      <button
        className="primary-button compact"
        onClick={onNext}
      >
        {nextLabel}
        <span>→</span>
      </button>
    </div>
  );
}
