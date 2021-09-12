import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Home from './components/Home';
import AddBook from './components/AddBook';

// TODO add linter
// TODO add mobile styles

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="app__navigation">
          <div className="app__navigation__header">
            <Link className="app__navigation__link" to="/">Home</Link>
            <span>Buy ebooks with ETH</span>
          </div>
          <div className="app__navigation__actions">
            <Link className="app__navigation__link" to="/add-book">Add</Link>
            <Link className="app__navigation__link" to="/">Connect</Link>
          </div>
        </nav>

        <Switch>
          <Route path="/add-book">
            <AddBook />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
