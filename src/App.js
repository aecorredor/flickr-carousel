import React, { Component } from 'react';
import './App.css';
import FlickrSlideshow from './components/FlickrSlideshow';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Flickr Slideshow
        </p>

        <FlickrSlideshow />
      </div>
    );
  }
}

export default App;
