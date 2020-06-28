import addSeconds from 'date-fns/addSeconds'

const OAUTH_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';

class SpotifyOAuth {
  constructor(clientId, clientSecret, redirectUri, scope) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.scope = scope;
    this.accessToken = null;
    this.expirationTime = null;
  }

  isTokenExpired() {
    const now = Date.now();
    return this.expirationTime !== null && this.expirationTime < now;
  }

  getAuthorizeUrl() {
    const responseType = 'token';
    return `${OAUTH_AUTHORIZE_URL}?response_type=` + responseType + '&client_id=' +
      encodeURIComponent(this.clientId) +
       '&redirect_uri=' + encodeURIComponent(this.redirectUri) + 
       '&scope=' + encodeURIComponent(this.scope);
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken
    }
  }

  setAccessToken(token, params) {
    this.accessToken = token;
    this.tokenType = params.get('token_type');
    this.expirationTime = addSeconds(new Date(), params.get('expires_in') || 0);
  }

  getAccessToken() {
    if (this.accessToken !== null && !this.isTokenExpired()) {
      return this.accessToken;
    }
    window.location.href = `${this.getAuthorizeUrl()}&state=${cookie}`;
  }
}


export const AuthSingleton = new SpotifyOAuth(
  process.env.CLIENT_ID, 
  process.env.CLIENT_SECRET, 
  'http://localhost:8080/spotify_callback',
  'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative'
);
