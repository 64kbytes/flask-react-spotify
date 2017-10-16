import React from 'react';
import ReactDOM from 'react-dom';
import Spotysearch from './components/spotysearch';
import Spotyfav from './components/spotyfav';

function init () {
    let search = document.querySelectorAll('[data-section="search"]');
    let fav = document.querySelectorAll('[data-section="fav"]');

    if(search.length > 0){
        ReactDOM.render(
            <Spotysearch />, search[0]
        );
    } else {
        if(fav.length > 0) {
            ReactDOM.render(
                <Spotyfav />, fav[0]
            );
        }
    }
}

// This would usually wait for the ready/DOMContentLoaded
// event, but we're loading this async, and it's up last
init();
