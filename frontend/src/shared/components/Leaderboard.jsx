import { useEffect, useState } from "react";
import { getleaderboard } from "../../services/leaderboardService";

function Leaderboard() {

    
    const [players, setPlayers] =
        useState([]);

    useEffect(() => {

        fetchLeaderboard();

    }, []);

    async function fetchLeaderboard() {

        try {

            const leaderboardResponse = 
                await getleaderboard();

            setPlayers(
                leaderboardResponse.leaderboard || []
            );

        } catch (error) {

            console.log(error);

        }

    }

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    function getRank(index) {

        if (index === 0)
            return "🥇";

        if (index === 1)
            return "🥈";

        if (index === 2)
            return "🥉";

        return index + 1;

    }

    return (

        <div className="space-y-3">

            {
                players
                    .slice(0,10)
                    .map((player,index)=>(

                        <div
                            key={player._id}

                            className={`
                                flex
                                justify-between
                                items-center

                                rounded-xl
                                p-3

                                ${
                                    player._id === user.id
                                    ? "bg-cyan-500/20 border border-cyan-400"
                                    : "bg-white/5"
                                }
                            `}
                        >

                            <div className="flex gap-4 items-center">

                                <div className="text-xl">

                                    {getRank(index)}

                                </div>

                                <div>

                                    <p className="font-semibold">

                                        {player.name}

                                    </p>

                                    <p className="text-xs text-white/50">

                                        {player.role}

                                    </p>

                                </div>

                            </div>

                            <div
                                className="
                                    text-cyan-400
                                    font-semibold
                                "
                            >

                                {player.academicPoints} pts

                            </div>

                        </div>

                    ))
            }

        </div>

    );

}

export default Leaderboard;