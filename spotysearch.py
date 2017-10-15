from functools import wraps
from flask import Flask, request, redirect, g, render_template, session, jsonify
from flask.ext.session import Session
import requests
import base64
import urllib
import json

# Authentication Steps, paramaters, and responses are defined at https://developer.spotify.com/web-api/authorization-guide/
# Visit this url to see all the steps, parameters, and expected response. 


app = Flask(__name__)

app.SECRET_KEY = "ZWxtGUUKSQPqs2Ev3Wp7kRaSySZW8.qZ2hdXcDR8KwQvn5KmuVHdcDuYmmtDbtZG"
app.config['SESSION_TYPE'] = 'filesystem'

Session(app)

#  Client Keys
CLIENT_ID = "9be3f39c9eef41b5b62916b8e443d952"
CLIENT_SECRET = "0c9a0171d080410887e4715d620ce0ae"

# Spotify URLS
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)


# Server-side Parameters
CLIENT_SIDE_URL = "http://127.0.0.1"
PORT = 5000
REDIRECT_URI = "{}:{}/callback/q".format(CLIENT_SIDE_URL, PORT)
SCOPE = "" #"playlist-modify-public playlist-modify-private"
STATE = ""
SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()


auth_query_parameters = {
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPE,
    # "state": STATE,
    # "show_dialog": SHOW_DIALOG_str,
    "client_id": CLIENT_ID
}

def getAuthURL():
    url_args = "&".join(["{}={}".format(key,urllib.quote(val)) for key,val in auth_query_parameters.iteritems()])
    return "{}/?{}".format(SPOTIFY_AUTH_URL, url_args)

def access_token_required(f):
    """ID in request must match a Supplier in order to follow the route"""
    @wraps(f)
    def deco_f(*args, **kwargs):

        if session.get('access_token', None) is None:
            return redirect(getAuthURL())
        
        return f(*args, **kwargs)

    return deco_f


@app.route("/")
def index():
    return redirect("/search", code=302)

@app.route("/search", methods=['GET'])
@access_token_required
def home():
    return render_template("index.html", access_token=session.get('access_token'))

@app.route("/favorites", methods=['GET'])
def favorites():
    return render_template("favorites.html")


@app.route("/callback/q")
def callback():
    # Auth Step 4: Requests refresh and access tokens
    auth_token = request.args['code']
    code_payload = {
        "grant_type": "authorization_code",
        "code": str(auth_token),
        "redirect_uri": REDIRECT_URI
    }
    base64encoded = base64.b64encode("{}:{}".format(CLIENT_ID, CLIENT_SECRET))
    headers = {"Authorization": "Basic {}".format(base64encoded)}
    post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload, headers=headers)

    # Auth Step 5: Tokens are Returned to Application
    response_data = json.loads(post_request.text)

    # store access token in session
    session['access_token'] = response_data["access_token"]
    session['refresh_token'] = response_data["refresh_token"]
    session['token_type'] = response_data["token_type"]
    session['expires_in'] = response_data["expires_in"]

    return redirect('/')


@app.route("/refresh_token")
def refresh_token():

    print 'refreshing'

    code_payload = {
        "grant_type": "refresh_token",
        "refresh_token": session.get('refresh_token')
    }
    
    base64encoded = base64.b64encode("{}:{}".format(CLIENT_ID, CLIENT_SECRET))
    headers = {"Authorization": "Basic {}".format(base64encoded)}
    post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload, headers=headers)

    # Auth Step 5: Tokens are Returned to Application
    response_data = json.loads(post_request.text)

    print response_data

    # store access token in session
    session['access_token'] = response_data["access_token"]

    return redirect('/search')


@app.route("/search", methods=['POST'])
@access_token_required
def search():

    # recover stored access token from session
    access_token = session.get('access_token')

    # Auth Step 6: Use the access token to access Spotify API
    authorization_header = {"Authorization":"Bearer {}".format(access_token)}

    # search query
    q       = request.json.get('q', '')
    t       = request.json.get('type', '')
    query   = "{}/search?q={}&type={}".format(SPOTIFY_API_URL, q, t)

    reply   = requests.get(query, headers=authorization_header)
    result  = json.loads(reply.text)

    if result.get('error', None) is not None:
        if result.get('error').get('status') == 401:
            return redirect('/refresh_token')

        
    return jsonify(result)

    # # Get user playlist data
    # playlist_api_endpoint = "{}/playlists".format(profile_data["href"])
    # playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
    # playlist_data = json.loads(playlists_response.text)
    
    # # Combine profile and playlist data to display
    # display_arr = [profile_data] + playlist_data["items"]

    # #https://api.spotify.com/v1/search?q=tania%20bowra&type=artist



if __name__ == "__main__":
    app.run(debug=True,port=PORT)

"""
from flask import Flask, render_template, jsonify
from flask_restful import reqparse, Resource, Api
import json

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/auth', methods=['POST'])
def auth():
    return jsonify({"success": True}), 200


@app.route('/search')
def search():
    return render_template('index.html')

@app.route('/favorites')
def favorites():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
"""
