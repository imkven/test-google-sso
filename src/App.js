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
    console.log('googleData', googleData);
    const res = await fetch('http://localhost:3001/login-with-google', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenObj,
        tokenId: googleData.tokenId,
        accessToken: googleData.accessToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (data.loggedIn) {
      setProfileData(data.profile);
      setLoginData({ token: googleData.tokenId });
      localStorage.setItem('loginData', JSON.stringify(data));
    } else {
      setProfileData({});
      setLoginData({});
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
          clientId="xxxxxxxxxxxx.apps.googleusercontent.com"
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
