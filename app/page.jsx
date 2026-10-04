"use client";

import { useEffect, useState } from "react";

const day4Options = [
  {
    value: "fun_run",
    title: "Fun Run as One",
    description: "Start the day moving, laughing, and running together.",
  },
  {
    value: "zumba",
    title: "Zumba at the Boulevard",
    description: "Music, movement, energy, and a whole lot of fun.",
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
  },
  {
    value: "cagayan_de_oro",
    title: "Cagayan de Oro's Whitewaters",
    description: "Raft, splash, and experience the City of Golden Friendship.",
  },
  {
    value: "bukidnon",
    title: "Bukidnon's Scenic Mountains",
    description: "Cool air, mountain views, and wide-open landscapes.",
  },
  {
    value: "misamis_oriental",
    title: "Misamis Oriental's Coastline",
    description: "Discover beaches, bays, and coastal escapes.",
  },
  {
    value: "camiguin",
    title: "Camiguin's Island Adventure",
    description: "Volcanoes, waterfalls, springs, and island life.",
  },
  {
    value: "siargao",
    title: "Siargao's Paradise Vibe",
    description: "Slow down, explore, and soak up island energy.",
  },
  {
    value: "agusan_norte",
    title: "Agusan Norte's Dive Spots",
    description: "Go beneath the surface and discover underwater treasures.",
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
      <div className="poll-container">
        <header className="brand-header">
          <div className="brand-mark">PRA Convention</div>
          <div className="brand-submark">Northmin</div>
        </header>

        {screen > 0 && screen < 5 && (
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Your Experience</span>
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

        {screen === 0 && (
          <section className="screen welcome-card">
            <p className="eyebrow">PRA Convention • Northmin</p>

            <h1 className="hero-title">
              YOUR PRA.
              <br />
              <span>YOUR EXPERIENCE.</span>
            </h1>

            <p className="hero-copy">
              The Convention is more than a program. It is a shared
              experience — and we want you to help shape it.
            </p>

            <div className="welcome-meta">
              <span className="meta-pill">60 seconds</span>
              <span className="meta-pill">4 quick questions</span>
              <span className="meta-pill">You choose. We make it happen.</span>
            </div>

            <div className="actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => setScreen(1)}
              >
                Let's Go →
              </button>
            </div>
          </section>
        )}

        {screen === 1 && (
          <section className="screen">
            <p className="eyebrow">Day 4</p>

            <h1 className="question-title">
              YOU CHOOSE.
              <br />
              WE MAKE IT HAPPEN.
            </h1>

            <p className="question-copy">
              If you could choose ONE experience for our Day 4, what would
              you join?
            </p>

            {renderOptions(day4Options, day4, setDay4)}

            <div className="actions">
              <button
                type="button"
                className="secondary-button"
                onClick={goBack}
              >
                Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={goNext}
                disabled={!day4}
              >
                Continue →
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </section>
        )}

        {screen === 2 && (
          <section className="screen">
            <p className="eyebrow">Post-Convention</p>

            <h1 className="question-title">
              THE CONVENTION ENDS.
              <br />
              NORTHMIN DOESN'T.
            </h1>

            <p className="question-copy">
              If you're staying a little longer, where would you love to
              go?
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
                Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={goNext}
                disabled={!destination}
              >
                Continue →
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </section>
        )}

        {screen === 3 && (
          <section className="screen">
            <p className="eyebrow">One More Thing</p>

            <h1 className="question-title">
              ARE YOU STAYING
              <br />
              A LITTLE LONGER?
            </h1>

            <p className="question-copy">
              Would you consider extending your trip after the Convention?
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
                Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={goNext}
                disabled={!stayingLonger}
              >
                Continue →
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </section>
        )}

        {screen === 4 && (
          <section className="screen">
            <p className="eyebrow">Almost There</p>

            <h1 className="question-title">
              WHAT WOULD MAKE
              <br />
              IT UNFORGETTABLE?
            </h1>

            <p className="question-copy">
              Tell us anything you'd love to see, experience, eat, discover,
              or remember.
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
                Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={submitResponse}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Submit My Choices →"}
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </section>
        )}

        {screen === 5 && (
          <section className="screen thank-you">
            <div className="checkmark">✓</div>

            <p className="eyebrow">You're In</p>

            <h1>
              Thank you!
            </h1>

            <p>
              Your choices have been recorded. Now let's see what Northmin
              wants to experience together.
            </p>
          </section>
        )}

        <footer className="footer">
          An experience initiative of <strong>One Tadhana</strong>
        </footer>
      </div>
    </main>
  );
}
