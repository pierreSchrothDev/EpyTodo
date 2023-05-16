import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './splash.css';
import axios from 'axios'

export default function Splash() {

  const navigate = useNavigate()

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeFirstname = (event) => {
    setFirstname(event.target.value);
  };

  const login = async (event) => {
    event.preventDefault();
    await axios.post('http://localhost:4444/login', {
      email: email,
      password: password
    })
    .then(function (response) {
      if (response.data.token) {
        navigate("/home", {
          state: {
            userToken: response.data.token,
          }
        });
      }
      else {
        window.alert(response.data.msg)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const signup = async (event) => {
    event.preventDefault()
    await axios.post('http://localhost:4444/register', {
      email: email,
      name: name,
      firstname: firstname,
      password: password
    })
    .then(function (response) {
      if (response.data.token) {
        window.alert('New user created !')
      }
      else {
        window.alert(response.data.msg)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div class="main">
      <input type="checkbox" id="chk" aria-hidden="true"/>
      <div class="signup">
        <form>
          <label for="chk" aria-hidden="true">Sign up</label>
          <input type="text" name="txt" placeholder="User name" required="" onChange={handleChangeName}/>
          <input type="text" name="txt" placeholder="User firstname" required="" onChange={handleChangeFirstname}/>
          <input type="email" name="email" placeholder="Email" required="" onChange={handleChangeEmail}/>
          <input type="password" name="pswd" placeholder="Password" required="" onChange={handleChangePassword}/>
          <button class="button1" onClick={signup}>Sign up</button>
        </form>
      </div>
      <div class="login">
        <form>
          <label for="chk" aria-hidden="true">Login</label>
          <input type="email" name="email" placeholder="Email" required="" onChange={handleChangeEmail}/>
          <input type="password" name="pswd" placeholder="Password" required="" onChange={handleChangePassword}/>
          <button class="button1" onClick={login}>Login</button>
        </form>
      </div>
    </div>
  );
}
