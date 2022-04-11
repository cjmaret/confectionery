import React, {
  useEffect,
  createRef,
  useMemo,
  useState,
  useCallback,
} from 'react';
import SwipeCard from './SwipeCard';
let targetUrl = '';
const CardStack = ({
  cards,
  showCards,
  setShowCards,
  currentClickId,
  fadeoutCards,
  setFadeoutCards,
  hideCardBtns,
  prevClickId,
  cardBackup,
}) => {
  const directionBtns = ['leftArrow', 'rightArrow'];
  const [runAnimi, setRunAnimi] = useState(false);
  const imageUrls = cards.map(card => card.file.url);

  const childRefs = useMemo(
    () =>
      Array(imageUrls.length)
        .fill(0)
        .map(i => createRef()),
    [imageUrls]
  );
  //   const directionBtns = ['leftArrow', 'rightArrow'];

  //   // fade in animation when opening cardstaack
  useEffect(() => {
    setTimeout(() => {
      const container = document.querySelector('.slider-container');
      if (container) {
        container.style.opacity = '1';
      }
    }, 500);
  }, [showCards]);

  const swiped = image => {
    setTimeout(() => {
      const card = cardBackup.find(item => item.file.url === image);
      if (card) {
        cards.unshift(card);
        cards.pop();
        setRunAnimi(!runAnimi);
      }
    }, 300);
  };

  // fade out animation when closing cardstack
  useEffect(() => {
    if (fadeoutCards) {
      setFadeoutCards(false);
      const container = document.querySelector('.slider-container');
      container.style.opacity = '0';
      setTimeout(() => {
        setShowCards(false);
      }, 1000);
    }
  }, [fadeoutCards]);

  // Carousel JS
  useEffect(() => {
    // const noArrows = false;

    function slideInitial() {
      // two event listeners below necessary for listening to info/contact button clicks while card stack is already open (not covered by the below if-statement buttons)
      const contactButton = document.querySelector('#contactBtn');
      //const infoButton = document.querySelector('#infoBtn');
      contactButton.addEventListener('click', () => {
        goToIndexSlide(cardBackup.length - 1);
      });

      // initial clicks related to cardstack, also for clicking back and forth between buttons (not covered by above event listeners)
      //   initArrows();
      if (currentClickId === 'contactBtn') {
        goToIndexSlide(cardBackup.length - 1);
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

    const goToIndexSlide = async index => {
      const imageItem = cardBackup[index].file.url;

      while (cards[cards.length - 1].file.url !== imageItem) {
        console.log(cards[cards.length - 1].file.url, imageItem);
        const cardItem = cardBackup.find(
          item => item.file.url === cards[cards.length - 1].file.url
        );
        if (cardItem) {
          cards.unshift(cardItem);
          cards.pop();
        } else {
          break;
        }
      }

      console.log(cards);

      setRunAnimi(!runAnimi);
    };

    slideInitial();
  }, [currentClickId]);

  const swipe = useCallback(
    (i, direction = 'left') => {
      if (childRefs[i].current) {
        childRefs[i].current.swipe(direction);
        return true;
      } else {
        return false;
      }
    },
    [childRefs]
  );

  return (
    <>
      <div className="slider-container slider-container_intro">
        <div className="slider-content">
          <div className="cardContainer">
            {imageUrls.map((slide, i) => {
              return (
                <SwipeCard
                  ref={childRefs[i]}
                  className="swipe"
                  key={slide}
                  onClick={() => swipe(i)}
                  onSwipe={() => swiped(imageUrls[i])}
                >
                  <div
                    className={`card ${
                      i !== imageUrls.length - 1 &&
                      (i % 2 === 1 ? 'rot-left' : 'rot-right')
                    }`}
                    style={{
                      cursor: 'pointer',
                      backgroundImage: 'url(' + slide + ')',
                    }}
                  ></div>
                </SwipeCard>
              );
            })}
          </div>
        </div>
        ;
      </div>
      ;
    </>
  );
};

export default CardStack;
