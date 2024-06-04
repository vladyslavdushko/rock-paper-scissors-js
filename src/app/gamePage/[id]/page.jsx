"use client"

import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { useSession } from "next-auth/react";
import Image from "next/image";
import rock from '../../../images/rock-user.png';
import paper from '../../../images/paper-user.png';
import scissors from '../../../images/scissors-user.png';
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

const socket = io('https://node-server-0i65.onrender.com');

const GamePage = ({ params }) => {
  const { data: session } = useSession();
  const [players, setPlayers] = useState({});
  const [choice, setChoice] = useState(null);
  const [result, setResult] = useState(null);
  const { id: gameId } = params; 

  const parameters = useSearchParams();
  const gameName = parameters.get('name');
 

  useEffect(() => {
    if (session?.user?.name && gameId) {
      socket.emit('joinGame', { gameId, playerName: session.user.name });

      socket.on('players', (gamePlayers) => {
        setPlayers(gamePlayers);
      });

      socket.on('result', (gameResult) => {
        setResult(gameResult);
      });

      socket.on("disconnect", () => {
        console.log('User left game');
      });

      const handleBeforeUnload = () => {
        socket.emit('disconnectUser');
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('unload', handleBeforeUnload);

      return () => {
        socket.off('players');
        socket.off('result');
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('unload', handleBeforeUnload);
      };
    }
  }, [session, gameId]);

  const makeChoice = (playerChoice) => {
    setChoice(playerChoice);
    socket.emit('makeChoice', playerChoice);
  };

  return (
    <>
      <Navbar />
      <div className="m-4">
        <div className="grid place-items-center">
          <h1>{gameName}</h1>
        </div>
        <div className="flex justify-center items-center m-5">
        {Object.values(players).slice(0, 2).map((player, index) => (
          <div key={player.id} className="flex items-center">
            {index === 1 && <span className="mx-2 font-normal"> VS </span>}
            <span className="font-bold">{player.name}</span>
          </div>
        ))}
      </div>
        
        <div className="flex flex-col justify-evenly m-5">
          <h2 className="text-center m-4">Choose!</h2>
          <div className="flex justify-evenly">
            <button onClick={() => makeChoice('rock')}><Image src={rock} alt="rock" height={200} width={200} /></button>
            <button onClick={() => makeChoice('paper')}><Image src={paper} alt="paper" height={200} width={200} /></button>
            <button onClick={() => makeChoice('scissors')}><Image src={scissors} alt="scissors" height={200} width={200} /></button>
          </div>
        </div>
        {result && <div className="result">Result: {result}</div>}
        <Link href='/dashboard' legacyBehavior>
      <a 
        onClick={() => socket.emit('disconnectUser')}
        className="mt-5 inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
      >
        Back
      </a>
    </Link>
      </div>
      
     
    </>
  );
};

export default GamePage;


