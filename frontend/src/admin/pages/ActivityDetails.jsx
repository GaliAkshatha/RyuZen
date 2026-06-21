import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ActivityDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  useEffect(() => {
    fetchActivity();
  }, []);

  async function fetchActivity() {

    try {

      const response = await fetch(
        `http://localhost:5000/api/activities/${id}`
      );

      const data = await response.json();

      setActivity(data.activity);
      setTotalRegistrations(data.totalRegistrations);

    } catch (error) {

      console.log(error);

    }
  }

  if (!activity) {

    return (
      <div className="text-white">
        Loading...
      </div>
    );

  }

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div
        className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-8
        "
      >

        <div className="flex justify-between items-start">

          <div>

            <h1 className="text-4xl font-bold">
              {activity.title}
            </h1>

            <p className="text-white/60 mt-3">
              {activity.description}
            </p>

          </div>

          <span
            className="
              px-4 py-2
              rounded-full
              bg-cyan-500/20
              text-cyan-300
            "
          >
            {activity.type}
          </span>

        </div>

      </div>

      {/* CREATOR INFO */}

      <div
        className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-6
        "
      >

        <h2
          className="
            text-xl
            font-semibold
            mb-5
          "
        >
          Creator Information
        </h2>

        <div
          className="
            grid grid-cols-4
            gap-6
          "
        >

          <div>
            <p className="text-white/50 text-sm">
              Name
            </p>

            <p className="font-medium">
              {activity.createdBy?.name || "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-white/50 text-sm">
              Email
            </p>

            <p className="font-medium">
              {activity.createdBy?.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-white/50 text-sm">
              Role
            </p>

            <p className="font-medium">
              {activity.createdBy?.role || "-"}
            </p>
          </div>

          <div>
            <p className="text-white/50 text-sm">
              User ID
            </p>

            <p className="text-xs break-all">
              {activity.createdBy?._id || "-"}
            </p>
          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-4 gap-5">

        <div className="bg-white/5 rounded-3xl p-6">

          <p className="text-white/50">
            Points
          </p>

          <h2 className="text-4xl font-bold text-green-400">
            +{activity.points}
          </h2>

        </div>

        <div className="bg-white/5 rounded-3xl p-6">

          <p className="text-white/50">
            Penalty
          </p>

          <h2 className="text-4xl font-bold text-red-400">
            -{activity.penaltyPoints}
          </h2>

        </div>

        <div className="bg-white/5 rounded-3xl p-6">

          <p className="text-white/50">
            Registrations
          </p>

          <h2 className="text-4xl font-bold text-cyan-400">
            {totalRegistrations}
          </h2>

        </div>

        <div className="bg-white/5 rounded-3xl p-6">

          <p className="text-white/50">
            Status
          </p>

          <h2 className="text-2xl font-bold text-yellow-400">
            {activity.status}
          </h2>

        </div>

      </div>

      {/* SCHEDULE */}

      <div
        className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-8
        "
      >

        <h2
          className="
            text-2xl
            font-semibold
            mb-5
          "
        >
          Schedule
        </h2>

        <div className="grid grid-cols-2 gap-5">

          <div>

            <p className="text-white/50">
              Start Date
            </p>

            <p>
              {new Date(
                activity.startDate
              ).toLocaleDateString()}
            </p>

          </div>

          <div>

            <p className="text-white/50">
              End Date
            </p>

            <p>
              {new Date(
                activity.endDate
              ).toLocaleDateString()}
            </p>

          </div>

        </div>

      </div>

      {/* WORKSHOP */}

      {
        activity.type === "workshop" && (

          <div
            className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-8
            "
          >

            <h2
              className="
                text-2xl
                font-semibold
                mb-5
              "
            >
              Workshop Details
            </h2>

            <div className="grid grid-cols-2 gap-5">

              <div>
                <p className="text-white/50">
                  Venue
                </p>

                <p>{activity.venue || "-"}</p>
              </div>

              <div>
                <p className="text-white/50">
                  Attendance Method
                </p>

                <p>{activity.attendanceMethod || "-"}</p>
              </div>

              <div>
                <p className="text-white/50">
                  Start Time
                </p>

                <p>{activity.startTime || "-"}</p>
              </div>

              <div>
                <p className="text-white/50">
                  End Time
                </p>

                <p>{activity.endTime || "-"}</p>
              </div>

            </div>

            {
              activity.registrationDeadline && (

                <div className="mt-5">

                  <p className="text-white/50">
                    Registration Deadline
                  </p>

                  <p>
                    {new Date(
                      activity.registrationDeadline
                    ).toLocaleDateString()}
                  </p>

                </div>

              )
            }

            {
              activity.requirements?.length > 0 && (

                <div className="mt-5">

                  <p className="text-white/50 mb-3">
                    Requirements
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {
                      activity.requirements.map(
                        (req, index) => (

                          <span
                            key={index}
                            className="
                              px-3 py-1
                              rounded-full
                              bg-cyan-500/20
                              text-cyan-300
                            "
                          >
                            {req}
                          </span>

                        )
                      )
                    }

                  </div>

                </div>

              )
            }

          </div>

        )
      }

      {/* ASSIGNMENT */}

      {
        activity.type === "assignment" && (

          <div
            className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-8
            "
          >

            <h2
              className="
                text-2xl
                font-semibold
                mb-5
              "
            >
              Assignment Details
            </h2>

            <div className="space-y-4">

              <div>

                <p className="text-white/50">
                  Submission Type
                </p>

                <p>
                  {activity.submissionType}
                </p>

              </div>

              <div>

                <p className="text-white/50">
                  Instructions
                </p>

                <p>
                  {activity.instructions}
                </p>

              </div>

            </div>

          </div>

        )
      }

      {/* FORM FIELDS */}

      <div
        className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-8
        "
      >

        <h2
          className="
            text-2xl
            font-semibold
            mb-5
          "
        >
          Form Fields
        </h2>

        <div className="space-y-3">

          {
            activity.formFields?.map(
              (field, index) => (

                <div
                  key={index}
                  className="
                    flex justify-between
                    items-center

                    p-4

                    rounded-2xl
                    bg-black/20

                    border border-white/10
                  "
                >

                  <div>

                    <p className="font-medium">
                      {field.label}
                    </p>

                    <p className="text-white/50 text-sm">
                      {field.type}
                    </p>

                  </div>

                  {
                    field.required && (

                      <span
                        className="
                          px-3 py-1
                          rounded-full

                          bg-red-500/20
                          text-red-300

                          text-xs
                        "
                      >
                        Required
                      </span>

                    )
                  }

                </div>

              )
            )
          }

        </div>

      </div>

      {/* MANAGEMENT */}

      <div
        className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-8
        "
      >

        <h2
          className="
            text-2xl
            font-semibold
            mb-5
          "
        >
          Activity Management
        </h2>

        <div className="flex gap-4">

          <button
            onClick={() =>
                navigate(
                    `/admin/activities/${id}/responses`
                )
            }
            className="
              px-6 py-3
              rounded-2xl

              bg-cyan-500
              hover:bg-cyan-400

              transition-all
            "
          >
            View Responses
          </button>

          <button
            className="
              px-6 py-3
              rounded-2xl

              bg-green-500
              hover:bg-green-400

              transition-all
            "
          >
            Download CSV
          </button>

          <button
            className="
              px-6 py-3
              rounded-2xl

              bg-red-500
              hover:bg-red-400

              transition-all
            "
          >
            Close Activity
          </button>

        </div>

      </div>

    </div>

  );
}

export default ActivityDetails;