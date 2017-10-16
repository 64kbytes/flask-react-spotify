import React, { Component } from 'react';
import Storage from './storage';

class ResultList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var $this = this;

        if(this.props.items.length == 0)
            return (<div></div>);
        else    
            return (
              <div className="result-list">
                { this.props.terms &&
                    <h1>{this.props.total} Results for <span><i>'{this.props.terms}'</i></span></h1>
                }
                <table>
                    <thead>
                        <tr>
                            <th>Album Cover</th>
                            <th>Track Name</th>
                            <th>Album Name</th>
                            <th>Artist</th>
                            <th>Add to Favorites</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.items.map(function(item){
                            return <ListRow key={item.key} value={item} />
                        })}
                    </tbody>
                </table>
              </div>
            );
    }
}

class ListRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.props.value;

        this.addToFavorites = this.addToFavorites.bind(this);
        this.removeFromFavorites = this.removeFromFavorites.bind(this);
    }


    addToFavorites(event) {
        this.setState({isFavorite: true});

        // setState seems to be async, since it doesn't store as true if not setting it directly
        this.state.isFavorite = true;
        Storage.add(this.state);
        
    }

    removeFromFavorites(event) {
        this.setState({isFavorite: false});
        Storage.remove(this.state.key);
    }

    render() {

        return (
            <tr>
                <td><img src={this.state.albumCover} width='64'/></td>
                <td>{this.state.trackName}</td>
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


exports.ResultList = ResultList;