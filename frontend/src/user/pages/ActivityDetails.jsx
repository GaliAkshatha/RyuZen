import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivity, submitActivity } from "../../services/activityService";

const API = import.meta.env.VITE_API_URL;

function ActivityDetails() {

  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchActivity();
  }, []);

  async function fetchActivity() {
    try {
      const activityResponse = 
          await getActivity(id);

      setActivity(activityRespons.activity);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(label, value) {
    setAnswers({
      ...answers,
      [label]: value,
    });
  }

  async function handleSubmit() {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await submitActivity(
        id,
        {
          userId:
            user.id,
          answers,
        }
      );

      alert("Submitted Successfully");

      setAnswers({});

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

            <p className="text-white/50 mt-3">
              {activity.description}
            </p>
          </div>

          <span
            className={`
              px-4 py-2 rounded-full text-sm

              ${
                activity.type === "form"
                  ? "bg-cyan-500/20 text-cyan-300"
                  : activity.type === "workshop"
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-orange-500/20 text-orange-300"
              }
            `}
          >
            {activity.type}
          </span>

        </div>
      </div>

      {/* ACTIVITY INFO */}

      <div
        className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-8
        "
      >
        <h2 className="text-2xl font-semibold mb-5">
          Activity Information
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <div>
            <p className="text-white/50">
              Reward
            </p>

            <p className="text-green-400 text-xl">
              +{activity.points}
            </p>
          </div>

          <div>
            <p className="text-white/50">
              Penalty
            </p>

            <p className="text-red-400 text-xl">
              -{activity.penaltyPoints}
            </p>
          </div>

          <div>
            <p className="text-white/50">
              Start Date
            </p>

            <p>
              {activity.startDate
                ? new Date(
                    activity.startDate
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-white/50">
              End Date
            </p>

            <p>
              {activity.endDate
                ? new Date(
                    activity.endDate
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>

        </div>
      </div>

      {/* WORKSHOP DETAILS */}

      {activity.type === "workshop" && (
        <div
          className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-8
          "
        >
          <h2 className="text-2xl font-semibold mb-5">
            Workshop Details
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <p className="text-white/50">
                Venue
              </p>

              <p>{activity.venue}</p>
            </div>

            <div>
              <p className="text-white/50">
                Attendance
              </p>

              <p>
                {activity.attendanceMethod}
              </p>
            </div>

            <div>
              <p className="text-white/50">
                Start Time
              </p>

              <p>{activity.startTime}</p>
            </div>

            <div>
              <p className="text-white/50">
                End Time
              </p>

              <p>{activity.endTime}</p>
            </div>

          </div>

          {activity.registrationDeadline && (
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
          )}

          {activity.requirements?.length > 0 && (
            <div className="mt-6">

              <h3 className="font-semibold mb-3">
                Requirements
              </h3>

              <div className="flex flex-wrap gap-2">

                {activity.requirements.map(
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
                )}

              </div>

            </div>
          )}

        </div>
      )}

      {/* ASSIGNMENT DETAILS */}

      {activity.type === "assignment" && (
        <div
          className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-8
          "
        >
          <h2 className="text-2xl font-semibold mb-5">
            Assignment Details
          </h2>

          <p className="mb-4">
            <span className="text-white/50">
              Submission Type:
            </span>{" "}
            {activity.submissionType}
          </p>

          <p>
            <span className="text-white/50">
              Instructions:
            </span>{" "}
            {activity.instructions}
          </p>
        </div>
      )}

      {/* FORM */}

      <div
        className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-8
        "
      >
        <h2 className="text-2xl font-semibold mb-5">
          Activity Form
        </h2>

        <div className="space-y-5">

          {activity.formFields?.map(
            (field, index) => (
              <div key={index}>

                <label
                  className="
                    block mb-2
                  "
                >
                  {field.label}

                  {field.required && (
                    <span className="text-red-400 ml-1">
                      *
                    </span>
                  )}
                </label>

                <input
                  type={
                    field.type === "number"
                      ? "number"
                      : field.type === "email"
                      ? "email"
                      : field.type === "date"
                      ? "date"
                      : "text"
                  }

                  value={answers[field.label]|| ""}

                  required={field.required}

                  onChange={(e) =>
                    handleChange(
                      field.label,
                      e.target.value
                    )
                  }

                  className="
                    w-full
                    p-4
                    rounded-2xl
                    bg-white/5
                    border border-white/10
                  "
                />

              </div>
            )
          )}

        </div>

        

        {
            activity.status === "active" ? (

            <button
                onClick={handleSubmit}
                className="
                w-full
                mt-8
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-500

                hover:scale-[1.01]
                transition-all
                "
            >
              Submit
            </button>

            ) : (

                <div
                    className="
                    mt-8
                    p-4
                    rounded-2xl

                    bg-red-500/10
                    border border-red-500/20

                    text-red-300
                    text-center
                    font-medium
                    "
                >
                  This activity is closed
                </div>

            )
        }

      </div>

    </div>
  );
}

export default ActivityDetails;