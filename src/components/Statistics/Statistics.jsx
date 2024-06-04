import { getGames, getGamesWithResult, getRandomGame } from '@/lib/data';
import Link from 'next/link';
import Navbar from '../navbar';
import './statistics.css';

export default async function Statistics() {
    const games = await getGames();
    const gamesWithResult = games.filter(game => game.result);
    const randomGame = await getRandomGame();

    const RandomGame = () => {
        if (games.length === 0) {
            return <p>There are no games yet.</p>;
        }

        return (
            <div className='statistics__randomGame'>
                <h2 className='statistics__secondaryTitle'>Random game:</h2>
                <div>
                    <h2>{randomGame.name}</h2>
                    {
                        randomGame.result
                            ? <p>Winner: {randomGame.result}</p>
                            : <p>Game is not over yet. <br />
                                <Link href={`/gamePage/${randomGame.id}`} className="statistic__joinButton">Join</Link>
                            </p>
                    }
                </div>
            </div>
        );
    };
    
    const playerFrequency = games.reduce((acc, game) => {
        if (game.result) {
            if (acc[game.result]) {
                acc[game.result] += 1;
            } else {
                acc[game.result] = 1;
            }
        }
        return acc;
    }, {});

    const maxWins = Math.max(...Object.values(playerFrequency));

    const bestPlayers = Object.keys(playerFrequency).filter(player => playerFrequency[player] === maxWins);

    const minWins = Math.min(...Object.values(playerFrequency));

    const worstPlayers = Object.keys(playerFrequency).filter(player => playerFrequency[player] === minWins);

  return (
    <>
        <Navbar />
        <div className='statistics__wrapper'>
            <h1 className='statistics__mainTitle'>Statistics</h1>

            <RandomGame />

            <div className='statistics__completedGames'>
            <h2 className='statistics__secondaryTitle'>Completed games</h2>
                <div className="statistics__completedGames-inner">
                    
                    {
                        gamesWithResult.map((g) => (
                            <div key={g.id}>
                                <h2 className='font-bold'>Game: <span className='font-normal'>{g.name}</span></h2>
                                <p>{g.result === 'draw' ? 'Result' : 'Winner'}: {g.result}</p>
                                <br />
                            </div>
                        ))
                    }
                </div>
            </div>

        <div className='statistics__bestPlayers'>
            <h2 className='statistics__secondaryTitle'>Best players</h2>
            <ul>
                {bestPlayers.map(player => (
                    player !== 'draw' &&
                    <li key={player}>{player} - {playerFrequency[player]} {playerFrequency[player] === 1 ? 'win' : 'wins'}</li>
                ))}
            </ul>
        </div>

        <div className='statistics__worstPlayers'>
            <h2 className='statistics__secondaryTitle'>Worst players</h2>
            <ul>
                {worstPlayers.map(player => (
                    player !== 'draw' &&
                    <li key={player}>{player} - {playerFrequency[player]} {playerFrequency[player] === 1 ? 'win' : 'wins'}</li>
                ))}
            </ul>
        </div>
            <Link href="/dashboard" className='statistics__viewAllGamesButton'>View available games</Link>
        </div>
    </>
  )
}

