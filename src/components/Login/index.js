import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {user: '', pin: '', errorMsg: '', showError: false}

  onChangeUserId = event => {
    this.setState({user: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  submitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {user, pin} = this.state
    const userDetails = {user_id: user, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',

      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {user, pin, errorMsg, showError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="card-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="website-logo"
            />
          </div>

          <div className="form-container">
            <h1 className="head">Welcome Back!</h1>
            <form className="form-input-container" onSubmit={this.submitForm}>
              <label className="label" htmlFor="user">
                User ID
              </label>
              <input
                type="text"
                className="input"
                id="user"
                placeholder="Enter User ID"
                value={user}
                onChange={this.onChangeUserId}
              />
              <label htmlFor="pin" className="label">
                PIN
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter PIN"
                id="pin"
                value={pin}
                onChange={this.onChangePin}
              />
              <button className="button" type="submit">
                Login
              </button>
              {showError === true && <p className="error">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default Login
