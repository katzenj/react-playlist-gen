import { AuthSingleton } from 'src/utils/auth';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const TRACKS_TO_PULL = 5;

class PlaylistGenerator {
  constructor() {
    this.spotifyUserId = process.env.SPOTIFY_USER_ID;
  }

  buildUrl(params) {
    return `${SPOTIFY_BASE_URL}/${params}`;
  }

  async createPlaylist(title) {
    const playlistUrl = `${SPOTIFY_BASE_URL}/users/${this.spotifyUserId}/playlists`;
    const response = await fetch(playlistUrl, {
      method: 'POST',
      headers: AuthSingleton.getAuthHeaders(),
      body:JSON.stringify({name: title, description: 'This is a playlist', public: false}),
    });
    const responseJson = await response.json(); 
    return { playlistId: responseJson['id'], userId: responseJson['owner']['id'] };
  }

  async getArtist(artistName) {
    const formattedName = artistName.trim().replace(' ', '+');
    const artistUrl = `${SPOTIFY_BASE_URL}/search?q=${formattedName}&type=artist`;
    const response = await fetch(artistUrl, {method: 'GET', headers: AuthSingleton.getAuthHeaders()});
    const responseJson = await response.json();
    const artists = responseJson['artists']

    return (artists['items'] && artists['items'].length > 0) ? artists['items'][0]['id'] : null;
  }

  async getSongsForArtist(artistId) {
    const artistTracksUrl = this.buildUrl(`artists/${artistId}/top-tracks?country=US`);
    const response = await fetch(artistTracksUrl, {method: 'GET', headers: AuthSingleton.getAuthHeaders()});
    const responseJson = await response.json();

    return responseJson['tracks'].map((track) => ({uri: track['uri'], id: track['id']})).slice(0, TRACKS_TO_PULL);
  }

  async getRecommendedTracksForArtist(artistIds) {
    const recommendationsUrl = this.buildUrl(`recommendations?seed_artists=${artistIds.join(',')}&market=US`)
    const response = await fetch(recommendationsUrl, {method: 'GET', headers: AuthSingleton.getAuthHeaders()});
    const responseJson = await response.json();

    return responseJson['tracks'].map((track) => track['uri']);
  }

  async getAudioFeaturesForTracks(trackIds) {
    const audioFeaturesUrl = this.buildUrl(`audio-features/?ids=${trackIds.slice(1,25).join(',')}`)
    const response = await fetch(audioFeaturesUrl, {method: 'GET', headers: AuthSingleton.getAuthHeaders()});
    const responseJson = await response.json();
    console.log(responseJson);
  }

  async addSongsToPlaylist(playlistId, artists) {
    const playlistUrl = this.buildUrl(`playlists/${playlistId}/tracks`)
    const songUris = [];
    const artistIds = [];
    const songIds = [];
  
    for (const artist of artists) {
      const artistId = await this.getArtist(artist);
      artistIds.push(artistId);
      
      const songsForArtist = await this.getSongsForArtist(artistId);
      songUris.push(songsForArtist.map((data) => data.uri));
      songIds.push(songsForArtist.map((data) => data.id));
    }

    const recommended = await this.getRecommendedTracksForArtist(artistIds);
    songUris.push(recommended);

    fetch(playlistUrl, {
      method: 'POST',
      headers: AuthSingleton.getAuthHeaders(),
      body: JSON.stringify(songUris.flat())
    });
  }
}

export const PlaylistGeneratorSingleton = new PlaylistGenerator();
