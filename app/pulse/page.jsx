
"use client";

import { useEffect, useMemo, useState } from "react";

const day4Labels = {
  fun_run_zumba: "Fun Run + Zumba",
  coastal_cleanup: "Coastal Cleanup & Coffee by the Bay",
  sunrise_walk: "Sunrise Walk + Coffee Chill",
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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function ResultBar({ percentage, color = "blue" }) {
  const safePercentage = Math.max(
    0,
    Math.min(100, Number(percentage) || 0)
  );

  return (
    <div
      className={`result-track result-track-${color}`}
      role="progressbar"
      aria-valuenow={safePercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${safePercentage}% of respondents`}
    >
      <div
        className="result-fill"
        style={{ width: `${safePercentage}%` }}
      />
    </div>
  );
}

function ResultItem({
  item,
  index,
  label,
  color = "blue",
}) {
  return (
    <div className="result-item" key={item.value}>
      <div className="result-heading">
        <div className="result-name">
          <span className="rank">{index + 1}</span>
          <span>{label}</span>
        </div>

        <strong>{item.percentage}%</strong>
      </div>

      <ResultBar
        percentage={item.percentage}
        color={color}
      />

      <div className="result-count">
        {item.responses}{" "}
        {item.responses === 1 ? "response" : "responses"}
      </div>
    </div>
  );
}

export default function PulsePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchPulse() {
      try {
        const response = await fetch("/api/pulse", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load live results.");
        }

        const result = await response.json();

        if (!active) return;

        setData(result);
        setLastUpdated(new Date());
        setErrorMessage("");
      } catch (error) {
        console.error("Pulse fetch error:", error);

        if (active) {
          setErrorMessage(
            "We couldn't load the latest results. Please try again shortly."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchPulse();

    const interval = setInterval(fetchPulse, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const sortedDay4 = useMemo(
    () =>
      [...(data?.day4 || [])].sort(
        (a, b) => b.responses - a.responses
      ),
    [data]
  );

  const sortedStaying = useMemo(
    () =>
      [...(data?.staying || [])].sort(
        (a, b) => b.responses - a.responses
      ),
    [data]
  );

  const sortedDestinations = useMemo(
    () =>
      [...(data?.destinations || [])].sort(
        (a, b) => b.responses - a.responses
      ),
    [data]
  );

  const leadingDay4 = sortedDay4[0] || null;
  const leadingDestination = sortedDestinations[0] || null;

  const stayingYes =
    data?.staying?.find((item) => item.value === "yes");

  const stayingMaybe =
    data?.staying?.find((item) => item.value === "maybe");

  const stayingLongerPercentage = Math.min(
    100,
    (stayingYes?.percentage || 0) +
      (stayingMaybe?.percentage || 0)
  );

  const totalResponses = data?.total_responses || 0;

  return (
    <main className="pulse-shell">
      <div className="pulse-container">

        {/* CONVENTION HEADER */}

        <header className="pulse-header">
          <img
            src="/PRA_edited.png-3.avif"
            alt="Philippine Rheumatology Association"
            className="pulse-logo"
          />

          <div className="pulse-event">
            <strong>PRA 33RD ANNUAL MEETING</strong>
            <span>February 24–27, 2027</span>
            <span>Cagayan de Oro</span>
          </div>
        </header>

        {/* MAIN MESSAGE */}

        <section className="pulse-hero">
          <div className="pulse-live">
            <span className="live-dot" />
            LIVE EXPERIENCE PULSE
          </div>

          <h1>
            WHAT DOES
            <br />
            <span>PRA WANT?</span>
          </h1>

          <p>
            Your voice matters. Help shape the convention
            experience through your preferences and ideas.
          </p>

          <div className="response-count">
            <strong>
              {loading && !data ? "—" : totalResponses}
            </strong>

            <span>
              RESPONSES
              <br />
              AND COUNTING
            </span>
          </div>
        </section>

        {/* LOADING AND ERROR STATES */}

        {errorMessage && (
          <div className="pulse-error" role="alert">
            {errorMessage}
          </div>
        )}

        {loading && !data && (
          <section className="pulse-card pulse-loading">
            <div className="pulse-spinner" />
            <p>Gathering the latest poll results...</p>
          </section>
        )}

        {/* LIVE RESULTS */}

        {data && (
          <>
            {/* DAY 4 EXPERIENCE */}

            <section className="pulse-card">
              <div className="section-kicker">
                DAY 4 EXPERIENCE
              </div>

              <h2>What's Trending?</h2>

              <p className="section-description">
                Which activity would you like to experience
                together?
              </p>

              {leadingDay4 && (
                <div className="trending-callout">
                  <span>🔥 CURRENT LEADER</span>

                  <strong>
                    {day4Labels[leadingDay4.value] ||
                      leadingDay4.value}
                  </strong>

                  <small>
                    {leadingDay4.percentage}% of respondents
                  </small>
                </div>
              )}

              {sortedDay4.length > 0 ? (
                <div className="result-list">
                  {sortedDay4.map((item, index) => (
                    <ResultItem
                      key={item.value}
                      item={item}
                      index={index}
                      label={
                        day4Labels[item.value] || item.value
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="section-description">
                  No Day 4 responses yet. Be among the first
                  to share your preference!
                </p>
              )}
            </section>

            {/* EXTENDING THE STAY */}

            <section className="pulse-card">
              <div className="section-kicker">
                AFTER THE CONVENTION
              </div>

              <h2>Will You Stay Longer?</h2>

              <p className="section-description">
                Would you like to extend your stay and
                explore more of the region?
              </p>

              <div className="stay-highlight">
                <strong>
                  {Math.round(stayingLongerPercentage)}%
                </strong>

                <span>
                  are staying longer or
                  <br />
                  still deciding
                </span>
              </div>

              {sortedStaying.length > 0 ? (
                <div className="result-list">
                  {sortedStaying.map((item, index) => (
                    <ResultItem
                      key={item.value}
                      item={item}
                      index={index}
                      label={
                        stayingLabels[item.value] ||
                        item.value
                      }
                      color="gold"
                    />
                  ))}
                </div>
              ) : (
                <p className="section-description">
                  No stay-extension responses yet.
                </p>
              )}
            </section>

            {/* DESTINATION PREFERENCES */}

            <section className="pulse-card">
              <div className="section-kicker">
                DESTINATION PREFERENCES
              </div>

              <h2>
                Where Would You
                <br />
                Like to Go?
              </h2>

              <p className="section-description">
                Discover which destinations interest
                convention participants. You can select
                more than one destination, so percentages
                represent the share of respondents interested
                in each place.
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
                    ] || leadingDestination.value}
                  </strong>

                  <small>
                    {leadingDestination.percentage}% interested
                  </small>
                </div>
              )}

              {sortedDestinations.length > 0 ? (
                <div className="destination-list">
                  {sortedDestinations.map((item) => (
                    <div
                      className="destination-item"
                      key={item.value}
                    >
                      <div className="destination-top">
                        <div className="destination-name">
                          <span className="destination-icon">
                            {destinationIcons[item.value] ||
                              "📍"}
                          </span>

                          <div>
                            <strong>
                              {destinationLabels[item.value] ||
                                item.value}
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

                      <ResultBar
                        percentage={item.percentage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="section-description">
                  Destination preferences will appear here
                  as participants respond.
                </p>
              )}
            </section>

            {/* LIVE STATUS */}

            <section className="pulse-status">
              <span className="live-dot" />

              <div>
                <strong>LIVE RESULTS</strong>

                <small>
                  {lastUpdated
                    ? `Last updated: ${formatTime(lastUpdated)}`
                    : "Waiting for results"}
                  {" · "}
                  Refreshes automatically
                </small>
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}

        <footer className="pulse-footer">
          <strong>YOUR PRA. YOUR EXPERIENCE.</strong>

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
