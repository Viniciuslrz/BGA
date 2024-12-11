//[ResultsPage.tsx]
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import type { Game } from "@/types/Game";

type AggregatedResults = {
  category: string;
  games: { name: string; votes: number }[];
};

export const ResultsPage = () => {
  const [results, setResults] = useState<AggregatedResults[]>([]);

  useEffect(() => {
    // Set up real-time listener
    const unsubscribe = onSnapshot(collection(db, "votes"), (snapshot) => {
      const votesByCategory: Record<string, Record<string, number>> = {};

      snapshot.forEach((doc) => {
        const { category, votes } = doc.data();
        if (!votesByCategory[category]) {
          votesByCategory[category] = {};
        }
        votes.forEach((vote: Game) => {
          if (!votesByCategory[category][vote.name]) {
            votesByCategory[category][vote.name] = 0;
          }
          votesByCategory[category][vote.name]++;
        });
      });

      const aggregatedResults: AggregatedResults[] = Object.entries(votesByCategory).map(
        ([category, games]) => ({
          category,
          games: Object.entries(games).map(([name, votes]) => ({ name, votes })),
        })
      );

      setResults(aggregatedResults);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold">Resultados</h1>
      {results.map((result) => (
        <div
          key={result.category}
          className={`my-1 w-5/6 rounded-md border-2 border-solid border-black p-2 flex flex-col items-center ${
            result.category == "Fogo de Palha do Ano"
              ? "bg-blue-300"
              : result.category == "Tocha Olímpica"
              ? "bg-yellow-300"
              : "bg-red-300"
          }`}
        >
          <h2 className="text-lg text-center font-semibold">{result.category}</h2>
          <ul>
            {result.games.map((game, index) => (
              <li
                key={index}
                className={`flex flex-row items-center mt-1 rounded-md border-2 border-solid border-black space-x-2 p-1`}
              >
                <img
                  className="w-10 h-10"
                  src={`${process.env.PUBLIC_URL}/assets/GameIcons/${game.name.replace(/ /g, "")}.png`}
                  alt={game.name}
                />
                <p>
                  {game.name}: <b>{game.votes} {game.votes>1?"votos":"voto"}</b>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
