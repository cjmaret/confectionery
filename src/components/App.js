import React, { useState, useEffect } from 'react';
import 'normalize.css';
import '../styling/main.css';
import '../styling/card.css';
import Screen from '../components/Screen';
import { useCards } from '../components/imgs/useCards';
import 'normalize.css';
import backgroundImageOn from '../assets/images/background-lights-on.jpg';
import backgroundImageOff from '../assets/images/background-lights-off.jpg';
import { ScreenContainer } from '../styling/styledApp';
//import IntroVideoLocal from '../assets/intro-video.mp4';

import { useVideos } from '../components/imgs/useVideos';
import { useIntroVideo } from './imgs/useIntroVideo';

export default function App({ arrowClickedStack }) {
  const [lightsOn, setLightsOn] = useState(true);
  const [currentClick, setCurrentClick] = useState(['']);
  const currentClickId = currentClick[0];
  const cards = useCards();
  const videos = useVideos();
  const introVideoContentful = useIntroVideo();
  const [infoBtnClicked, setInfoBtnClicked] = useState(true);
  const [containerMarginTop, setContainerMarginTop] = useState(0);

  const lightsOffAreas = [
    'btn1',
    'btn2',
    'btn3',
    'btn4',
    'btn5',
    'btn6',
    'btn7',
    'btn8',
    'btn9',
    'btn10',
    'btn11',
    'btn12',
    'btn13',
  ];

  const lightsOnAreas = [
    'infoBtn',
    'contactBtn',
    'bgImageLight',
    'bgImageDark',
  ];

  const toggleLights = () => {
    if (lightsOffAreas.includes(currentClickId)) {
      setLightsOn(false);
    }
    if (lightsOnAreas.includes(currentClickId)) {
      setLightsOn(true);
    }
  };

  useEffect(() => {
    function getWidth() {
      const windowWidth = window.matchMedia('(min-width: 550px)');
      if (windowWidth.matches) {
        setContainerMarginTop(
          200000 / (window.innerWidth + window.innerHeight)
        );
      }
    }
    getWidth();
    window.addEventListener('resize', getWidth);
    return () => window.removeEventListener('resize', getWidth);
  });

  // play intro video on load
  useEffect(() => {
    const introVideoContainer = document.querySelector(
      '.intro-video-container'
    );
    setTimeout(() => {
      introVideoContainer.classList.add('intro-video-container_hidden');
    }, 2000);
    setTimeout(() => {
      introVideoContainer.style.display = 'none';
    }, 3000);
  }, []);

  // handling click events
  useEffect(() => {
    if (currentClickId) {
      toggleLights();
    }
  }, [currentClick]);

  const handleClick = e => {
    if (e.target.id === 'infoBtn' && currentClick[0] === 'infoBtn') {
      setInfoBtnClicked(!infoBtnClicked);
    } else {
      setInfoBtnClicked(true);
    }
    setCurrentClick([e.target.id]);

    if (e.target.id === 'leftArrow' || e.target.id === 'rightArrow') {
      arrowClickedStack.push(e.target.id);
    }

    return false;
  };

  return (
    <ScreenContainer containerMarginTop={containerMarginTop}>
      <div className="screenArea" id="screenArea">
        <Screen
          cards={cards}
          videos={videos}
          currentClickId={currentClickId}
          arrowClickedStack={arrowClickedStack}
          infoBtnClicked={infoBtnClicked}
        />
      </div>
      <div
        className="button-container_type_truffle"
        onClick={e => handleClick(e)}
      >
        <button className="truffle-button truffle-button_1" id="btn1"></button>
        <button className="truffle-button truffle-button_2" id="btn2"></button>
        <button className="truffle-button truffle-button_3" id="btn3"></button>
        <button className="truffle-button truffle-button_4" id="btn4"></button>
        <button className="truffle-button truffle-button_5" id="btn5"></button>
        <button className="truffle-button truffle-button_6" id="btn6"></button>
        <button className="truffle-button truffle-button_7" id="btn7"></button>
        <button className="truffle-button truffle-button_8" id="btn8"></button>
        <button className="truffle-button truffle-button_9" id="btn9"></button>
        <button
          className="truffle-button truffle-button_10"
          id="btn10"
        ></button>
        <button
          className="truffle-button truffle-button_11"
          id="btn11"
        ></button>
        <button
          className="truffle-button truffle-button_12"
          id="btn12"
        ></button>
        <button
          className="truffle-button truffle-button_13"
          id="btn13"
        ></button>
        <button
          className="truffle-button truffle-button_info"
          id="infoBtn"
        ></button>
        <button
          className="truffle-button truffle-button_contact"
          id="contactBtn"
        ></button>
      </div>
      <div className="button-container_type_direction">
        <button
          className="direction-button direction-button_left"
          id="leftArrow"
          onClick={e => handleClick(e)}
        ></button>
        <button
          className="direction-button direction-button_right"
          id="rightArrow"
          onClick={e => handleClick(e)}
        ></button>
      </div>

      <img
        className={`background-image ${
          lightsOn ? '' : 'background-image_hidden'
        }`}
        id="bgImageLight"
        src={backgroundImageOn}
        onClick={e => handleClick(e)}
      />
      <img
        className="background-image background-image-off"
        id="bgImageDark"
        src={backgroundImageOff}
        onClick={e => handleClick(e)}
      />
      <div className="intro-video-container">
        <video
          className="intro-video"
          src={introVideoContentful}
          autoPlay
          playsInline
          muted
        ></video>
      </div>
    </ScreenContainer>
  );
}
