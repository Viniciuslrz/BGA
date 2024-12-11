//[ConfirmationModal.tsx]
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { CustomButton } from "./CustomButton";
import type { Game } from "@/types/Game";
import { useState } from "react";

type Props = {
  confirmVote: () => void;
  changeVote: () => void;
  clearVotes: () => void;
  votes: Game[];
  category: string;
};

export const ConfirmationModal = ({
  confirmVote,
  changeVote,
  clearVotes,
  votes,
  category,
}: Props) => {
  const [isProcessing, setIsProcessing] = useState(false); // Track loading state

  const saveVotesToFirestore = async () => {
    if (isProcessing) return; // Prevent multiple submissions
    setIsProcessing(true); // Set processing state

    try {
      await addDoc(collection(db, "votes"), {
        category,
        votes: votes.map(({ id, name }) => ({ id, name })),
        timestamp: new Date().toISOString(),
      });
      clearVotes(); // Reset votes after successful submission
      confirmVote(); // Move to the next page
    } catch (error) {
      console.error("Error saving votes:", error);
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  return (
    <div className="fixed left-0 top-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
      <div className="w-4/6 rounded-md flex flex-col bg-orange-300 p-2">
        <p className="mt-2 mx-auto justify-self-center">Confirmar seus votos?</p>
        <div className="h-4/6">
          <ul className="mx-auto">
            {votes.map((game, index) => (
              <li
                key={index}
                className={`flex flex-row items-center mt-1 rounded-md border-2 border-solid border-black space-x-2 p-1 active:bg-blue-300 ${
                  game.check ? "bg-green-300" : "bg-none"
                }`}
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
        <div className="flex space-x-2 mx-auto my-2">
          <CustomButton className="active:bg-red-400" label="Corrigir" onClick={changeVote} />
          <CustomButton
            label={isProcessing ? "Processando" : "Confirmar"}
            onClick={saveVotesToFirestore}
            className={isProcessing ? "opacity-50 cursor-not-allowed" : ""}
            disabled={isProcessing} // Disable button during processing
          />
        </div>
      </div>
    </div>
  );
};
