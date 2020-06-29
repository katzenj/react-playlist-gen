import { h } from 'preact';
import Router from 'preact-router';

import { AuthPage } from 'src/modules/AuthPage';
import { GeneratorPage } from 'src/modules/GeneratorPage';

const App = () => {
  return (
    <Router>
      <AuthPage path = "/" />
      <GeneratorPage path = "/spotify_callback" />
    </Router>
  );
};

export default App;
