// export default React.createClass({

//   	render: function () {
// 	    return (
// 			<div>
// 				Hey! This is just an auto-generated component.
// 				Now it's up to you to make something great!
// 			</div>
// 	    );
// 	}
// });

import React, { Component } from 'react';
import Axios from 'axios';
import {Button} from 'react-bootstrap';

//import logo from './logo.svg';

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    
    var hashParams = {};
    var r = /([^&;=]+)=?([^&;]*)/g;
    var q = window.location.hash.substring(1);
    
    while(true){
        var e = r.exec(q);

        if(!e)
            break;

        hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

class App extends Component {

    constructor(props) {
        super(props);

        this.stateKey       = 'spotify_auth_state';
        this.clientId       = '9be3f39c9eef41b5b62916b8e443d952';
        this.redirectURI    = 'http://localhost:3000';
        this.scope          = '';

        var params = getHashParams();

        this.state = {
            accessToken:        params.access_token || null,
            apiAuthState:       params.state || null,
            apiStoredAuthState: localStorage.getItem(this.stateKey) || null
        }
    }

    getAuthURL(){

        var state = generateRandomString(16);

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(this.clientId);
        url += '&scope=' + encodeURIComponent(this.scope);
        url += '&redirect_uri=' + encodeURIComponent(this.redirectURI);
        url += '&state=' + encodeURIComponent(state);

        return [url, state];
    }
    
    authenticate() {
              
        var [url, state] = this.getAuthURL();
        localStorage.setItem(this.stateKey, state);
        window.location = url;
    }

    isLogged(){
        return (this.state.accessToken && this.state.apiAuthState && this.state.apiStoredAuthState) 
            && (this.state.apiAuthState === this.state.apiStoredAuthState);
    }

    login() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, <Button bsStyle="primary" onClick={() => this.authenticate()}>Log in to Spotify</Button>
                </p>
 
            </div>
        );
    }

    search() {

        var query = {
            url: 'https://api.spotify.com/v1/search?q=geldof&type=artist',
            headers: {
                'Authorization': 'Bearer ' + this.state.accessToken
            }
        };

        // Request.get(query, function(error, response, body) {


        //     console.log(body);

        //     if (!error && response.statusCode === 200) {




        //         // // use the access token to access the Spotify Web API
        //         // var token = body.access_token;
        //         // var options = {
        //         //     url: 'https://api.spotify.com/v1/users/jmperezperez',
        //         //         headers: {
        //         //         'Authorization': 'Bearer ' + token
        //         //     },
        //         //     json: true
        //         // };
        //         // request.get(options, function(error, response, body) {
        //         //     console.log(body);
        //         // });
        //     }
        // });


        // $.ajax({
        //         url: 'https://api.spotify.com/v1/me',
        //         headers: {
        //             'Authorization': 'Bearer ' + access_token
        //         },
        //         success: function(response) {
        //             userProfilePlaceholder.innerHTML = userProfileTemplate(response);

        //             $('#login').hide();
        //             $('#loggedin').show();
        //         }
        // });

        return (
            <div>Ok</div>
        );
    }

    render() {

        //localStorage.removeItem(stateKey);
        if (this.isLogged()) {
            return this.search();
        } else {
            return this.login();
        }
    }
}

export default App;
