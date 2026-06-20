import { useState, useEffect } from "react";

import FormBuilder from "../components/FormBuilder";
import WorkshopBuilder from "../components/WorkshopBuilder";
import AssignmentBuilder from "../components/AssignmentBuilder";

function ActivitiesPage() {

  const [selectedType, setSelectedType] = useState("");

  const [activities, setActivities] = useState([]);

  useEffect(() => {

    fetchActivities();

  }, []);

  async function fetchActivities() {

    try {

      const response = await fetch(
        "http://localhost:5000/api/activities"
      );

      const data = await response.json();

      setActivities(data);

    } catch (error) {

      console.log(error);

    }
  }

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-bold text-white">
          Activities
        </h1>

        <p className="text-white/50 mt-2">
          Create and manage campus activities
        </p>

      </div>

      {/* ACTIVITY TYPES */}
      <div className="grid grid-cols-3 gap-5">

        <button
          onClick={() => setSelectedType("form")}
          className="
            p-6 rounded-3xl
            bg-white/5
            border border-cyan-500/20

            hover:border-cyan-400
            hover:bg-cyan-500/10

            transition-all duration-300

            text-left
          "
        >

          <h2 className="text-2xl font-semibold mb-2">
            Form Fill
          </h2>

          <p className="text-white/50">
            Create Google-form style activities
          </p>

        </button>

        <button
          onClick={() => setSelectedType("workshop")}
          className="
            p-6 rounded-3xl
            bg-white/5
            border border-cyan-500/20

            hover:border-cyan-400
            hover:bg-cyan-500/10

            transition-all duration-300

            text-left
          "
        >

          <h2 className="text-2xl font-semibold mb-2">
            Workshop
          </h2>

          <p className="text-white/50">
            Coming soon
          </p>

        </button>

        <button
          onClick={() => setSelectedType("assignment")}
          className="
            p-6 rounded-3xl
            bg-white/5
            border border-cyan-500/20

            hover:border-cyan-400
            hover:bg-cyan-500/10

            transition-all duration-300

            text-left
          "
        >

          <h2 className="text-2xl font-semibold mb-2">
            Assignment
          </h2>

          <p className="text-white/50">
            Coming soon
          </p>

        </button>

      </div>

      {/* FORM BUILDER */}
      {
        selectedType === "form" && (

          <div
            className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-8
            "
          >

            <FormBuilder
              fetchActivities={fetchActivities}
              setSelectedType={setSelectedType}
            />

          </div>

        )
      }
      {/* WORKSHOP BUILDER */}

      {
        selectedType === "workshop" && (
          <div className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-8
          ">
            <WorkshopBuilder
                fetchActivities={
                    fetchActivities
                }
                setSelectedType={setSelectedType}
              />
          </div>
        )
      }

      {
        selectedType === "assignment" && (
          <div className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-8
          ">
            <AssignmentBuilder
                fetchActivities={
                    fetchActivities
                }
                setSelectedType={setSelectedType}
              />
          </div>
        )
      }

      {/* RECENT ACTIVITIES */}
      <div>

        <h2
          className="
            text-2xl font-semibold
            mb-5
            text-white
          "
        >
          Recent Activities
        </h2>

        {
          activities.length === 0 ? (

            <div
              className="
                bg-white/5
                border border-white/10
                rounded-3xl
                p-8
                text-center
                text-white/50
              "
            >
              No activities created yet
            </div>

          ) : (

            <div className="grid grid-cols-2 gap-5">

              {
                activities.map((activity) => (

                  <div
                    key={activity._id}
                    className="
                      bg-white/5
                      border border-white/10

                      rounded-3xl
                      p-6

                      hover:border-cyan-400/40
                      transition-all
                    "
                  >

                    <div className="flex justify-between">

                      <h3 className="text-xl font-semibold">

                        {activity.title}

                      </h3>

                      <span
                        className="
                          px-3 py-1
                          rounded-full

                          bg-cyan-500/20
                          text-cyan-300
                          text-xs
                        "
                      >
                        {activity.type}
                      </span>

                    </div>

                    <p
                      className="
                        text-white/50
                        mt-3
                      "
                    >
                      {activity.description}
                    </p>

                    <div
                      className="
                        flex gap-4
                        mt-4
                      "
                    >

                      <span
                        className="
                          text-green-400
                          text-sm
                        "
                      >
                        +{activity.points} pts
                      </span>

                      <span
                        className="
                          text-red-400
                          text-sm
                        "
                      >
                        -{activity.penaltyPoints} pts
                      </span>

                    </div>

                    <div
                      className="
                        mt-4
                        text-xs
                        text-white/40
                      "
                    >

                      Fields:
                      {" "}
                      {
                        activity.formFields?.length || 0
                      }

                    </div>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </div>

  );
}

export default ActivitiesPage;