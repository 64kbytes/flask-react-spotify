import React, { Component } from 'react';
import Axios from 'axios';
import createHistory from 'history/createMemoryHistory'

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
		this.props.onSubmit(event, this.state.q, this.state.type);		
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

class ListRow extends React.Component {

	constructor(props) {
		super(props);

		var isFavorite = false;

		var favorites = localStorage.getItem('favorites') || {};

		if(typeof favorites === 'string')
			favorites = JSON.parse(favorites);

		if(favorites[this.props.value.id])
			isFavorite = true;

		this.state = {
			isFavorite: isFavorite,
			key: this.props.value.id,
			albumCover: this.props.value.album.images[0].url,
			albumName: this.props.value.album.name,
			artistName: this.props.value.artists[0].name,
		}

		this.addToFavorites = this.addToFavorites.bind(this);
		this.removeFromFavorites = this.removeFromFavorites.bind(this);
	}


	addToFavorites(event) {
		
		var favorites = localStorage.getItem('favorites') || {};

		if(typeof favorites === 'string')
			favorites = JSON.parse(favorites);

		favorites[this.state.key] = this.state;
		localStorage.setItem('favorites', JSON.stringify(favorites));

		this.setState({isFavorite: true});
	}

	removeFromFavorites(event) {

		var favorites = localStorage.getItem('favorites') || {};

		if(typeof favorites === 'string')
			favorites = JSON.parse(favorites);

		delete favorites[this.state.key];
		localStorage.setItem('favorites', JSON.stringify(favorites));

		this.setState({isFavorite: false});
	}

	render() {

		return (
			<tr>
				<td><img src={this.state.albumCover} width='64'/></td>
				<td>{this.state.albumName}</td>
				<td>{this.state.artistName}</td>
				<td>
					{this.state.isFavorite !== true ? (
						<span className='add-to-favorites' onClick={this.addToFavorites}><i className='fa fa-plus-square add-to-fav'></i></span>
					) : (
						<span className='add-to-favorites' onClick={this.removeFromFavorites}><i className='fa fa-times-circle remove-from-fav'></i></span>
					)}
				</td>
			</tr>
		);
	}
}


class ResultList extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			offset: 0
		}
	}

	render() {

		var $this = this;

	  	if(this.props.items.length == 0)
	  		return (<div></div>);
	  	else	
		    return (
		      <div className="result-list">
		        <h1>Results for <span>{this.props.items[0].name}</span></h1>
		        <table>
		        	<thead>
		        		<tr>
			        		<th>Album Cover</th>
			        		<th>Album Name</th>
			        		<th>Artist</th>
			        		<th>Add to Favorites</th>
			        	</tr>
		        	</thead>
		        	<tbody>
			        	{this.props.items.map(function(item){
				    		return <ListRow key={item.id} value={item} />
				      	})}
				    </tbody>
		        </table>
		      </div>
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

		// const history = createHistory()

		// // Get the current location.
		// const location = history.location

		// // // Listen for changes to the current location.
		// // const unlisten = history.listen((location, action) => {
		// //   // location is an object like window.location
		// //   console.log(action, location.pathname, location.state)
		// // })

		// // Use push, replace, and go to navigate around.
		// history.push('/home', { some: 'state' })

		// // To stop listening, call the function returned from listen().
		// //unlisten()
	}

    search(event, q, type) {

    	var $this = this;

    	event.preventDefault();

    	Axios.post('/search', {
			q: q,
			type: type
		})
		.then(function (response) {
			
			console.log(response);

			$this.setState({items: response.data[type + 's'].items});
			
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
        	<div className="App">
                <header className="App-header">
                    <h1 className="App-title">SpotySearch :P</h1>
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
