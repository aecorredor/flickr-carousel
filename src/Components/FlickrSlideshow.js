import React, { Component } from 'react';
import { css } from 'emotion';
import debounce from 'lodash.debounce';
import get from 'lodash.get';

import FlickrServices from '../services/flickr-services';

import Spinner from './Spinner';
import Carousel from './Carousel';
import PhotoTrack from './PhotoTrack';

const flexColumn = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const container = css`
  ${flexColumn};
  width: 80%;
  margin: 0 auto;
`;

const spinnerContainer = css`
  ${flexColumn};
  height: 566px;
`;

const searchField = css`
  width: 20rem;
`;

export default class FlickrSlideshow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchingPhotos: false,
      searchTerm: '',
      photos: {},
      selectedPhoto: null,
      keyPressed: null,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePhotoChange = this.handlePhotoChange.bind(this);
    this.debouncedSearchPhotos = debounce(this.searchPhotos, 750, { trailing: true });
  }

  handleSearchChange(e) {
    const searchTerm = e.target.value;
    const parsedSearchTerm = searchTerm.trim();
    const pressedKeyIsBackspace = this.state.keyPressed === 'Backspace';


    this.setState({ searchTerm }, () => {
      if (!parsedSearchTerm || parsedSearchTerm.length < 2 || pressedKeyIsBackspace) {
        return;
      }

      this.debouncedSearchPhotos(parsedSearchTerm);
    });
  }

  handleKeyPress(e) {
    this.setState({ keyPressed: e.key });
  }

  handlePhotoChange(newSelectedPhoto) {
    this.setState({ selectedPhoto: newSelectedPhoto });
  }

  async searchPhotos(searchTerm) {
    this.setState({ searchingPhotos: true });
    let results = [];

    try {
      const { body = {} } = await FlickrServices.searchPhotos(searchTerm);
      const rawPhotos = get(body, 'photos.photo', []);
      const photoSizesReq = rawPhotos.map(rawPhoto => FlickrServices.getSizes(rawPhoto.id));
      const photoSizes = await Promise.all(photoSizesReq);

      results = photoSizes.map((photoSize) => {
        const { body: photoBody = {} } = photoSize;
        const { sizes: { size = [] } } = photoBody;
        // From seeing the flickr API results, the last element of the size array is always
        // the original photo size.
        const selectedSize = size[size.length - 1];

        return selectedSize.source;
      });
    } catch (error) {
      console.log(`error fetching photos: ${error}`);
    } finally {
      this.buildCarouselData(results);
    }
  }

  buildCarouselData(results) {
    let trackPosition = 24; // Positions first picture in the middle of the track.

    const photos = results.reduce((acc, src, index) => {
      acc[index] = {
        src,
        trackPosition,
        index,
      };
      trackPosition -= 16;

      return acc;
    }, {});

    this.setState({ photos, searchingPhotos: false, selectedPhoto: 0 });
  }

  renderSpinner() {
    return (
      <div className={spinnerContainer}>
        <Spinner />
      </div>
    );
  }

  renderSearchInput() {
    return (
      <div className={searchField}>
        <input
          placeholder="Search photos..."
          value={this.state.searchTerm}
          onChange={this.handleSearchChange}
          onKeyDown={this.handleKeyPress}
        />
      </div>
    );
  }

  renderSlideshow() {
    return (
      <div className={flexColumn}>
        <Carousel
          photos={this.state.photos}
          selectedPhoto={this.state.selectedPhoto}
          handlePhotoChange={this.handlePhotoChange}
        />
        <PhotoTrack
          photos={this.state.photos}
          selectedPhoto={this.state.selectedPhoto}
          handlePhotoChange={this.handlePhotoChange}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={container}>
        {this.renderSearchInput()}

        {
          this.state.searchingPhotos ?
            this.renderSpinner() :
            this.renderSlideshow()
        }
      </div>
    );
  }
}
