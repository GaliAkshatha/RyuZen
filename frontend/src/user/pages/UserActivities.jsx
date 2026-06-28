import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActivityCard from "../../shared/components/ActivityCard";
import { getActivities } from "../../services/activityService";


function UserActivities() {

  
  const navigate = useNavigate();

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchActivities();

  }, []);

  async function fetchActivities() {

    try {

      const activities = 
          await getActivities();

      setActivities(activities);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-4xl font-bold">
          Activities
        </h1>

        <p className="text-white/50 mt-2">
          Complete activities and earn points
        </p>

      </div>

      {/* ACTIVITY LIST */}

      {
        loading ? (

          <div className="text-white/50">
            Loading...
          </div>

        ) : (

          <div className="
            grid grid-cols-2 gap-5
          ">

            {
                activities.map(
                    (activity) => (
                        <ActivityCard 

                        key={activity._id}

                        activity={activity}

                        role="user"

                    />
                    )
                )
            }

          </div>

        )
      }

    </div>

  );
}

export default UserActivities;