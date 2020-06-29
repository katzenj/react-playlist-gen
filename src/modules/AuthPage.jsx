import { h } from 'preact';
import { Button } from 'src/components/Button';
import { AuthSingleton } from 'src/utils/auth';

import styles from 'src/styles/auth.module.scss';

export const AuthPage = () => {
  const cookie = 'test_cookie_1';

  const setCookie = () => {
    const exp = new Date();
    const time = exp.getTime() + (3600 * 1000);
    exp.setTime(time);
    document.cookie = `spotify_cookie=${cookie}; expires=${exp.toUTCString()};p path="/"`;
  };

  const getSpotifyAuthUrl = () => {
    setCookie();
    const spotifyUrl = AuthSingleton.getAuthorizeUrl();
    window.location.href = `${spotifyUrl}&state=${cookie}`;
  };

  return (
    <div>
      <div className={styles.contentContainer}>
        <h1 className={styles.header}>Generate a Playlist!</h1>
        <Button
          buttonText="Authorize Spotify"
          onClick={() => getSpotifyAuthUrl()}
        />
      </div>
    </div>
  );
};
