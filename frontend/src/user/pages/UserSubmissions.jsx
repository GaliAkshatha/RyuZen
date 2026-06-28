import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

  const API = import.meta.env.VITE_API_URL;

function UserSubmissions() {


  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    fetchSubmissions();

  }, []);

  async function fetchSubmissions() {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      const response =
        await fetch(
          `${API}/activities/user/${user.id}`
        );

      const data =
        await response.json();

      setSubmissions(
        data.submissions || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  function getStatusColor(status) {

    switch (status) {

      case "approved":
        return "text-green-400 bg-green-500/10";

      case "rejected":
        return "text-red-400 bg-red-500/10";

      default:
        return "text-yellow-300 bg-yellow-500/10";

    }

  }

  if (loading) {

    return (
      <div className="text-white">
        Loading...
      </div>
    );

  }

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Academic Progress
        </h1>

        <p className="text-white/50 mt-2">
          Track all your submitted activities
        </p>

      </div>

      {
        submissions.length === 0 ? (

          <div
            className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-10
              text-center
            "
          >

            <h2 className="text-2xl font-semibold">
              No Submissions Yet
            </h2>

            <p className="text-white/50 mt-2">
              Complete activities to view your academic progress.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {
              submissions.map((submission) => (

                <div
                  key={submission._id}
                  className="
                    bg-white/5
                    border border-white/10
                    rounded-3xl
                    p-6

                    flex
                    justify-between
                    items-center

                    hover:border-cyan-400/40
                    transition-all
                  "
                >

                  <div className="space-y-2">

                    <h2 className="text-xl font-semibold">
                      {submission.activity?.title}
                    </h2>

                    <div className="flex gap-3">

                      <span
                        className="
                          px-3
                          py-1
                          rounded-full
                          bg-cyan-500/20
                          text-cyan-300
                          text-sm
                        "
                      >
                        {submission.activity?.type}
                      </span>

                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          ${getStatusColor(submission.status)}
                        `}
                      >
                        {submission.status}
                      </span>

                    </div>

                    <p className="text-white/40 text-sm">

                      Submitted on{" "}

                      {
                        new Date(
                          submission.createdAt
                        ).toLocaleDateString()
                      }

                    </p>

                  </div>

                  <div
                    className="
                      text-right
                      space-y-3
                    "
                  >

                    <p
                      className="
                        text-3xl
                        font-bold
                        text-green-400
                      "
                    >
                      +{submission.activity?.points}
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          `/user/activities/${submission.activity._id}`
                        )
                      }
                      className="
                        px-5
                        py-2
                        rounded-xl
                        bg-cyan-500
                        hover:bg-cyan-400
                        transition
                      "
                    >
                      View Activity
                    </button>

                  </div>

                </div>

              ))
            }

          </div>

        )
      }

    </div>

  );

}

export default UserSubmissions;