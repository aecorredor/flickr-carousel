import React from 'react';
import FlickrSlideshow from '../components/FlickrSlideshow';
import Carousel from '../components/Carousel';

const photos = {
  0: {
    src: 'example0.jpg',
  },
  1: {
    src: 'example1.jpg',
  },
  2: {
    src: 'example2.jpg',
  },
};

describe('<Carousel />', () => {
  let wrapper;
  let leftArrowClickSpy;
  let rightArrowClickSpy;

  beforeEach(() => {
    leftArrowClickSpy = jest.spyOn(Carousel.prototype, 'handleLeftArrowClick');
    rightArrowClickSpy = jest.spyOn(Carousel.prototype, 'handleRightArrowClick');
    wrapper = shallow(<Carousel />);
  });

  afterEach(() => {
    leftArrowClickSpy.mockRestore();
    rightArrowClickSpy.mockRestore();
  });

  it('should not render anything if no photos exist', () => {
    wrapper.setProps({ photos: {}, selectedPhoto: null });

    expect(wrapper.find('div')).toHaveLength(0);
  });

  it('should render navigation arrows', () => {
    wrapper.setProps({ photos, selectedPhoto: 0 });

    expect(wrapper.find('i')).toHaveLength(2);
  });

  it('should render the selected image', () => {
    wrapper.setProps({ photos, selectedPhoto: 0 });

    expect(wrapper.find('div').at(0)).toHaveStyleRule('background-image', "url('example0.jpg')");
  });

  it('should switch to the next image after clicking right arrow', async () => {
    wrapper.setProps({ photos, selectedPhoto: 0 });

    wrapper.find('i').at(1).simulate('click');

    expect(rightArrowClickSpy).toHaveBeenCalledTimes(1);
    expect(wrapper.find('div').at(0)).toHaveStyleRule('background-image', "url('example1.jpg')");
  });

  it('should switch to the first image if right arrow is clicked when on last image', () => {
    wrapper.setProps({ photos });
    wrapper.setState({ selectedPhoto: 2 });

    wrapper.find('i').at(1).simulate('click');

    expect(rightArrowClickSpy).toHaveBeenCalledTimes(1);
    expect(wrapper.find('div').at(0)).toHaveStyleRule('background-image', "url('example0.jpg')");
  });

  it('should switch to the previous image if left arrow is clicked', () => {
    wrapper.setProps({ photos });
    wrapper.setState({ selectedPhoto: 2 });

    wrapper.find('i').at(0).simulate('click');

    expect(leftArrowClickSpy).toHaveBeenCalledTimes(1);
    expect(wrapper.find('div').at(0)).toHaveStyleRule('background-image', "url('example1.jpg')");
  });

  it('should switch to the last image if left arrow is clicked when on first image', () => {
    wrapper.setProps({ photos });
    wrapper.setState({ selectedPhoto: 0 });

    wrapper.find('i').at(0).simulate('click');

    expect(leftArrowClickSpy).toHaveBeenCalledTimes(1);
    expect(wrapper.find('div').at(0)).toHaveStyleRule('background-image', "url('example2.jpg')");
  });

  it('should update parent state if the parent desires to', () => {
    const parentWrapper = shallow(<FlickrSlideshow />);

    parentWrapper.setState({ photos, selectedPhoto: 0 });

    const childCarouselWrapper = parentWrapper.find(Carousel).at(0).dive();
    childCarouselWrapper.find('i').at(1).simulate('click');

    expect(rightArrowClickSpy).toHaveBeenCalledTimes(1);
    expect(parentWrapper.state().selectedPhoto).toBe(1);
  });
});
