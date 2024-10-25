import { useState } from "react";
import type { Game } from "@/types/Game";
import { title } from "process";

type Props = {
    category: string,
    games: Game[]
}

export const VotingPage = ({games:initialGames, category}:Props) =>{
    const [games, setGames] = useState(initialGames);

    const handleCheck = (id: number) => {
        setGames(prevGames => 
            prevGames.map((game, index) => 
                id === index ? { ...game, check: !game.check } : game
            )
        );
    };

    return(
        <div className="w-5/6 h-5/6 rounded-md flex flex-col justify-self-center">
            <p className="mt-2 mx-auto font-bold italic justify-self-center">{category}</p>
            <ul className="mx-auto">
                {games.map((game, index)=>
                    <li key={index} className={`flex flex-row items-center mt-1 rounded-md border-2 border-solid border-black space-x-2 p-1 active:bg-blue-300 ${game.check ? "bg-green-300" : "bg-none"}`} onClick={e=>handleCheck(index)}>
                            <img className="w-10 h-10" src={`/assets/GameIcons/${game.name.replace(/ /g, '')}.png`} alt={game.name}/>
                            <p>{game.name}</p>
                    </li>
                )}
            </ul>
        </div>
    );
}