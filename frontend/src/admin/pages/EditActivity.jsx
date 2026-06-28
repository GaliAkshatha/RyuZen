import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ActivityForm from "../components/ActivityForm";
import { getActivity } from "../../services/activityService";

const API = import.meta.env.VITE_API_URL;

function EditActivity() {

    const { id } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [activity, setActivity] =
        useState(null);

    useEffect(() => {

        fetchActivity();

    }, []);

    async function fetchActivity() {

        try {

            const activityResponse = 
                await getActivity(id);

            setActivity(
                activityResponse.activity
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (
            <div className="text-white">
                Loading...
            </div>
        );

    }

    if (!activity) {

        return (
            <div className="text-red-400">
                Activity not found
            </div>
        );

    }

    return (

        <div className="space-y-6">

            <div>

                <h1
                    className="
                    text-4xl
                    font-bold
                    "
                >
                    Edit Activity
                </h1>

                <p
                    className="
                    text-white/50
                    mt-2
                    "
                >
                    Update activity details
                </p>

            </div>

            <div
                className="
                bg-white/5
                border border-white/10
                rounded-3xl
                p-8
                "
            >

                <ActivityForm
                    mode="edit"
                    type={activity.type}
                    initialData={activity}
                />

            </div>

        </div>

    );

}

export default EditActivity;