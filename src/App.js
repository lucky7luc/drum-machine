import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const soundClips = [
  {
    keyCode: 81,
    key: 'Q',
    label: 'Heater 1',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3'
  },
  {
    keyCode: 87,
    key: 'W',
    label: 'Heater 2',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3'
  },
  {
    keyCode: 69,
    key: 'E',
    label: 'Heater 3',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3'
  },
  {
    keyCode: 65,
    key: 'A',
    label: 'Heater 4',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3'
  },
  {
    keyCode: 83,
    key: 'S',
    label: 'Clap',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3'
  },
  {
    keyCode: 68,
    key: 'D',
    label: 'Open-HH',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3'
  },
  {
    keyCode: 90,
    key: 'Z',
    label: 'Kickn-n-Hat',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3'
  },
  {
    keyCode: 88,
    key: 'X',
    label: 'Kick',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3'
  },
  {
    keyCode: 67,
    key: 'C',
    label: 'Closed-HH',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3'
  }
];

class DrumPad extends Component {
  constructor(props){
    super(props);
    this.state = {
      style: {
        backgroundColor: '#979da1',
        boxShadow: '3px 3px 5px black',
        height: '77px',
        marginTop: '10px',
      }
    };
      this.playSound = this.playSound.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.toggleActive = this.toggleActive.bind(this);
    }

    componentDidMount(){
      document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount(){
      document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(e){
      if(e.keyCode === this.props.sound.keyCode){
        this.playSound();
      }
    }

    toggleActive() {
      this.setState(prevState => {
        const isActive = prevState.style.backgroundColor === '#0486c7';
        return {
          style: {
            ...prevState.style,
            backgroundColor: isActive ? '#979da1' : '#0486c7',
            boxShadow: isActive ? '3px 3px 5px black' : '0 3px black',
            marginTop: isActive ? '10px' : '7px',
          }
        };
      });
    }
    

    playSound(){
      const audio = document.getElementById(this.props.sound.key);
      audio.currentTime = 0;
      audio.volume = this.props.volume;
      audio.play();
      this.toggleActive();
      setTimeout(() => this.toggleActive(), 100);
      this.props.updateDisplay(this.props.sound.label); 
    }
  
    render(){
      return(
        <div
        className='drum-pad btn btn-lg btn-outline-primary'
        id={this.props.sound.label}
        onClick={this.playSound}
        style={this.state.style}
        >
          {this.props.sound.key}
          <audio
          className='clip'
          id={this.props.sound.key}
          src={this.props.sound.url}
          />
        </div>
      );
    }
}

class DrumMachine extends Component {
  constructor(props){
    super(props);
    this.state = {
     display: '',
     power: true,
     volume: 0.3
    }

    this.updateDisplay = this.updateDisplay.bind(this);
    this.adjustVolume = this.adjustVolume.bind(this);
    this.togglePower = this.togglePower.bind(this); 
  }

  updateDisplay = (displayText) => {
    if(this.state.power){
      this.setState({
        display: displayText
      });
    }
  }

  adjustVolume = (e) => {
    if(this.state.power){
      this.setState({
        volume: e.target.value,
        display: 'Volume: ' + Math.round(e.target.value * 100)
      });

      const audioElements = document.getElementsByClassName('clip');
      Array.from(audioElements).forEach(audio => {
       audio.volume = e.target.value;
      });


      setTimeout(() => this.setState({ display: '' }), 1000);
    }
  }

  togglePower = () => {
    this.setState({
      power: !this.state.power,
      display: '',
      volume: this.state.power ? 0 : 0.3
    });
  }

  render() {
    const padComponents = soundClips.map(sound => (
      <DrumPad
      key={sound.key}
      sound={sound}
      power={this.state.power}
      updateDisplay={this.updateDisplay}
      volume={this.state.volume}
      />
    ));

    return(
      <div id='drum-machine' className='container'>
        <div className='row'>
          <div className='pad-bank col-md-8'>
          {padComponents}
          </div>

          <div className='controls col-md-6'>
            <div className='power'>
                <p>Power</p>
                <div className="slider-container" onClick={this.togglePower}>
                  <div className={`slider ${this.state.power ? 'slider-on' : 'slider-off'}`}></div>
                </div>
            </div>

            <p id='display' className="alert alert-secondary text-center">{this.state.display}</p>
            <div className='volume-slider input-group'>
              <input
              type='range'
              id='range'
              className="custom-range"
              min='0'
              max='1'
              step='0.01'
              value={this.state.volume}
              onChange={this.adjustVolume}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


ReactDOM.render(<DrumMachine />, document.getElementById('root'));

export default DrumMachine;