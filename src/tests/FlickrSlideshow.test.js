import React from 'react';
import FlickrSlideshow from '../components/FlickrSlideshow';
import Spinner from '../components/Spinner';
import Carousel from '../components/Carousel';
import PhotoTrack from '../components/PhotoTrack';

const searchTerm = 'nintendo';
const photos = {
  0: {
    src: 'example.jpg',
  },
  1: {
    src: 'example1.jpg',
  },
};

describe('<FlickrSlideShow />', () => {
  let wrapper;
  const onChangeSpy = jest.spyOn(FlickrSlideshow.prototype, 'handleSearchChange');
  const onKeyPressSpy = jest.spyOn(FlickrSlideshow.prototype, 'handleKeyPress');

  beforeEach(() => {
    wrapper = shallow(<FlickrSlideshow />);
  });

  it('should render search input correctly', () => {
    const searchInput = wrapper.childAt(0);

    expect(searchInput).toMatchSnapshot();
  });

  it('should handle search input onChange event', () => {
    const searchInput = wrapper.find('input').at(0);

    searchTerm.split('').reduce((acc, letter) => {
      const newValue = `${acc}${letter}`;

      searchInput.simulate('change', {
        target: { value: newValue },
      });

      return newValue;
    }, '');

    expect(onChangeSpy).toHaveBeenCalledTimes(searchTerm.length);
    expect(wrapper.state().searchTerm).toBe(searchTerm);
  });

  it('should handle search input keyPress event', () => {
    const searchInput = wrapper.find('input').at(0);

    searchTerm.split('').forEach((letter) => {
      searchInput.simulate('keydown', { key: letter });

      expect(onKeyPressSpy).toHaveBeenCalled();
      expect(wrapper.state().keyPressed).toBe(letter);
    });
  });

  it('should only render a spinner while searching', () => {
    wrapper.setState({ searchingPhotos: true }, () => {
      expect(wrapper.find(Spinner)).toHaveLength(1);
      expect(wrapper.find(Carousel)).toHaveLength(0);
      expect(wrapper.find(PhotoTrack)).toHaveLength(0);
    });
  });

  it('should initially only render the search input', () => {
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find(Spinner)).toHaveLength(0);
    expect(wrapper.find(Carousel)).toHaveLength(0);
    expect(wrapper.find(PhotoTrack)).toHaveLength(0);
  });

  it('should render a carousel when photos exist', () => {
    wrapper.setState({ photos, selectedPhoto: 0 }, () => {
      const carousel = wrapper.find(Carousel).first();

      expect(carousel.props().photos).toBe(photos);
      expect(carousel.props().selectedPhoto).toBe(0);
    });
  });

  it('should render a photo track when photos exist', () => {
    wrapper.setState({ photos, selectedPhoto: 0 }, () => {
      const photoTrack = wrapper.find(PhotoTrack).first();

      expect(photoTrack.props().photos).toBe(photos);
      expect(photoTrack.props().selectedPhoto).toBe(0);
    });
  });
});
