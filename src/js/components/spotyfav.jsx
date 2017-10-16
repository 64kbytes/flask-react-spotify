import React, { Component } from 'react'
import {ResultList} from './resultlist'
import Storage from './storage'

class Favorites extends Component {

	constructor(props) {

		super(props);

		this.state = {
			items: Storage.list()
		}
	}

    render() {

        return (
        	<div>
                <header>
                    <h1>Favorites</h1>
                </header>
                <div>
                	<ResultList items={this.state.items}/>
                </div>
            </div>
        )
    }
}

export default Favorites;