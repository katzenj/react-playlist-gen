import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { Button } from 'src/components/Button';
import { CustomSlider } from 'src/components/CustomSlider';
import { InputGroup } from 'src/components/InputGroup';

import { AuthSingleton } from 'src/utils/auth';
import { PlaylistGeneratorSingleton } from 'src/utils/playlistGenerator';

import styles from 'src/styles/playlistGenerator.module.scss';


export const GeneratorPage = () => {
  const [playlistTitle, setPlaylistTitle] = useState(null);
  const [artists, setArtists] = useState(null);
  const [songs, setSongs] = useState(null);
  const [playlistData, setPlaylistData] = useState({ userId: null, playlistIds: [] });
  const [isLoading, setIsLoading] = useState(false);

  const [danceability, setDanceability] = useState(5)
  const [energy, setEnergy] = useState(5)

  const getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&#]' + name + '=([^&#]*)');
    var results = regex.exec(location.hash);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  const createPlaylist = async (createPlaylistData) => {
    const { playlistId, userId } = await PlaylistGeneratorSingleton.createPlaylist(playlistTitle);
    const playlistIds = playlistData.playlistIds;
    playlistIds.push(playlistId);
    const artists = createPlaylistData.artists.split(',').map((artist) => artist.trim());
    PlaylistGeneratorSingleton.addSongsToPlaylist(playlistId, artists);

    setPlaylistData({userId, playlistIds});
    setIsLoading(false);
  };

  useEffect(() => {
    AuthSingleton.setAccessToken(getUrlParameter('access_token'), new URLSearchParams(location.hash));
  }, []);

  const createPlaylistUrl = (playlistId) => (
    `https://open.spotify.com/embed/user/${playlistData.userId}/playlist/${playlistId}`
  );

  return (
    <div>
      <div className={styles.contentContainer}>
        <h1 className={styles.header}>Generate a Playlist!</h1>
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <FontAwesomeIcon
              className={styles.spinner}
              icon={faCircleNotch}
              spin
              size="4x"
            />
          </div>
        ) : (
          <div className={styles.playlistInputsContainer}>
            <InputGroup
              name="playlist-title"
              placeholder="Playlist Title"
              onChange={setPlaylistTitle}
            />
            <InputGroup
              name="artists"
              placeholder="Artists"
              onChange={setArtists}
            />
            <InputGroup
              name="songs"
              placeholder="Songs"
              onChange={setSongs}
            />
            <div className={styles.slidersContainer}>
              <CustomSlider label="Danceability 🕺" setValue={setDanceability} />
              <CustomSlider label="Energy ⚡️" setValue={setEnergy} />
            </div>
            <Button
              buttonText="Create a Playlist"
              disabled={artists === null || artists === ""}
              onClick={() => createPlaylist({ playlistTitle, artists, songs })}
            />
          </div>
        )}
        <div className={styles.embedContainer}>
          {playlistData.playlistIds.length > 0 &&
            playlistData.playlistIds.map((id) => (
              <iframe
                className={styles.spotifyEmbed}
                key={id}
                id={`playlist-${id}-iframe`}
                src={createPlaylistUrl(id)}
                width="300"
                height="500"
                frameBorder="0"
                allowtransparency="true"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

