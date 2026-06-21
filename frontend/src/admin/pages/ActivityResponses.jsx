import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

function ActivityResponses() {

  const { id } =
    useParams();

  const [responses,
    setResponses] =
    useState([]);

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
        data.responses
      );

    } catch (error) {

      console.log(error);

    }
  }

  return (

    <div className="space-y-6">

      <h1
        className="
          text-4xl
          font-bold
        "
      >
        Activity Responses
      </h1>

      {
        responses.map(
          (
            submission
          ) => (

            <div
              key={
                submission._id
              }
              className="
                bg-white/5
                border border-white/10
                rounded-3xl
                p-6
              "
            >

              <div className="mb-5">

                <h2 className="text-xl font-semibold">

                  {
                    submission.user
                      ?.name
                  }

                </h2>

                <p className="text-white/50">

                  {
                    submission.user
                      ?.email
                  }

                </p>

              </div>

              {
                Object.entries(
                  submission.answers
                ).map(
                  (
                    [key,
                    value]
                  ) => (

                    <div
                      key={key}
                      className="
                        mb-3
                      "
                    >

                      <p className="text-white/50">
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

          )
        )
      }

    </div>

  );
}

export default ActivityResponses;