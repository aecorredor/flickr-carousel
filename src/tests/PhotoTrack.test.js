import React from 'react';
import FlickrSlideshow from '../components/FlickrSlideshow';
import PhotoTrack from '../components/PhotoTrack';

const photos = {
  0: {
    src: 'example0.jpg',
    index: 0,
  },
  1: {
    src: 'example1.jpg',
    index: 1,
  },
  2: {
    src: 'example2.jpg',
    index: 2,
  },
};

const event = {
  target: {
    dataset: {
      index: 2,
    },
  },
};

describe('<PhotoTrack />', () => {
  let wrapper;
  let handlePhotoClickSpy;

  beforeEach(() => {
    handlePhotoClickSpy = jest.spyOn(PhotoTrack.prototype, 'handlePhotoClick');
    wrapper = shallow(<PhotoTrack />);
  });

  afterEach(() => {
    handlePhotoClickSpy.mockRestore();
  });

  it('should not render anything if no photos exist', () => {
    wrapper.setProps({ photos: {}, selectedPhoto: null });

    expect(wrapper.find('div')).toHaveLength(0);
  });

  it('should render the selected image', () => {
    wrapper.setProps({ photos, selectedPhoto: 0 });
    wrapper.setState({ selectedPhoto: 0 });

    expect(wrapper.find('button').at(0)).toHaveStyleRule('background-image', "url('example0.jpg')");
    expect(wrapper.find('button').at(0)).toHaveStyleRule('border', '2px solid orange');
  });

  it('should render the correct number of images', () => {
    wrapper.setProps({ photos, selectedPhoto: 0 });

    expect(wrapper.find('button')).toHaveLength(3);
  });

  it('should switch to an image after it is clicked', () => {
    wrapper.setProps({ photos, selectedPhoto: 0 });
    const imageToSelect = wrapper.find('button').at(2);

    imageToSelect.simulate('click', event);

    expect(handlePhotoClickSpy).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button').at(2)).toHaveStyleRule('background-image', "url('example2.jpg')");
    expect(wrapper.find('button').at(2)).toHaveStyleRule('border', '2px solid orange');
  });

  it('should update parent state if the parent desires to', () => {
    const parentWrapper = shallow(<FlickrSlideshow />);

    parentWrapper.setState({ photos, selectedPhoto: 0 });

    const childPhotoTrackWrapper = parentWrapper.find(PhotoTrack).at(0).dive();
    childPhotoTrackWrapper.find('button').at(2).simulate('click', event);

    expect(handlePhotoClickSpy).toHaveBeenCalledTimes(1);
    expect(parentWrapper.state().selectedPhoto).toBe(2);
  });
});
