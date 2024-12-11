//[VotingPAge.ts]
import { useState, useEffect } from "react";
import type { Game } from "@/types/Game";

type Props = {
  pagenumber: number;
  category: string;
  games: Game[];
  updateVotes: (votes: Game[]) => void;
  setErrorModal: (errorModal: boolean) => void;
};

export const VotingPage = ({
  games: initialGames,
  category,
  pagenumber,
  updateVotes,
  setErrorModal,
}: Props) => {
  const [games, setGames] = useState<Game[]>([]);

  // Reset the game selections whenever the component mounts
  useEffect(() => {
    setGames(initialGames.map((game) => ({ ...game, check: false })));
  }, [initialGames]);

  const handleCheck = (id: number) => {
    const updatedGames = games.map((game, index) =>
      id === index ? { ...game, check: !game.check } : game
    );
    setGames(updatedGames);
    const votes = updatedGames.filter((game) => game.check === true);
    updateVotes(votes);
  };

  return (
    <div
      className={`w-5/6 rounded-md my-2 pb-2 flex flex-col justify-self-center ${
        pagenumber === 1
          ? "bg-blue-300"
          : pagenumber === 2
          ? "bg-yellow-300"
          : "bg-red-300"
      }`}
    >
      <p className="mt-2 mx-auto font-bold italic justify-self-center">{category}</p>
      <ul className="mx-auto">
        {games.map((game, index) => (
          <li
            key={index}
            className={`flex flex-row items-center mt-1 rounded-md border-2 border-solid border-black space-x-2 p-1 active:bg-blue-300 ${
              game.check ? "bg-green-300" : "bg-none"
            }`}
            onClick={() => handleCheck(index)}
          >
            <img
              className="w-10 h-10"
              src={`https://raw.githubusercontent.com/Viniciuslrz/BGA/refs/heads/githubpages/public/assets/GameIcons/${game.name.replace(/ /g, "")}.png`}
              alt={game.name}
            />
            <p>{game.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};