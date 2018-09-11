import React from 'react';
import FlickrSlideshow from '../components/FlickrSlideshow';
import Spinner from '../components/Spinner';
import Carousel from '../components/Carousel';
import PhotoTrack from '../components/PhotoTrack';

const searchTerm = 'nintendo';

describe('<FlickrSlideShow />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<FlickrSlideshow />);
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

    expect(wrapper.state().searchTerm).toBe(searchTerm);
  });

  it('should handle search input keyPress event', () => {
    const searchInput = wrapper.find('input').at(0);

    searchTerm.split('').forEach((letter) => {
      searchInput.simulate('keydown', { key: letter });

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
});
