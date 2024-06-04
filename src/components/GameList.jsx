import React from 'react';
import Link from 'next/link';
import { getAvailableGames } from '@/lib/data';

export default async function GameList() {
  const games = await getAvailableGames();

  return (
    <div className='bg-gray-200'>
      <div className='max-w-4xl m-auto'>
        <div className="flex flex-col-reverse gap-1.5 pb-10">
          {games.map((g) => (
            <div key={g.id} className="p-2 border border-gray-300 rounded-lg bg-white">
              <li className="flex items-center justify-between">
                <div>{g.name}</div>
                <Link href={`/gamePage/${g.id}?name=${g.name}`} className="rounded-lg text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2">Join</Link>
              </li>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
