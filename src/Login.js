import { useState } from 'react';

// styles
import { useAgoraFunctions } from './agora';
import { setCurrentUser } from './helper';

export default function Login({ setIsLoggedIn }) {
  const [userID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [error, setError] = useState('');

  const { login, register } = useAgoraFunctions({});

  const handleLogin = () => {
    setIsLoading(true);

    login({
      userId: userID,
      pwd: password,
    })()
      .then((val) => {
        setIsLoading(false);
        console.log(val);
        if (val.accessToken) {
          setIsLoggedIn(true);
          setCurrentUser({ _userID: userID, _pwd: password });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        const info = err.data.extraInfo;
        if (info.errDesc) {
          setError(info.errDesc);
        }
        console.error(err);
      });
  };

  const handleRegister = () => {
    setIsLoading(true);

    register({ userID, pwd: password })
      .then((val) => {
        setIsLoading(false);
        console.log(val);
        if (val.error) {
          console.error('Failed to register ', val);
          setError(val.error);
          return;
        }

        const user = val.entities[0];
        if (user.activated && user.username) {
          login({ userId: userID, pwd: password })()
            .then((val) => {
              if (val.accessToken) {
                setIsLoggedIn(true);
                setCurrentUser({ _userID: userID, _pwd: password });
              }
            })
            .catch((err) => console.error(err));
        } else {
          console.error('Something went wrong ', val);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Get Started!</h2>
      <label>
        <span>User ID:</span>
        <input
          required
          type="text"
          onChange={(e) => setUserID(e.target.value)}
          value={userID}
          placeholder="Enter your User ID"
        />
      </label>
      <label>
        <span>Name: (Only for Registration)</span>
        <input
          required
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter your name"
        />
      </label>
      <label>
        <span>Password:</span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Enter your password"
        />
      </label>
      {!isLoading && (
        <button className="btn" onClick={handleLogin}>
          Log in
        </button>
      )}
      {!isLoading && (
        <button
          className="btn"
          style={{ marginLeft: 40 }}
          onClick={handleRegister}
        >
          Register
        </button>
      )}
      {isLoading && (
        <button className="btn" disabled>
          Loading
        </button>
      )}
      {error && error.length > 0 ? <p className="error">{error}</p> : null}
    </form>
  );
}
