import Logo from "./../Icons/Logo";
import HeaderDropdown from "./HeaderDropdown";
import metamaskIcon from "../images/icons/metamask.svg";
import Arrow from "../Icons/Arrow";

export default function Header({ disconnectWallet,popupVisible, setPopupVisible, userAddress }) {
  return (
    <header className="header">
      <div className="header__wrapper container">
        <a href="/" className="logo header__logo">
          <Logo className="logo__icon" />
        </a>
        <button
          className={
            "button button--header header__button" +
            (popupVisible ? " active" : "")
          }
          onClick={userAddress ? disconnectWallet  : () => setPopupVisible(true)}
        >
          {" "}
          {userAddress
            ? `${userAddress.slice(0, 6)}...${userAddress.slice(-10)}`
            : "Connect Wallet"}
        </button>
        <div className="header__account" style={{ display: "none" }}>
          <button className="header__account-button">
            <span className="header__account-button-icon-wrapper">
              <img
                src={metamaskIcon}
                className="header__account-button-icon"
                alt="metamask"
              />
            </span>
            <span>0x7c8d1c186506...sda21</span>
            <Arrow className="header__account-button-arrow" />
          </button>
          <HeaderDropdown />
        </div>
      </div>
    </header>
  );
}
