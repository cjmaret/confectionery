import React, { useState, useEffect } from 'react';
import { useSprings, animated, to } from 'react-spring';
import { useDrag } from '@use-gesture/react';

let timer = null;

const from = i => ({ x: 0, rot: 0, scale: 1, y: -1000 });

const trans = (r, s) =>
  `perspective(1500px) rotateX(0deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

const Deck = ({
  cards,
  showCards,
  setShowCards,
  currentClickId,
  fadeoutCards,
  setFadeoutCards,
  hideCardBtns,
  prevClickId,
  infoBtnClicked,
}) => {
  const toValue = i => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: (((cards.length - i) % 3) - 1) * 2,
    delay: i * 50,
  });

  const directionBtns = ['leftArrow', 'rightArrow'];
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, set] = useSprings(cards.length, i => ({
    ...toValue(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity,
    }) => {
      const trigger = velocity[0] > 0.1; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      set(i => {
        if (index !== i && gone.has(i)) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(i);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = xDelta / 100 + (isGone ? dir * 5 * velocity[0] : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit

        return isGone
          ? {
              x,
              rot,
              scale,
              delay: undefined,
              config: {
                friction: 40,
                tension: down ? 800 : isGone ? 200 : 500,
              },
            }
          : toValue(i + gone.size);
      });
      if (!down && gone.size === cards.length)
        setTimeout(() => gone.clear() || set(i => toValue(i)), 500);
    }
  );

  useEffect(() => {
    // setTimeout(() => {
      const container = document.querySelector('.slider-container');
      if (container) {
        container.style.opacity = '1';
      }
    // }, 500);
  }, [showCards, currentClickId, infoBtnClicked]);

  useEffect(() => {
    if (fadeoutCards) {
      setFadeoutCards(false);
      gone.clear();
      for (let i = cards.length - 1; i >= 0; i--) {
        gone.add(i);
      }

      set(i => {
        return from(i);
      });

      // timer = setTimeout(() => {
        const container = document.querySelector('.slider-container');
        if (container) {
          container.style.opacity = '0';
        }
      // }, 1000);
    }
  }, [fadeoutCards]);

  useEffect(() => {
    // const noArrows = false;

    function slideInitial() {
      // two event listeners below necessary for listening to info/contact button clicks while card stack is already open (not covered by the below if-statement buttons)
      const contactButton = document.querySelector('#contactBtn');
      //const infoButton = document.querySelector('#infoBtn');
      contactButton.addEventListener('click', () => {
        goToIndexSlide(cards.length - 1);
      });

      // initial clicks related to cardstack, also for clicking back and forth between buttons (not covered by above event listeners)
      //   initArrows();
      if (currentClickId === 'contactBtn') {
        goToIndexSlide(cards.length - 1);
      } else if (currentClickId === 'infoBtn') {
        goToIndexSlide(0);
      } else if (
        hideCardBtns.includes(currentClickId) ||
        directionBtns.includes(currentClickId)
      ) {
        return;
      } else {
      }
    }

    const goToIndexSlide = index => {
      gone.clear();
      for (let i = cards.length - 1; i > cards.length - 1 - index; i--) {
        gone.add(i);
      }

      set(i => {
        const isGone = gone.has(i);
        const x = isGone ? 200 + window.innerWidth : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = 1 / 100 + (isGone ? 5 * 0.1 : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = 1; // Active cards lift up a bit
        if (isGone) {
          return {
            x,
            rot,
            scale,
            delay: undefined,
            config: { friction: 40, tension: 200 },
          };
        } else {
          return toValue(i + gone.size);
        }
      });
    };

    slideInitial();
  }, [currentClickId, infoBtnClicked]);

  return (
    <div className="slider-container">
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div
          className={'SliderCards'}
          key={i}
          style={{
            transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          }}
        >
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <animated.div
            {...bind(i)}
            style={{
              transform: to([rot, scale], trans),
              backgroundImage: `url(${cards[i].file.url})`,
            }}
          />
        </animated.div>
      ))}
    </div>
  );
};

export default Deck;
