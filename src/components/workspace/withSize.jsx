import React, { Component } from 'react';

export const withSize = (WrappedComponent) => {
  return class extends Component {
    state = { width: 0 };
    containerRef = React.createRef();

    componentDidMount() {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
      if (this.containerRef.current) {
        this.setState({ width: this.containerRef.current.offsetWidth });
      }
    };

    render() {
      return (
        <div ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
          {this.state.width > 0 && <WrappedComponent {...this.props} width={this.state.width} />}
        </div>
      );
    }
  };
};
