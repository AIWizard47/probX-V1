import React, { useState } from "react";

const RulesSection = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="Rules text-gray-800">
      <div className="mb-6">
        <h3 className="font-semibold">Rules</h3>
        <p className="text-sm mt-1">
          <strong>REFERENCE FOR SETTLEMENT (Source of Truth):</strong>
          <br />
          1. The scorecard on the mentioned Source of truth will be considered
          for settlement. The score on the live streaming will not be taken into
          consideration.
          <br />
          2. The scorecard displayed on the Platform along with the one-liner is
          only indicative and used for reference purposes only and shall not be
          relied upon as a source of truth at the time of settlement.
          <br />
          3. Any decision by the match officials will be final and binding. For
          example – a 5-ball over will be considered a complete over if given by
          the umpire.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold">EXPIRY:</h3>
        <p className="text-sm mt-1">
          The event will expire at the end of the match.
        </p>
        {!showMore && (
          <span
            onClick={() => setShowMore(true)}
            className="text-blue-500 cursor-pointer"
          >
            See more
          </span>
        )}
      </div>

      {showMore && (
        <>
          <div className="mb-6">
            <h3 className="font-semibold">
              In case of rain/bad light/bad weather/any other interruption:
            </h3>
            <p className="text-sm mt-1">
              1. The event will be expired/made inactive/paused for trading for
              the delayed time & will be activated when the play resumes.
              <br />
              2. If the required number of overs (As per the tournament rules,
              if not mentioned then as per MCC Rulebook) have been bowled in the
              2nd innings for a result to come in the match, the event will
              remain active.
              <br />
              3. If the match is washed out/cancelled/postponed, all trades will
              be rendered null and your investment will be returned.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">SETTLEMENT:</h3>
            <p className="text-sm mt-1">
              The event will settle at YES if the specified team:
              <br />
              1. Wins the match
              <br />
              2. Wins the match after Super Over/Super Overs
              <br />
              3. Wins the match by DLS method
              <br />
              4. Wins the match by VJD method
              <br />
              5. Wins the match by forfeit
              <br />
              6. Is awarded with the match
              <br />
              7. Wins by any other method as per the tournament rules
              <br />
              <p className="font-black py-1">
                Else the event will settle at NO if the specified team:
              </p>
              1. The specified team loses the match
              <br />
              2. The specified team loses the match by DLS method
              <br />
              3. The specified team loses the match by VJD method
              <br />
              4. The specified team loses the match after Super Over/Super Overs
              <br />
              5. The match ends in a draw
              <br />
              6. The match ends in a tie (even by DLS or VJD method)
              <br />
              7. The specified team forfeits the match
              <br />
              8. The specified team awards the match to the other team
              <br />
              9. The specified team loses by any other method as per the
              tournament rules
            </p>
            <span
              onClick={() => setShowMore(false)}
              className="text-blue-500 cursor-pointer"
            >
              See less
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default RulesSection;
