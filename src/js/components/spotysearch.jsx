import React, { Component } from 'react';
import Axios from 'axios';
import createHistory from 'history/createBrowserHistory'
import {ResultList} from './resultlist'
import {TrackList} from './track'

function getDistFromBottom () {
  
  var scrollPosition = window.pageYOffset;
  var windowSize     = window.innerHeight;
  var bodyHeight     = document.body.offsetHeight;

  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);

}

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
        
        this.handleQChange      = this.handleQChange.bind(this);
        this.handleTypeChange   = this.handleTypeChange.bind(this);
        this.handleSubmit       = this.handleSubmit.bind(this);
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
                <input type="submit" value="Search" />
            </form>
        );
    }
}

class Search extends Component {

    constructor(props) {
        super(props)

        this.state = {
            items: [],
            query: {
                q: '',
                type: '',
            },
            terms: '',
            loading: false,
            limit: 20,
            page: 0
        }

        this.search = this.search.bind(this);
        this.handleScroll = this.handleScroll.bind(this);


        this.history = createHistory()

        // trigger search if url have a query string
        var r = /^\?[\w]=(.*)&type=(.*)$/i;
        var query = r.exec(window.location.search);
        if(query)
            this.search(query[1], query[2]);

    }

    componentDidMount() {
    
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {

        window.removeEventListener('scroll', this.handleScroll);
    }

    get offset() {
        return this.state.limit * this.state.page;
    }

    handleScroll(event) {

        if(this.state.query.q){
            if((getDistFromBottom() < 200) && !this.state.loading){
                console.log('Foop');
                this.state.page++;
                this.search(this.state.query.q, this.state.query.type, null, true);
            }
        } 
    }

    search(q, type, event, append) {

        this.terms = decodeURIComponent(q);

        this.history.push('/search?q=' + q + '&type=' + type);

        this.state.query = {q: q, type: type};

        console.log(this.state);

        var $this = this;

        if(event)
            event.preventDefault();

        this.state.loading = true;

        // call backend
        Axios.post('/search', {
            q: q,
            type: type,
            offset: this.offset
        })
        .then(function (response) {
        
            var tracklist = new TrackList(response.data[type + 's'].items);

            var list = [];

            if(append)
                list = $this.state.items.concat(tracklist.list())
            else
                list = tracklist.list();

            $this.setState({items: list});
            
        })
        .catch(function (error) {
            alert(error);
        })
        .then(() => {
            $this.setState({loading: false});
        });

    }

    render() {

        return (
            <div>
                <header>
                    <h1>SpotySearch :)</h1>
                </header>
                <div>
                    <SearchForm onSubmit={this.search}/>
                </div>
                <div>
                    <ResultList items={this.state.items} terms={this.terms}/>
                </div>
 
            </div>
        )
    }
}

export default Search;
