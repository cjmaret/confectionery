import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import { useElementSize } from "@mantine/hooks"
import ImageMap from "image-map/dist/image-map"
import TruffleImageMap from "../components/TruffleImageMap"
import Screen from "../components/Screen"
import BackgroundLightsOnA from "../assets/images/BKG-A-landing.jpg"
import BackgroundLightsOffA from "../assets/images/BKG-A-lightbox.jpg"

import "normalize.css"
import "../assets/main.css"

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false)
  const [lightsOn, setLightsOn] = useState(true)
  const [showScreen, setShowScreen] = useState(false)
  const [lastClicked, setLastClicked] = useState("")
  const [currentClick, setCurrentClick] = useState("")
  const [screenCoords, setScreenCoords] = useState("")
  const [cardHeightPx, setCardHeightPx] = useState("0")
  const [cardWidthPx, setCardWidthPx] = useState("0")
  const { ref, width, height } = useElementSize()

  let cardWidth = 0
  let cardHeight = 0

  const toggleLights = () => {
    if (!lightsOn && (lastClicked === "contact" || lastClicked === "info")) {
      setLightsOn(true)
    } else if (lightsOn && lastClicked === "truffle") {
      setLightsOn(false)
    } else if (!lightsOn && lastClicked === "bg") {
      setLightsOn(true)
    }
  }

  const convertCoordsToDimensions = () => {
    if (screenCoords) {
      let coordArray = screenCoords.split(",")
      cardWidth = Math.floor(coordArray[2]) - Math.floor(coordArray[0])
      cardHeight = Math.floor(coordArray[3]) - Math.floor(coordArray[1])
    }
    setCardHeightPx(cardHeight + "px")
    setCardWidthPx(cardWidth + "px")
    // document.getElementById("cardOne").setAttribute("height", cardHeightPx)
    // document.getElementById("cardOne").setAttribute("width", cardWidthPx)
  }

  // useEffect(() => {
  //   setHasMounted(true)
  // }, [])

  useEffect(() => {
    console.log("<Home> useEffect triggered: convertCoordsToDimensions")
    console.log("ref width: " + width + " height: " + height)
    convertCoordsToDimensions()
  })

  useEffect(() => {
    console.log("<Home> useEffect triggered: setShowScreen")
    if (width !== 0 && height !== 0) {
      console.log("<Home> useEffect: setShowScreen changed")
      // setShowScreen(true)
      // setHasMounted(true)
    }
  }, [width, height])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return (
      <>
        <Helmet>
          <script src="//code.jquery.com/jquery-3.1.1.slim.min.js"></script>
          <script src="https://unpkg.com/image-map/dist/image-map.js"></script>
          <script src="https://unpkg.com/jquery/dist/jquery.js"></script>
          <script src="https://unpkg.com/image-map/dist/image-map.jquery.js"></script>
        </Helmet>
        {/* <main className="body">
          <div className="imageContainer">
            <img
              src={BackgroundLightsOnA}
              alt="Open Truffle Box on a Film Set"
              className="block fadeIn"
              height="3453"
              width="5148"
              useMap="#imgMap"
              ref={ref}
              onLoad={() => {
                ImageMap("img[usemap]")
                convertCoordsToDimensions()
              }}
            />
            <div id="cardTest" className="block"></div>
          </div>
        </main> */}
      </>
    )
  }

  if (hasMounted) {
    return (
      <>
        <Helmet>
          <script src="//code.jquery.com/jquery-3.1.1.slim.min.js"></script>
          <script src="https://unpkg.com/image-map/dist/image-map.js"></script>
          <script src="https://unpkg.com/jquery/dist/jquery.js"></script>
          <script src="https://unpkg.com/image-map/dist/image-map.jquery.js"></script>
        </Helmet>
        <main className="body">
          <div>
            <div className="imageContainer">
              {lightsOn ? (
                <img
                  src={BackgroundLightsOnA}
                  alt="Open Truffle Box on a Film Set"
                  className="block fadeIn"
                  height="3453"
                  width="5148"
                  useMap="#imgMap"
                  ref={ref}
                  onLoad={() => {
                    ImageMap("img[usemap]")
                    convertCoordsToDimensions()
                  }}
                />
              ) : (
                <img
                  src={BackgroundLightsOffA}
                  alt="Open Truffle Box on a Film Set with Lights Off"
                  className="block fadeIn"
                  height="3453"
                  width="5148"
                  useMap="#imgMap"
                  ref={ref}
                  onLoad={() => {
                    ImageMap("img[usemap]")
                    convertCoordsToDimensions()
                  }}
                />
              )}
              <div id="cardTest" className="block">
                <Screen
                  // showScreen={showScreen}
                  cardHeightPx={cardHeightPx}
                  cardWidthPx={cardWidthPx}
                />
              </div>
            </div>
            <TruffleImageMap
              id="truffleImageMap"
              setLastClicked={setLastClicked}
              setCurrentClick={setCurrentClick}
              setScreenCoords={setScreenCoords}
              width={width}
              height={height}
              onClick={toggleLights()}
            />
          </div>
        </main>
      </>
    )
  }
}
