import { useEffect, useRef, useState } from "react";
import investImage from "../images/buy.png";
import {
  checkForScrollbar,
  getScrollbarWidth,
} from "../services/scrollbarService";
import { mint, checkAllowance, approveToken } from "../blockchain/functions";
import NumberFormat from "react-number-format";
import all from "gsap/all";

export default function Invest({ userAddress, item, ...props }) {
  const scrollwrapper = useRef(null);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [isTokenAllow, setIsTokenAllow] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log(scrollVisible);
  useEffect(() => {
    setScrollVisible(checkForScrollbar(scrollwrapper.current));
  }, []);
  useEffect(() => {
    checkAllow();
  }, [item, userAddress]);

  const checkAllow = async () => {
    if (userAddress) {
      let allowance = await checkAllowance(userAddress);

      setIsTokenAllow(allowance);
    }
  };

  const approve = async () => {
    setIsLoading(true);
    let receipt = await approveToken();
    if (receipt) {
      console.log(receipt);
      checkAllow();
    }
    setIsLoading(false);
  };

  const handleInvest = async () => {
    setIsLoading(true);
    let receipt = await mint(value, item.id, item.priceWei);
    if (receipt) {
      console.log(receipt);
    }
    setIsLoading(false);
  };

  function handleInputChange({ value }) {
    setValue(value);
  }

  return (
    <div
      className={
        "main__background main__background--invest invest" +
        (scrollVisible && getScrollbarWidth() > 0 ? " scroll-visible" : "")
      }
      {...props}
    >
      <div className="scrollwrapper invest__scrollwrapper" ref={scrollwrapper}>
        <div
          className="invest__image-wrapper"
          style={{
            backgroundImage: `url(${item.URI ? item.URI : investImage})`,
          }}
        ></div>
        <h1 className="title invest__title">{item.title}</h1>
        <ul className="invest__list">
          <li className="invest__item">
            <h4 className="invest__item-title">Price</h4>
            <p className="invest__item-value">{item.price}</p>
          </li>
          <li className="invest__item">
            <h4 className="invest__item-title">Vesting Period</h4>
            <p className="invest__item-value">{item.period}</p>
          </li>
          <li className="invest__item">
            <h4 className="invest__item-title">Important Dates</h4>
            <p className="invest__item-value">{item.dates}</p>
          </li>
        </ul>
        <NumberFormat
          className="input input-wrapper__input"
          value={value}
          onValueChange={handleInputChange}
          placeholder="Enter value"
          thousandSeparator={true}
          allowLeadingZeros={false}
          allowNegative={false}
        />
        <button
          disabled={isLoading}
          className="invest__button button button--purple"
          onClick={isTokenAllow ? handleInvest : approve}
        >
          {isTokenAllow ? "Buy & Invest" : `Approve ${item.symbol}`}
        </button>
      </div>
    </div>
  );
}
