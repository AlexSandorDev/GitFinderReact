import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import UsersList from './components/users/UsersList'
import User from './components/users/User'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import About from './components/pages/About'
import axios from 'axios'
import "./App.css";

class App extends Component 
{
  //#region Functions
  state =
    {
      users: [],
      user: {},
      repos: [],
      loading: false,
      alert: null
    }

  // async componentDidMount() 
  // { 
  //   this.setState({ loading: true })

  //   const res =
  //     await axios.get(
  //       `https://api.github.com/users?
  //       client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
  //       &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
  //     )

  //   this.setState({ users: res.data, loading: false })
  // }

  searchUsers = async (text) =>
  {
    this.setState({ loading: true })

    const res =
      await axios.get(
        `https://api.github.com/search/users?q=${text}&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      )

    this.setState({ users: res.data.items, loading: false })
  }

  clearUsers = () =>
  {
    this.setState({
      users: [],
      loading: false
    });
  }

  setAlert = (msg, type) =>
  {
    this.setState({ alert: { msg, type } });
    setTimeout(() =>
    {
      this.setState({ alert: null })
    }, 3000);
  }

  getUser = async (username) =>
  {
    this.setState({ loading: true })

    const res =
      await axios.get(
        `https://api.github.com/users/${username}?
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );

    this.setState({ user: res.data, loading: false })
  }

  getUserRepos = async (username) =>
  {
    this.setState({ loading: true })

    const res =
      await axios.get(
        `https://api.github.com/users/${username}
        /repos?per_page=5&sort=created:asc
        &client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
        &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );

    this.setState({
      repos: res.data,
      loading: false
    })
  }
  //#endregion

  render()
  {
    const { users, user, repos, loading } = this.state;

    return (
      <Router>
        <nav className="app">
          <Navbar title='Github Finder' icon='fab fa-github' />
          <div className="container">
            <Alert alert={this.state.alert} />

            <Switch>
              <Route exact path='/'
                render={props => (

                  <Fragment>

                    <Search
                      //#region Components
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    //#endregion
                    />

                    <UsersList loading={loading} users={users} />

                  </Fragment>

                )}
              />

              <Route exact path='/about' component={About} />

              <Route exact path='/user/:login' render={props =>
              (
                <User
                  {...props}
                  getUser={this.getUser}
                  getUserRepos={this.getUserRepos}
                  repos={repos}
                  user={user}
                  loading={loading}
                />
              )}
              />
            </Switch>
          </div>
        </nav>
      </Router>
    );
  }
}

export default App;
