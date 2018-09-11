import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import isEmpty from 'lodash.isempty';

const trackContainer = css`
  width: 64rem;
  overflow: hidden;
  background-color: #8e44ad;
`;

const innerTrack = css`
  display: flex;
  min-height: 200px;
  min-width: 100vw;
  transition: transform 0.5s ease-in;
`;

const photoItem = css`
  min-width: 15rem;
  margin: 0.5rem;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  outline: none;
`;

export default class PhotoTrack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPhoto: this.props.selectedPhoto,
    };

    this.handlePhotoClick = this.handlePhotoClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedPhoto !== this.props.selectedPhoto) {
      this.setState({ selectedPhoto: this.props.selectedPhoto });
    }
  }

  handlePhotoClick(e) {
    this.setState({ selectedPhoto: Number(e.target.dataset.index) }, this.handlePhotoChange);
  }

  handlePhotoChange() {
    if (this.props.handlePhotoChange) {
      this.props.handlePhotoChange(this.state.selectedPhoto);
    }
  }

  renderPhotoItem(photo) {
    const photoClass = css`
      ${photoItem};
      background-image: url('${photo.src}');
      border: ${this.state.selectedPhoto === photo.index ? '2px solid orange' : 'none'};
    `;

    return (
      <button
        key={photo.index}
        type="button"
        data-index={photo.index}
        onClick={this.handlePhotoClick}
        className={photoClass}
      />
    );
  }

  render() {
    if (isEmpty(this.props.photos)) {
      return null;
    }

    const selectedPhoto = this.props.photos[this.state.selectedPhoto] || {};
    const innerTrackClasses = css`
      ${innerTrack};
      transform: translateX(${selectedPhoto.trackPosition}rem);
    `;
    const photos = Object.values(this.props.photos);

    return (
      <div className={trackContainer}>
        <div className={innerTrackClasses}>
          {photos.map(photo => this.renderPhotoItem(photo))}
        </div>
      </div>
    );
  }
}

PhotoTrack.propTypes = {
  selectedPhoto: PropTypes.number,
  photos: PropTypes.objectOf(
    PropTypes.shape({
      src: PropTypes.string,
    }),
  ),
  handlePhotoChange: PropTypes.func,
};

PhotoTrack.defaultProps = {
  selectedPhoto: 0,
  photos: { 0: { src: '' } },
  handlePhotoChange: null,
};
