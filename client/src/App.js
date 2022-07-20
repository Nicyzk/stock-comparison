import './App.css';
import { useSelector } from 'react-redux'
import Home from './containers/Home/Home'
import Screener from './containers/Screener/Screener'
import Export from './containers/Screener/Export/Export'
import Portfolio from './containers/Portfolio/Portfolio'
import Profile from './containers/Profile/Profile'
import BlogPost from './containers/Blog/BlogPost/BlogPost'
import BlogIndex from './containers/Blog/BlogIndex'
import Login from './containers/User/Login/Login'
import SignUp from './containers/User/SignUp/SignUp'
import StatusModal from './components/UI/Modals/StatusModal/StatusModal'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {

  const status = useSelector(state => state.status)

  return (
    <BrowserRouter>
      <div className="App">
        <StatusModal status={status} />
        <Switch>
          <Route path='/screener/export' component={Export} />
          <Route path='/screener' component={Screener} />
          <Route path='/portfolio' component={Portfolio} />
          <Route path='/profile' component={Profile} />
          <Route path='/blog/post' component={BlogPost} />
          <Route path='/blog' component={BlogIndex}/>
          <Route path='/login' component={Login} />
          <Route path='/sign-up' component={SignUp} />
          <Route path='/' exact component={Home} />
          <Route path='/' component={() => <h1>404 Page not found.</h1>} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
