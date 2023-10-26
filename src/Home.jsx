import React from 'react';

function Home({onGameStart}) {
    return (
        <div className='home'>
            <h1>Welcome to my Science Fiction Image Puzzle!</h1>
            <h2>Press the Start Button when your Ready</h2>
            <button onClick={onGameStart}>Start Game</button>
        </div>
    );
}

export default Home;
