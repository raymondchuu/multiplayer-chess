import React, { useState } from 'react';
import Navbar from './Navbar';
import Lobby from './Game/Lobby';
import Join from './Game/Join';
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
