import React, { Component } from 'react';
import Axios from 'axios';
import createHistory from 'history/createBrowserHistory'
import {ResultList} from './resultlist'
import {TrackList} from './track'

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

class SearchForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			q: '',
			type: 'track'
		};
		
		this.handleQChange 		= this.handleQChange.bind(this);
		this.handleTypeChange 	= this.handleTypeChange.bind(this);
		this.handleSubmit 		= this.handleSubmit.bind(this);
	}

	handleQChange(event) {
		this.setState({q: event.target.value});
	}

	handleTypeChange(event) {
		this.setState({type: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.onSubmit(this.state.q, this.state.type, event);		
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					<span>Search for </span>  
					<select value={this.state.type} onChange={this.handleTypeChange}>
						<option value="track">Track</option>
						<option disabled value="artist">Artist</option>
						<option disabled value="album">Album</option>
						<option disabled value="playlist">Playlist</option>
					</select>&nbsp;
					<input type="text" onChange={this.handleQChange} value={this.state.q} />&nbsp;
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}

class App extends Component {

	constructor(props) {
		super(props)

		this.state = {
			items: []
		}

		this.search = this.search.bind(this);


		this.history = createHistory()

		const location = history.location

		// Listen for changes to the current location.
		// this.historyUnlisten = this.history.listen((location, action) => {
		// 	console.log('CHANGE');
		// 	// location is an object like window.location
		// 	console.log(action, location.pathname, location.state)
		// })

		// To stop listening, call the function returned from listen().
		//this.historyUnlisten()


		var r = /^\?[\w]=(.*)&type=(.*)$/i;
    	var query = r.exec(window.location.search);
    	if(query)
    		this.search(query[1], query[2]);
	}

    search(q, type, event) {

    	this.history.push('/search?q=' + q + '&type=' + type);

    	var $this = this;

    	if(event)
    		event.preventDefault();

    	Axios.post('/search', {
			q: q,
			type: type
		})
		.then(function (response) {
			
			console.log(response);

			var tracklist = new TrackList(response.data[type + 's'].items);

			$this.setState({items: tracklist.list()});
			
		})
		.catch(function (error) {
			console.log(error);
		});

        // var query = {
        //     url: 'https://api.spotify.com/v1/search?q=geldof&type=artist',
        //     headers: {
        //         'Authorization': 'Bearer ' + this.state.accessToken
        //     }
        // };

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

        // return (
        //     <div>Ok</div>
        // );
    }

    render() {

        //localStorage.removeItem(stateKey);
        return (
        	<div>
                <header>
                    <h1>SpotySearch :)</h1>
                </header>
                <div>
                	<SearchForm onSubmit={this.search}/>
                </div>
                <div>
                	<ResultList items={this.state.items}/>
                </div>
 
            </div>
        )
    }
}

export default App;
