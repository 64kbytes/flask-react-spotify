import Storage from './storage';

class Track {
	
	constructor(data){

		this.key = data.id;
		this.albumCover = data.album.images[0].url;
		this.albumName = data.album.name;
		this.artistName = data.artists[0].name;
		this.isFavorite = Storage.keyExists(this.key) ? true : false;
	}

}

class TrackList {
	constructor(list){
		
		this.tracks = [];
		
		for(var i in list)
			this.tracks.push(new Track(list[i]))
	}

	list() {
		return this.tracks;
	}
}


exports.TrackList = TrackList;