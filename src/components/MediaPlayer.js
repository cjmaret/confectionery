import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import PlayerComponent from './PlayerComponent';
import VimeoPlayer from './VimeoPlayer';
import 'bootstrap/dist/css/bootstrap.css';
import FacebookPlayer from 'react-player/facebook';
import DacastPlayer from './DacastPlayer';

const MediaPlayer = ({
  currentClickId,
  currentVideoDetails,
  arrowClickedStack,
  setCurrentVideoDetails,
  getVideoArray,
}) => {
  const { playVideo, currentVideoArray, videoIndex } = currentVideoDetails;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(videoIndex);

  // fade in media player after showing black screen for a moment
  useEffect(() => {
    const mediaPlayerContainer = document.querySelector(
      '.media-player-container'
    );
    mediaPlayerContainer.style.opacity = 0;
    if (playVideo) {
      setTimeout(() => {
        mediaPlayerContainer.style.opacity = 1;
      }, 1200);
    }
  }, playVideo);

  // set video index to 0 when changing truffle buttons
  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [currentVideoDetails]);

  const getNextVideo = () => {
    // increase index
    if (playVideo && currentVideoIndex < currentVideoArray.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
    // if at last video in array, go to zero index
    else if (playVideo && currentVideoIndex === currentVideoArray.length - 1) {
      setCurrentVideoIndex(0);
    } else {
      setCurrentVideoIndex(0);
      setCurrentVideoDetails({
        videoIndex: 0,
        currentVideoArray: getVideoArray(currentClickId),
        playVideo: true,
        controls: true,
        playsinline: true,
        file: {
          forceVideo: true,
        },
      });
    }
  };

  const getPrevVideo = () => {
    // decrease index
    if (playVideo && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
    // if at 0, go to last video in array
    else if (playVideo && currentVideoIndex === 0) {
      setCurrentVideoIndex(currentVideoArray.length - 1);
    } else {
      setCurrentVideoIndex(0);
      setCurrentVideoDetails({
        videoIndex: 0,
        currentVideoArray: getVideoArray(currentClickId),
        playVideo: true,
        controls: true,
        playsinline: true,
        file: {
          forceVideo: true,
        },
      });
    }
  };

  // enables swiping for videos
  useEffect(() => {
    let touchstartX = {
      value: 0,
      id: '',
    };
    let touchendX = 0;

    const screenArea = document.querySelector('.screenArea');
    function handleGesture() {
      if (touchendX < touchstartX.value) {
        getNextVideo();
      }
      if (touchendX > touchstartX.value) {
        getPrevVideo();
      }
    }
    function addTouchstartPosition(e) {
      if (
        e.target.id.includes('video-swipe-left') ||
        e.target.id.includes('video-swipe-right')
      ) {
        touchstartX.value = e.changedTouches[0].screenX;
        touchstartX.id = e.target.id;
      }
    }

    function addTouchendPosition(e) {
      if (
        touchstartX.id === 'video-swipe-right' ||
        touchstartX.id === 'video-swipe-left'
      ) {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
      }
    }

    screenArea.addEventListener('touchstart', addTouchstartPosition);
    screenArea.addEventListener('touchend', addTouchendPosition);

    return () => {
      screenArea.removeEventListener('touchstart', addTouchstartPosition);
      screenArea.removeEventListener('touchend', addTouchendPosition);
    };
  });

  // only enables the left/right buttons above 900px
  useEffect(() => {
    const windowWidth = window.matchMedia('(min-width: 500px)');

    if (windowWidth.matches) {
      if (currentClickId === 'leftArrow' || currentClickId === 'rightArrow') {
        if (playVideo && arrowClickedStack.length > 0) {
          const arrow = arrowClickedStack.pop();
          arrow === 'rightArrow' ? getNextVideo() : getPrevVideo();
        }
      }
    }
  });

  // enables carousel indicator lines
  useEffect(() => {
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselButtons = carouselIndicators.querySelectorAll(
      'button[type="button"]'
    );
    carouselButtons.forEach((button, i) => {
      button.addEventListener('click', () => {
        setCurrentVideoIndex(i);
      });
    });
  });

  // black overlay to fade in when changing between truffle buttons
  useEffect(() => {
    console.log(currentVideoArray);
    const blackOverlay = document.querySelector('.black-overlay');
    blackOverlay.style.display = 'block';
    setTimeout(() => {
      blackOverlay.classList.add('black-overlay_hidden');
    }, 550);
    setTimeout(() => {
      blackOverlay.style.display = 'none';
      blackOverlay.classList.remove('black-overlay_hidden');
    }, 1100);
  }, [currentVideoArray]);

  const mediaPlayer = (
    <div className="media-player-container">
      <div className="black-overlay"></div>
      <div
        className="video-swipe video-swipe_right"
        id="video-swipe-right"
      ></div>
      <div className="video-swipe video-swipe_left" id="video-swipe-left"></div>
      <Carousel
        interval={null}
        activeIndex={currentVideoIndex}
        controls={false}
        onSelect={eventKey => {
          setCurrentVideoIndex(eventKey);
        }}
      >
        {currentVideoArray.map((video, i) => {
          return (
            <Carousel.Item key={i}>
              {video.is360 ? (
                <>
                  {video.embeddedUrl.includes('vimeo.com') ? (
                    <PlayerComponent
                      video={video}
                      i={i}
                      currentVideoIndex={currentVideoIndex}
                      getNextVideo={getNextVideo}
                    />
                  ) : /facebook.com...videos.../.test(video.embeddedUrl) ? (
                    <FacebookPlayer
                      url={video.embeddedUrl}
                      className="vr-player"
                      currentVideoIndex={currentVideoIndex}
                    />
                  ) : (
                    <div className="vr-player">
                      <iframe
                      scrolling='no'
                        src={
                          video.embeddedUrl.split('?').length > 1
                            ? video.embeddedUrl +
                              '&current=' +
                              currentVideoIndex
                            : video.embeddedUrl +
                              '?current=' +
                              currentVideoIndex
                        }
                      />
                    </div>
                  )}
                </>
              ) : (
                <PlayerComponent
                  video={video}
                  i={i}
                  currentVideoIndex={currentVideoIndex}
                  getNextVideo={getNextVideo}
                />
              )}
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );

  return mediaPlayer;
};

export default MediaPlayer;
