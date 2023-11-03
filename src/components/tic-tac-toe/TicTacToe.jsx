  import React, { useRef, useState, useEffect } from 'react';
  import './TicTacToe.css';
  import { GoogleLoginButton } from 'react-social-login-buttons';
  import { auth, signOut, signInWithPopup, googleAuthProvider, setPersistence, browserLocalPersistence, database, ref, push, remove } from '../firebase';
  import { Button } from '@mui/material';
  import c_icon from '../Assets/circle.png';
  import x_icon from '../Assets/cross.png';


  const TicTacToe = () => {
    const [user, setUser] = useState(null);
    const [gameResult, setGameResult] = useState('ongoing');
    const [lock, setlock] = useState(false);  // lock the board after game ends

    const [gameState, setGameState] = useState({
      cells: ['', '', '', '', '', '', '', '', ''],
      isXNext: true,
    });
    const titleRef = useRef(null);

    // Configure FirebaseUI.
    useEffect(() => {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          // Now, configure Firebase for persistent login
          if (auth.currentUser) {
            setUser(auth.currentUser);
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    }, []);

    const handleGoogleSignIn = () => {
      signInWithPopup(auth, googleAuthProvider)
        .then((result) => {
          const user = result.user;
          setUser(user);
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    };

    const handleGoogleSignOut = () => {
      signOut(auth)
        .then(() => {
          setUser(null);
        })
        .catch((error) => {
          alert(error.message);
        });
    };

    const handleCellClick = (index) => {
      const { cells, isXNext } = gameState;
      if (cells[index] !== '' || gameResult !== 'ongoing'|| lock) {
        return;
      }
    
      const updatedCells = [...cells];
      updatedCells[index] = isXNext ? x_icon : c_icon;
    
      setGameState({
        cells: updatedCells,
        isXNext: !isXNext,
      });
    
      push(ref(database, 'games/game_id/state'), {
        cells: updatedCells,
        isXNext: !isXNext,
      });
    
      checkWin(updatedCells);
    };
    
    const reset = () => {
      setGameState({
        cells: ['', '', '', '', '', '', '', '', ''],
        isXNext: true,
      });
    
      // Reset the lock state to false
      setlock(false);
    
      // Remove the game from the database
      remove(ref(database, 'games'));
      // Reset the game result
      setGameResult('ongoing');
    
      // Change the title to the original
      titleRef.current.innerHTML = 'Tic Tac Toe';
    };
   
   
    const checkWin = (updatedCells) => {
      // Define win combinations
      const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
    
      for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (updatedCells[a] && updatedCells[a] === updatedCells[b] && updatedCells[a] === updatedCells[c]) {
          // set the game result in if condition
          const userEmail = auth.currentUser ? auth.currentUser.email : '';
          // get email till @ 
          const email = userEmail.split('@');
          // get the first part of email
          const name = email[0];
          // set the game result
          setGameResult(`${name} won`);
          // Change the title to the winner
          titleRef.current.innerHTML = `${name} won`;

          setlock(true);
          return;
        }
      }
    
      if (updatedCells.every((cell) => cell !== '')) {
        setGameResult('Draw');
        setlock(true);
      }
    };
    
    

    
    return (
      <>
        <Button className="logout" onClick={handleGoogleSignOut} style={{ display: user ? 'block' : 'none' }}>
          Logout
        </Button>
        {user ? (
          <div className="container">
            <h1 className="title" ref={titleRef}>
              {gameResult === 'ongoing' ? 'Tic Tac Toe' : gameResult}
              </h1>
            <div className="board">
              <div className="row1">
              <div className="boxes" onClick={() => handleCellClick(0)}>
                {gameState.cells[0] && <img src={gameState.cells[0]} alt="X or O" />}
              </div>
              <div className="boxes" onClick={() => handleCellClick(1)}>
                {gameState.cells[1] && <img src={gameState.cells[1]} alt="X or O" />}
              </div>
              <div className="boxes" onClick={() => handleCellClick(2)}>
                {gameState.cells[2] && <img src={gameState.cells[2]} alt="X or O" />}
              </div>
              </div>
              <div className="row2">
              <div className="boxes" onClick={() => handleCellClick(3)}>
                    {gameState.cells[3] && <img src={gameState.cells[3]} alt="X or O" />}
                  </div>
                  <div className="boxes" onClick={() => handleCellClick(4)}>
                    {gameState.cells[4] && <img src={gameState.cells[4]} alt="X or O" />}
                  </div>
                  <div className="boxes" onClick={() => handleCellClick(5)}>
                    {gameState.cells[5] && <img src={gameState.cells[5]} alt="X or O" />}
                  </div>
              </div>
              <div className="row3">
              <div className="boxes" onClick={() => handleCellClick(6)}>
                      {gameState.cells[6] && <img src={gameState.cells[6]} alt="X or O" />}
                    </div>
                    <div className="boxes" onClick={() => handleCellClick(7)}>
                      {gameState.cells[7] && <img src={gameState.cells[7]} alt="X or O" />}
                    </div>
                    <div className="boxes" onClick={() => handleCellClick(8)}>
                      {gameState.cells[8] && <img src={gameState.cells[8]} alt="X or O" />}
                    </div>
              </div>
            </div>
            <button className="reset" onClick={reset}>
              Reset
            </button>
          </div>
        ) : (
          // User is not logged in, display a message or login button
          <div className="login-message">
            <GoogleLoginButton className="gbtn" onClick={handleGoogleSignIn} style={{ display: user ? 'none' : 'block', width: '300px' }}>
              Sign in with Google to play
            </GoogleLoginButton>
          </div>
        )}
      </>
    );
  };

  export default TicTacToe;
