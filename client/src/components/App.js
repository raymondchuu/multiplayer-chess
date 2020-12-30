import React, { useState } from 'react';
import Game from './Game';
import Navbar from './Navbar';
import Lobby from './Lobby';
import Join from './Join';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import '../App.css';

const App = () => {
  const [username, setUsername] = useState('');

  return (
    <Router>
      <Navbar />
      <Route path='/' exact>
        <Join setUsername={setUsername} username={username} />
      </Route>
      <Route path="/game/:gameId" exact>
        <Lobby username={username} setUsername={setUsername} />
      </Route>
    </Router>
  )
};

export default App;
