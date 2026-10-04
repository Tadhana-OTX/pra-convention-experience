"use client";

import { useEffect, useMemo, useState } from "react";

const day4Labels = {
  fun_run_zumba: "Fun Run + Zumba",
  coastal_cleanup: "Coastal Cleanup & Coffee by the Bay",
  sunrise_walk: "Sunrise Walk",
};

const stayingLabels = {
  yes: "Yes — Staying Longer",
  maybe: "Maybe — Still Deciding",
  no: "No — Heading Home",
};

const destinationLabels = {
  iligan: "Iligan's Majestic Waterfalls",
  cagayan_de_oro: "Cagayan de Oro's Whitewaters",
  bukidnon: "Bukidnon's Scenic Mountains",
  misamis_oriental: "Misamis Oriental's Coastline",
  camiguin: "Camiguin's Island Adventure",
  siargao: "Siargao's Paradise Vibe",
  agusan_norte: "Agusan Norte's Dive Spots",
  enchanted_river: "Enchanted River",
  seven_seas: "Seven Seas Waterpark",
  claveria: "Claveria",
};

const destinationIcons = {
  iligan: "💦",
  cagayan_de_oro: "🌊",
  bukidnon: "⛰️",
  misamis_oriental: "🏖️",
  camiguin: "🏝️",
  siargao: "🌴",
  agusan_norte: "🤿",
  enchanted_river: "💧",
  seven_seas: "🎢",
  claveria: "🌿",
};

function formatTime(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export default function PulsePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPulse = async () => {
    try {
      const response = await fetch("/api/pulse", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load live results.");
      }

      const result = await response.json();

      setData(result);
      setLastUpdated(new Date());
      setErrorMessage("");
    } catch (error) {
      console.error("Pulse fetch error:", error);
      setErrorMessage(
        "We couldn't load the latest results. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPulse();

    const interval = setInterval(() => {
      fetchPulse();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const leadingDay4 = useMemo(() => {
    if (!data?.day4?.length) return null;

    return [...data.day4].sort(
      (a, b) => b.responses - a.responses
    )[0];
  }, [data]);

  const leadingDestination = useMemo(() => {
    if (!data?.destinations?.length) return null;

    return [...data.destinations].sort(
      (a, b) => b.responses - a.responses
    )[0];
  }, [data]);

  const stayingYes = data?.staying?.find(
    (item) => item.value === "yes"
  );

  const stayingMaybe = data?.staying?.find(
    (item) => item.value === "maybe"
  );

  const stayingLongerPercentage =
    (stayingYes?.percentage || 0) +
    (stayingMaybe?.percentage || 0);

  return (
    <main className="pulse-shell">
      <div className="pulse-wave pulse-wave-one" />
      <div className="pulse-wave pulse-wave-two" />

      <div className="pulse-container">

        {/* HEADER */}

        <header className="pulse-header">
          <img
            src="/PRA_edited.png-3.avif"
            alt="Philippine Rheumatology Association"
            className="pulse-logo"
          />

          <div className="pulse-event">
            <strong>PRA 33RD ANNUAL MEETING</strong>
            <span>
              February 24–27, 2027 • Cagayan de Oro
            </span>
          </div>
        </header>

        {/* HERO */}

        <section className="pulse-hero">
          <div className="pulse-live">
            <span className="live-dot" />
            LIVE EXPERIENCE PULSE
          </div>

          <h1>
            WHAT DOES
            <br />
            <span>NORTHMIN WANT?</span>
          </h1>

          <p>
            The Convention experience is being shaped
            by the people who will be there.
          </p>

          <div className="response-count">
            <strong>
              {loading
                ? "—"
                : data?.total_responses || 0}
            </strong>

            <span>
              RESPONSES AND COUNTING
            </span>
          </div>
        </section>

        {/* ERROR */}

        {errorMessage && (
          <div className="pulse-error">
            {errorMessage}
          </div>
        )}

        {/* LOADING */}

        {loading && !data && (
          <section className="pulse-card pulse-loading">
            <div className="pulse-spinner" />
            <p>
              Gathering the latest Northmin pulse...
            </p>
          </section>
        )}

        {/* RESULTS */}

        {data && (
          <>
            {/* DAY 4 */}

            <section className="pulse-card">
              <div className="section-kicker">
                DAY 4
              </div>

              <h2>
                WHAT'S TRENDING?
              </h2>

              {leadingDay4 && (
                <div className="trending-callout">
                  <span>🔥 CURRENT LEADER</span>

                  <strong>
                    {day4Labels[leadingDay4.value] ||
                      leadingDay4.value}
                  </strong>

                  <small>
                    {leadingDay4.percentage}% of
                    respondents
                  </small>
                </div>
              )}

              <div className="result-list">
                {[...(data.day4 || [])]
                  .sort(
                    (a, b) =>
                      b.responses - a.responses
                  )
                  .map((item, index) => (
                    <div
                      className="result-item"
                      key={item.value}
                    >
                      <div className="result-heading">
                        <div className="result-name">
                          <span className="rank">
                            {index + 1}
                          </span>

                          <span>
                            {day4Labels[item.value] ||
                              item.value}
                          </span>
                        </div>

                        <strong>
                          {item.percentage}%
                        </strong>
                      </div>

                      <div className="result-track">
                        <div
                          className="result-fill"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>

                      <div className="result-count">
                        {item.responses}{" "}
                        {item.responses === 1
                          ? "response"
                          : "responses"}
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* STAYING */}

            <section className="pulse-card">
              <div className="section-kicker">
                AFTER THE CONVENTION
              </div>

              <h2>
                IS NORTHMIN STAYING?
              </h2>

              <div className="stay-highlight">
                <strong>
                  {Math.round(
                    stayingLongerPercentage
                  )}
                  %
                </strong>

                <span>
                  are staying longer or
                  <br />
                  still deciding
                </span>
              </div>

              <div className="result-list">
                {[...(data.staying || [])]
                  .sort(
                    (a, b) =>
                      b.responses - a.responses
                  )
                  .map((item, index) => (
                    <div
                      className="result-item"
                      key={item.value}
                    >
                      <div className="result-heading">
                        <div className="result-name">
                          <span className="rank">
                            {index + 1}
                          </span>

                          <span>
                            {stayingLabels[item.value] ||
                              item.value}
                          </span>
                        </div>

                        <strong>
                          {item.percentage}%
                        </strong>
                      </div>

                      <div className="result-track">
                        <div
                          className="result-fill"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>

                      <div className="result-count">
                        {item.responses}{" "}
                        {item.responses === 1
                          ? "response"
                          : "responses"}
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* DESTINATIONS */}

            <section className="pulse-card">
              <div className="section-kicker">
                WHERE TO NEXT?
              </div>

              <h2>
                WHERE DOES
                <br />
                NORTHMIN WANT TO GO?
              </h2>

              <p className="section-description">
                Respondents can choose more than one
                destination, so these percentages show
                the share of respondents interested in
                each place.
              </p>

              {leadingDestination && (
                <div className="trending-callout destination-callout">
                  <span>🔥 CURRENTLY TRENDING</span>

                  <strong>
                    {destinationIcons[
                      leadingDestination.value
                    ] || "📍"}{" "}
                    {destinationLabels[
                      leadingDestination.value
                    ] ||
                      leadingDestination.value}
                  </strong>

                  <small>
                    {leadingDestination.percentage}%
                    interested
                  </small>
                </div>
              )}

              <div className="destination-list">
                {[...(data.destinations || [])]
                  .sort(
                    (a, b) =>
                      b.responses - a.responses
                  )
                  .map((item, index) => (
                    <div
                      className="destination-item"
                      key={item.value}
                    >
                      <div className="destination-top">
                        <div className="destination-name">
                          <span className="destination-icon">
                            {destinationIcons[
                              item.value
                            ] || "📍"}
                          </span>

                          <div>
                            <strong>
                              {destinationLabels[
                                item.value
                              ] || item.value}
                            </strong>

                            <small>
                              {item.responses}{" "}
                              {item.responses === 1
                                ? "respondent"
                                : "respondents"}
                            </small>
                          </div>
                        </div>

                        <strong className="destination-percent">
                          {item.percentage}%
                        </strong>
                      </div>

                      <div className="result-track">
                        <div
                          className="result-fill"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* LIVE STATUS */}

            <section className="pulse-status">
              <span className="live-dot" />

              <div>
                <strong>
                  LIVE RESULTS
                </strong>

                <small>
                  Updated {formatTime(lastUpdated)}
                  {" "}• Refreshing automatically
                </small>
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}

        <footer className="pulse-footer">
          <strong>
            YOUR PRA. YOUR EXPERIENCE.
          </strong>

          <span>
            An Experience Initiative by One Tadhana Inc.
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
