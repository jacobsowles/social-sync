import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import Footer from './Footer';

describe('Footer', () => {
  const should = chai.should();
  let props;

  const component = () => {
    return mount(
      <Footer {...props}>
        <p>Test</p>
      </Footer>
    );
  };

  const topLevelElement = () => {
    return component()
      .find('footer')
      .first();
  };

  const container = () => {
    return topLevelElement().props().children;
  };

  configure({ adapter: new Adapter() });

  beforeEach(() => {
    props = {
      className: undefined
    };
  });

  it('should render a footer', () => {
    topLevelElement().should.not.equal(undefined);
  });

  describe('the rendered footer', () => {
    it('should render a bootstrap container', () => {
      container().props.className.should.equal('container');
    });
  });

  describe('the rendered container', () => {
    it('should contain all rendered child components', () => {
      container().props.children.should.deep.equal(component().props().children);
    });
  });

  describe('when `className` is defined', () => {
    beforeEach(() => {
      props.className = 'another-class';
    });

    it('should add the class name to the footer', () => {
      topLevelElement()
        .props()
        .className.should.equal('footer another-class');
    });
  });

  describe('when `className` is not defined', () => {
    beforeEach(() => {
      props.className = undefined;
    });

    it('should only have the default class name', () => {
      topLevelElement()
        .props()
        .className.should.equal('footer');
    });
  });
});
