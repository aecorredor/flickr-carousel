import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from 'emotion';
import isEmpty from 'lodash.isempty';

const flexColumn = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const arrowContainer = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const photoItem = css`
  min-width: 15rem;
  margin: 0.5rem;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: contain;
  outline: none;
`;

const arrowStyle = css`
  cursor: pointer;
  outline: none;
`;
const arrowClasses = cx('large material-icons', arrowStyle);

export default class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPhoto: this.props.selectedPhoto,
    };

    this.handleLeftArrowClick = this.handleLeftArrowClick.bind(this);
    this.handleRightArrowClick = this.handleRightArrowClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedPhoto !== this.props.selectedPhoto) {
      this.setState({ selectedPhoto: this.props.selectedPhoto });
    }
  }

  handleLeftArrowClick() {
    if (this.state.selectedPhoto === 0) {
      const photos = Object.values(this.props.photos);
      return this.setState({ selectedPhoto: photos.length - 1 }, this.handlePhotoChange);
    }

    this.setState(
      prevState => ({ selectedPhoto: prevState.selectedPhoto - 1 }),
      this.handlePhotoChange,
    );
  }

  handleRightArrowClick() {
    const photos = Object.values(this.props.photos);

    if (this.state.selectedPhoto === photos.length - 1) {
      return this.setState({ selectedPhoto: 0 }, this.handlePhotoChange);
    }

    this.setState(
      prevState => ({ selectedPhoto: prevState.selectedPhoto + 1 }),
      this.handlePhotoChange,
    );
  }

  handlePhotoChange() {
    if (this.props.handlePhotoChange) {
      this.props.handlePhotoChange(this.state.selectedPhoto);
    }
  }

  renderNavArrows() {
    return (
      <div className={arrowContainer}>
        <i
          role="button"
          tabIndex={0}
          onClick={this.handleLeftArrowClick}
          className={arrowClasses}
        >
          keyboard_arrow_left
        </i>
        <i
          role="button"
          tabIndex={0}
          onClick={this.handleRightArrowClick}
          className={arrowClasses}
        >
          keyboard_arrow_right
        </i>
      </div>
    );
  }

  render() {
    if (isEmpty(this.props.photos)) {
      return null;
    }

    const selectedPhoto = this.props.photos[this.state.selectedPhoto] || {};
    const mainPhoto = css`
      ${flexColumn};
      ${photoItem};
      width: 90%;
      height: 350px;
      margin: 0;
      background-image: url('${selectedPhoto.src}');
    `;

    return (
      <div className={mainPhoto}>
        {this.renderNavArrows()}
      </div>
    );
  }
}

Carousel.propTypes = {
  selectedPhoto: PropTypes.number,
  photos: PropTypes.objectOf(
    PropTypes.shape({
      src: PropTypes.string,
    }),
  ),
  handlePhotoChange: PropTypes.func,
};

Carousel.defaultProps = {
  selectedPhoto: 0,
  photos: { 0: { src: '' } },
  handlePhotoChange: null,
};
