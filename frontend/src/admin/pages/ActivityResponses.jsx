import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ActivityResponses() {

  const { id } = useParams();

  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchResponses();

  }, []);

  async function fetchResponses() {

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/activities/${id}/responses`
        );

      const data =
        await response.json();

      setResponses(
        data.responses || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  async function approveResponse(
    submissionId
  ) {

    try {

      const response =
        await fetch(

          `http://localhost:5000/api/activities/responses/${submissionId}/approve`,

          {
            method: "PATCH",
          }

        );

      const data =
        await response.json();

      alert(data.message);

      fetchResponses();

    } catch (error) {

      console.log(error);

    }

  }

  async function rejectResponse(
    submissionId
  ) {

    try {

      const response =
        await fetch(

          `http://localhost:5000/api/activities/responses/${submissionId}/reject`,

          {
            method: "PATCH",
          }

        );

      const data =
        await response.json();

      alert(data.message);

      fetchResponses();

    } catch (error) {

      console.log(error);

    }

  }

  if (loading) {

    return (
      <div className="text-white">
        Loading Responses...
      </div>
    );

  }

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1
          className="
            text-4xl
            font-bold
          "
        >
          Activity Responses
        </h1>

        <p
          className="
            text-white/50
            mt-2
          "
        >
          Review and manage submissions
        </p>

      </div>

      {/* EMPTY STATE */}

      {
        responses.length === 0 && (

          <div
            className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-8
              text-center
            "
          >

            No Responses Yet

          </div>

        )
      }

      {/* RESPONSE LIST */}

      {
        responses.map(
          (response) => (

            <div
              key={response._id}
              className="
                bg-white/5
                border border-white/10
                rounded-3xl
                p-6
              "
            >

              {/* USER INFO */}

              <div
                className="
                  flex
                  justify-between
                  items-start
                "
              >

                <div>

                  <h2
                    className="
                      text-2xl
                      font-semibold
                    "
                  >
                    {response.user?.name}
                  </h2>

                  <p
                    className="
                      text-white/50
                    "
                  >
                    {response.user?.email}
                  </p>

                </div>

                <span
                  className={`
                    px-4 py-2
                    rounded-full
                    text-sm

                    ${
                      response.status === "approved"
                        ? "bg-green-500/20 text-green-300"

                        : response.status === "rejected"
                        ? "bg-red-500/20 text-red-300"

                        : response.status === "attended"
                        ? "bg-blue-500/20 text-blue-300"

                        : "bg-yellow-500/20 text-yellow-300"
                    }
                  `}
                >
                  {response.status}
                </span>

              </div>

              {/* ANSWERS */}

              <div className="mt-6">

                <h3
                  className="
                    text-lg
                    font-semibold
                    mb-4
                  "
                >
                  Submitted Answers
                </h3>

                {
                  Object.entries(
                    response.answers || {}
                  ).map(
                    ([key, value]) => (

                      <div
                        key={key}
                        className="
                          bg-black/20
                          rounded-2xl
                          p-4
                          mb-3
                        "
                      >

                        <p
                          className="
                            text-white/50
                            text-sm
                          "
                        >
                          {key}
                        </p>

                        <p>
                          {value}
                        </p>

                      </div>

                    )
                  )
                }

              </div>

              {/* SUBMISSION DATE */}

              <div
                className="
                  mt-5
                  text-sm
                  text-white/40
                "
              >
                Submitted on{" "}
                {
                  new Date(
                    response.createdAt
                  ).toLocaleString()
                }
              </div>

              {/* ACTIONS */}

              {
                response.status ===
                "submitted" && (

                  <div
                    className="
                      flex gap-3
                      mt-6
                    "
                  >

                    <button
                      onClick={() =>
                        approveResponse(
                          response._id
                        )
                      }
                      className="
                        px-5 py-3
                        rounded-2xl
                        bg-green-500
                        hover:bg-green-400
                      "
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectResponse(
                          response._id
                        )
                      }
                      className="
                        px-5 py-3
                        rounded-2xl
                        bg-red-500
                        hover:bg-red-400
                      "
                    >
                      Reject
                    </button>

                  </div>

                )
              }

            </div>

          )
        )
      }

    </div>

  );

}

export default ActivityResponses;