import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ActivityDetails() {

  const { id } = useParams();

  const [activity, setActivity] = useState(null);

  const [totalRegistrations,setTotalRegistrations] = useState(0);

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

      <div className="
        bg-white/5
        border border-white/10
        rounded-3xl
        p-8
      ">

        <div className="
          flex justify-between
          items-start
        ">

          <div>

            <h1 className="
              text-4xl font-bold
            ">
              {activity.title}
            </h1>

            <p className="
              text-white/60 mt-3
            ">
              {activity.description}
            </p>

          </div>

          <span className="
            px-4 py-2
            rounded-full
            bg-cyan-500/20
            text-cyan-300
          ">
            {activity.type}
          </span>

        </div>

      </div>

      <div className="
        grid grid-cols-4 gap-5
      ">

        <div className="bg-white/5 p-5 rounded-3xl">
          <p className="text-white/50">
            Points
          </p>

          <h2 className="text-3xl text-green-400">
            +{activity.points}
          </h2>
        </div>

        <div className="bg-white/5 p-5 rounded-3xl">
          <p className="text-white/50">
            Penalty
          </p>

          <h2 className="text-3xl text-red-400">
            -{activity.penaltyPoints}
          </h2>
        </div>

        <div className="bg-white/5 p-5 rounded-3xl">
          <p className="text-white/50">
            Start
          </p>

          <h2>
            {new Date(
              activity.startDate
            ).toLocaleDateString()}
          </h2>
        </div>

        <div className="bg-white/5 p-5 rounded-3xl">
          <p className="text-white/50">
            End
          </p>

          <h2>
            {new Date(
              activity.endDate
            ).toLocaleDateString()}
          </h2>
        </div>

      </div>

      <div className="
        bg-white/5
        border border-white/10
        rounded-3xl
        p-8
      ">

        <h2 className="
          text-2xl font-semibold mb-5
        ">
          Form Fields
        </h2>

        <div className="space-y-3">

          {activity.formFields?.map(
            (field, index) => (

              <div
                key={index}
                className="
                  p-4
                  rounded-2xl
                  bg-black/20
                "
              >
                <p>
                  {field.label}
                </p>

                <p className="
                  text-white/50 text-sm
                ">
                  {field.type}
                </p>
              </div>
            )
          )}

        </div> 

      </div>

      <div 
        className="
          bg-white/5
          p-5
          rounded-3xl
        "
      >

        <p className="text-white/50">
            Registrations    
        </p>

        <h2
            className="
               text-3xl
               text-cyan-400
               "
        >
            {totalRegistrations}
        </h2>
      </div>
        
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

            <div
                className="
                flex gap-4
                "
            >

                <button
                    className="
                    px-6 py-3
                    rounded-2xl
                    bg-cyan-500
                    "
                >
                  View Responses
                </button>

                <button
                    className="
                    px-6 py-3
                    rounded-2xl
                    bg-green-500
                    "
                >
                  Download CSV
                </button>

                <button
                  className="
                  px-6 py-3
                  rounded-2xl
                  bg-red-500
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