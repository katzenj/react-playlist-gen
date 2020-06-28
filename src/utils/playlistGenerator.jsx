import { AuthSingleton } from 'src/utils/auth';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const TRACKS_TO_PULL = 5;

class PlaylistGenerator {
  constructor() {
    this.spotifyUserId = process.env.SPOTIFY_USER_ID;
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
    const artistTracksUrl = `${SPOTIFY_BASE_URL}/artists/${artistId}/top-tracks?country=US`
    const response = await fetch(artistTracksUrl, {method: 'GET', headers: AuthSingleton.getAuthHeaders()});
    const responseJson = await response.json();

    return responseJson['tracks'].map((track) => track['uri']).slice(0, TRACKS_TO_PULL);
  }

  async getRecommendedTracksForArtist(artistIds) {
    const recommendationsUrl = `${SPOTIFY_BASE_URL}/recommendations?seed_artists=${artistIds.join(',')}&market=US`
    const response = await fetch(recommendationsUrl, {method: 'GET', headers: AuthSingleton.getAuthHeaders()});
    const responseJson = await response.json();

    return responseJson['tracks'].map((track) => track['uri']);
  }

  async addSongsToPlaylist(playlistId, artists) {
    const playlistUrl = `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`;
    const songUris = [];
    const artistIds = [];
  
    for (const artist of artists) {
      const artistId = await this.getArtist(artist);
      artistIds.push(artistId);
      
      const songsForArtist = await this.getSongsForArtist(artistId);
      songUris.push(songsForArtist);
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
