import { useNavigate } from "react-router-dom";

function ActivityCard({

  activity,

  role = "user",

}) {

  const navigate =
    useNavigate();

  function openActivity() {

    navigate(
      `/${role}/activities/${activity._id}`
    );

  }

  return (

    <div
      onClick={openActivity}
      className="
        bg-white/5
        border border-white/10

        rounded-3xl
        p-6

        cursor-pointer

        hover:border-cyan-400
        hover:bg-cyan-500/5

        hover:scale-[1.02]

        transition-all
      "
    >

      <div className="
        flex justify-between
        items-start
      ">

        <h2 className="
          text-2xl font-semibold
        ">
          {activity.title}
        </h2>

        <span
          className={`
            px-3 py-1
            rounded-full
            text-xs

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

      <p className="
        text-white/50 mt-3
      ">
        {activity.description}
      </p>

      <div className="
        flex justify-between
        mt-5
      ">

        <span className="
          text-green-400
        ">
          +{activity.points} pts
        </span>

        <span className="
          text-white/50
        ">
          Open →
        </span>

      </div>

    </div>

  );
}

export default ActivityCard;