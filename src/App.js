import React, { useState, useEffect } from "react";
import Header from "./components/Header";

import NotificationProvider from "./contexts/NotificationProvider";
import Select from "./components/common/Select";

import ConnectPopup from "./components/ConnectPopup";
import Invest from "./components/Invest";
import Description from "./components/Description";
import Schedule from "./components/Schedule";

import { getProjects, createProject } from "./blockchain/functions";

import { Switch, Route, Redirect } from "react-router-dom";

const selectItemsArray = [
  {
    title: "",
    price: "",
    period: 0,
    dates: "",
    description: "",
    schedule: [{}],
    id: 0,
    selected: true,
  },
  //   {
  //     title: "Project Title 3",
  //     price: "50 BUSD",
  //     period: 100,
  //     dates: "16.05.2021 / 18.09.2022",
  //     description:
  //       "Lorem ipsum dolor sit amet s, lectus magna fringilla urna, por, consectetur adipiscing elit ut  dolor purus non enim praesent elementum facilisis leo, vel fringilla est met ngilla urna, porttitor rhoncus luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est met luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim",
  //     schedule: [
  //       {
  //         "Vesting period": 76,
  //         "Est. release date": "Nov 2022",
  //         "Tokens released": 1453444423121230.0,
  //         "% of locked supply released": "92.00%",
  //         id: 1,
  //       },
  //       {
  //         "Vesting period": 43,
  //         "Est. release date": "Sep 2035",
  //         "Tokens released": 13434534343234200.0,
  //         "% of locked supply released": "92.00%",
  //         id: 2,
  //       },
  //       {
  //         "Vesting period": 23,
  //         "Est. release date": "Mar 2012",
  //         "Tokens released": 13325003345340000.0,
  //         "% of locked supply released": "91.00%",
  //         id: 3,
  //       },
  //       {
  //         "Vesting period": 65,
  //         "Est. release date": "Dec 2022",
  //         "Tokens released": 122343123300000.0,
  //         "% of locked supply released": "94.00%",
  //         id: 4,
  //       },
  //       {
  //         "Vesting period": 23,
  //         "Est. release date": "Mar 2022",
  //         "Tokens released": 146545345230000.0,
  //         "% of locked supply released": "96.00%",
  //         id: 5,
  //       },
  //     ],
  //     id: 2,
  //     selected: false,
  //   },
];

export default function App() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectItems, setSelectItems] = useState(selectItemsArray);
  const selectedItem = selectItems.find((item) => item.selected === true);
  const [userAddress, setUserAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [newProject, setNewProject] = useState({
    name: "",
    uri: "",
    price: "",
    maxSupply: "",
    startTime: "",
    endTime: "",
    projectWallet: "",
    description: "",
    schedule: [],
  });

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

  const handleCreate = async () => {
    let result = await createProject(newProject);
    if (result) {
      console.log(result);
    }
  };

  const addSchedule = () => {
    if (!newProject.schedule) {
      setNewProject({
        ...newProject,
        schedule: [
          {
            "% of locked supply released": "",
            "Est. release date": "",
            "Tokens released": "",
            "Vesting period": "",
            id: newProject.schedule.length,
          },
        ],
      });
    } else {
      let newSchedule = newProject.schedule;
      newSchedule.push({
        "% of locked supply released": "",
        "Est. release date": "",
        "Tokens released": "",
        "Vesting period": "",
        id: newProject.schedule.length,
      });
      setNewProject({
        ...newProject,
        schedule: newSchedule,
      });
    }
    console.log(newProject.schedule);
  };
  const removeSchedule = () => {
    if (newProject.schedule) {
      let newSchedule = newProject.schedule;
      newSchedule.pop();
      setNewProject({
        ...newProject,
        schedule: newSchedule,
      });
    }
    console.log(newProject.schedule);
  };

  useEffect(() => {
    let user = window.localStorage.getItem("userAddress");

    if (user) {
      connectMetamask();
    }
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
        <Switch>
          <Route path="/" exact>
            <Select
              className="select--main main__background main__background--invest main__column main__column--1 main__column--select"
              list={selectItems}
              setList={setSelectItems}
            />
            <Description description={selectedItem?.description} />
            <Schedule schedule={selectedItem?.schedule} />
            <div className="main__column main__column--2">
              <Invest item={selectedItem} userAddress={userAddress} />
            </div>
          </Route>
        </Switch>
        <Switch>
          <Route path="/create" exact>
            <div className="main__column main__column--2">
              <h2>Create</h2>
              <h4>Name:</h4>
              <input
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    name: e.target.value,
                  })
                }
                type="text"
              />
              <h4>Price:</h4>
              <input
                value={newProject.price}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    price: e.target.value,
                  })
                }
                type="number"
              />
              <h4>Supply:</h4>
              <input
                value={newProject.maxSupply}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    maxSupply: e.target.value,
                  })
                }
                type="number"
              />
              <h4>Start:</h4>
              <input
                value={newProject.startTime}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    startTime: e.target.value,
                  })
                }
                type="number"
              />
              <h4>End:</h4>
              <input
                value={newProject.endTime}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    endTime: e.target.value,
                  })
                }
                type="number"
              />
              <h4>Project Wallet:</h4>
              <input
                value={newProject.projectWallet}
                onPaste={(e) =>
                  setNewProject({
                    ...newProject,
                    projectWallet: e.target.value,
                  })
                }
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    projectWallet: e.target.value,
                  })
                }
                type="text"
              />
              <h4>Description:</h4>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    description: e.target.value,
                  })
                }
                name="description"
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <br />

              {newProject.schedule &&
                newProject.schedule.map((el, index) => {
                  return (
                    <div key={index}>
                      <h3>Release details</h3>
                      <input
                        type="text"
                        placeholder="% of locked supply released"
                        onChange={(e) => {
                          let newSchedule = newProject.schedule;
                          newSchedule[index]["% of locked supply released"] =
                            e.target.value;
                          setNewProject({
                            ...newProject,
                            schedule: newSchedule,
                          });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Est. release date"
                        onChange={(e) => {
                          let newSchedule = newProject.schedule;
                          newSchedule[index]["Est. release date"] =
                            e.target.value;
                          setNewProject({
                            ...newProject,
                            schedule: newSchedule,
                          });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Tokens released"
                        onChange={(e) => {
                          let newSchedule = newProject.schedule;
                          newSchedule[index]["Tokens released"] =
                            e.target.value;
                          setNewProject({
                            ...newProject,
                            schedule: newSchedule,
                          });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Vesting period"
                        onChange={(e) => {
                          let newSchedule = newProject.schedule;
                          newSchedule[index]["Vesting period"] = e.target.value;
                          setNewProject({
                            ...newProject,
                            schedule: newSchedule,
                          });
                        }}
                      />
                    </div>
                  );
                })}
              <button
                className="invest__button button button--purple"
                onClick={addSchedule}
              >
                add release
              </button>
              <button
                className="invest__button button button--purple"
                onClick={removeSchedule}
              >
                remove release
              </button>
              <br />
              <button
                // disabled={isLoading}
                className="invest__button button button--purple"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </Route>
        </Switch>
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
