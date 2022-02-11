import React, { useState, useEffect } from "react";
import Header from "./components/Header";

import NotificationProvider from "./contexts/NotificationProvider";
import Select from "./components/common/Select";

import ConnectPopup from "./components/ConnectPopup";
import Invest from "./components/Invest";
import Description from "./components/Description";
import Schedule from "./components/Schedule";

import { getProjects } from "./blockchain/functions";

const selectItemsArray = [
  {
    title: "Project Title",
    price: "100 BUSD",
    period: 91,
    dates: "20.02.2022 / 07.04.2022",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est met luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est met luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim",
    schedule: [
      {
        "Vesting period": 12,
        "Est. release date": "Nov 2021",
        "Tokens released": 13192000000.0,
        "% of locked supply released": "92.00%",
        id: 1,
      },
      {
        "Vesting period": 15,
        "Est. release date": "Sep 2012",
        "Tokens released": 13455034000000.0,
        "% of locked supply released": "92.00%",
        id: 2,
      },
      {
        "Vesting period": 17,
        "Est. release date": "Mar 2015",
        "Tokens released": 133250032300000.0,
        "% of locked supply released": "91.00%",
        id: 3,
      },
      {
        "Vesting period": 18,
        "Est. release date": "Dec 2022",
        "Tokens released": 1239500012300000.0,
        "% of locked supply released": "94.00%",
        id: 4,
      },
      {
        "Vesting period": 59,
        "Est. release date": "Mar 2023",
        "Tokens released": 134540000000000.0,
        "% of locked supply released": "93.00%",
        id: 5,
      },
    ],
    id: 0,
    selected: true,
  },
  {
    title: "Project Title 2",
    price: "90 BUSD",
    period: 77,
    dates: "22.02.2021 / 10.04.2022",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipissit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncumentum facilisis leo, vel fringilla est met luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est metim",
    schedule: [
      {
        "Vesting period": 91,
        "Est. release date": "Nov 2021",
        "Tokens released": 13412333333000.0,
        "% of locked supply released": "92.00%",
        id: 1,
      },
      {
        "Vesting period": 92,
        "Est. release date": "Sep 2012",
        "Tokens released": 13455454000000.0,
        "% of locked supply released": "92.00%",
        id: 2,
      },
      {
        "Vesting period": 93,
        "Est. release date": "Mar 2015",
        "Tokens released": 133250032300000.0,
        "% of locked supply released": "91.00%",
        id: 3,
      },
      {
        "Vesting period": 94,
        "Est. release date": "Dec 2022",
        "Tokens released": 1239523123300000.0,
        "% of locked supply released": "94.00%",
        id: 4,
      },
      {
        "Vesting period": 95,
        "Est. release date": "Mar 2023",
        "Tokens released": 14653440000000000.0,
        "% of locked supply released": "93.00%",
        id: 5,
      },
    ],
    id: 1,
    selected: false,
  },
  {
    title: "Project Title 3",
    price: "50 BUSD",
    period: 100,
    dates: "16.05.2021 / 18.09.2022",
    description:
      "Lorem ipsum dolor sit amet s, lectus magna fringilla urna, por, consectetur adipiscing elit ut  dolor purus non enim praesent elementum facilisis leo, vel fringilla est met ngilla urna, porttitor rhoncus luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est met luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim",
    schedule: [
      {
        "Vesting period": 76,
        "Est. release date": "Nov 2022",
        "Tokens released": 1453444423121230.0,
        "% of locked supply released": "92.00%",
        id: 1,
      },
      {
        "Vesting period": 43,
        "Est. release date": "Sep 2035",
        "Tokens released": 13434534343234200.0,
        "% of locked supply released": "92.00%",
        id: 2,
      },
      {
        "Vesting period": 23,
        "Est. release date": "Mar 2012",
        "Tokens released": 13325003345340000.0,
        "% of locked supply released": "91.00%",
        id: 3,
      },
      {
        "Vesting period": 65,
        "Est. release date": "Dec 2022",
        "Tokens released": 122343123300000.0,
        "% of locked supply released": "94.00%",
        id: 4,
      },
      {
        "Vesting period": 23,
        "Est. release date": "Mar 2022",
        "Tokens released": 146545345230000.0,
        "% of locked supply released": "96.00%",
        id: 5,
      },
    ],
    id: 2,
    selected: false,
  },
];

export default function App() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectItems, setSelectItems] = useState(selectItemsArray);
  const selectedItem = selectItems.find((item) => item.selected === true);
  const [userAddress, setUserAddress] = useState("");
  const [walletType, setWalletType] = useState("");

  const connectMetamask = async () => {
    try {
      console.log("hola");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setUserAddress(accounts[0]);
      setWalletType("Metamask");

      window.localStorage.setItem("userAddress", accounts[0]);

      //   const chainId = await window.ethereum.request({
      //     method: "eth_chainId",
      //   });

      //   if (chainId !== "0x38") {
      //     await window.ethereum.request({
      //       method: "wallet_switchEthereumChain",
      //       params: [{ chainId: "0x38" }],
      //     });
      //   }

      window.ethereum.on("accountsChanged", function (accounts) {
        setUserAddress(accounts[0]);
      });

      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );

      setPopupVisible(false);
    } catch (error) {
      console.log(error, "error"); //
    }
  };

  const getActiveProjects = async () => {
    let projects = await getProjects();
    if (projects) {
      setSelectItems(projects);
    }
  };

  useEffect(() => {
    getActiveProjects();
  }, []);

  return (
    <NotificationProvider>
      <Header
        popupVisible={popupVisible}
        userAddress={userAddress}
        setPopupVisible={setPopupVisible}
      />
      <main className="main container">
        <Select
          className="select--main main__background main__background--invest main__column main__column--1 main__column--select"
          list={selectItems}
          setList={setSelectItems}
        />
        <Description description={selectedItem.description} />
        <Schedule schedule={selectedItem.schedule} />
        <div className="main__column main__column--2">
          <Invest item={selectedItem} />
        </div>
      </main>
      <ConnectPopup
        popupVisible={popupVisible}
        setPopupVisible={setPopupVisible}
        connectMetamask={connectMetamask}
        userAddress={userAddress}
      />
    </NotificationProvider>
  );
}
