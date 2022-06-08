import { BrowserRouter, Route} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard"
import User from "./pages/User"
import Search from "./pages/Search"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Route exact={true} path="/" component={Home}/>
          <Route exact={true} path="/dashboard" component={Dashboard}/>
          <Route exact={true} path="/user" component={User}/>
          <Route exact={true} path="/search" component={Search}/>

        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
