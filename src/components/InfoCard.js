import React from "react"

const InfoCard = ({ cards }) => {
  const infoCard = cards.card_info.images.fallback.src
  return (
    <div className="cardContainer">
      <img
        id="infoCard"
        className="screenImage"
        src={infoCard}
        alt="Try a sample by selecting a truffle"
      />
      <div className="topCard"></div>
      <div className="middleCard"></div>
      <div className="bottomCard"></div>
    </div>
  )
}

export default InfoCard
