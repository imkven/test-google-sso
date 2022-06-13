import './App.css';
import { useState } from 'react';
import { GoogleLogin } from 'react-google-login';

function App() {
  const [loginData, setLoginData] = useState({});
  const [profileData, setProfileData] = useState({});

  const handleFailure = (response) => {
    console.error(response);
  };
  
  const handleLogin = async (googleData) => {
    try {
      const body = JSON.stringify({
        credentials: googleData.tokenObj,
        email: googleData.profileObj.email,
      });
      const res = await fetch('http://localhost:8080/v1/auths/login-with-google', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.accessToken) {
        setProfileData({
          email: data.email,
          picture: data.photo,
          name: data.name,
        });
        setLoginData({ token: data.accessToken });
        localStorage.setItem('loginData', JSON.stringify(data));
      } else {
        setProfileData({});
        setLoginData({});
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
    
  };

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData({});
    setProfileData({});
  };

  return (
    <div className="App">
      {loginData.token && profileData.name ? (
        <div>
          <h3>Hi, {profileData.name}</h3>
          <p>You logged in as {profileData.email}</p>
          <div><img alt={profileData.name} src={profileData.picture} /></div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <GoogleLogin
          clientId="1071906176247-r40lprs44tr9364ic4gre0i97358vcsi.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={handleLogin}
          onFailure={handleFailure}
          cookiePolicy={'single_host_origin'}
        />
      )}      
    </div>
  );
}

export default App;
