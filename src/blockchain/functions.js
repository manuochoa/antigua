import { abi } from "./abi";
import { ethers } from "ethers";

// projectById
// mint

let provider = new ethers.providers.JsonRpcProvider(
  "https://speedy-nodes-nyc.moralis.io/1d19a6082204e3ecd8dcf0b9/bsc/testnet"
);

let contractAddress = "0xDDF3f233A28e88069A849A62d7b71ff18529f632";

let contractInstance = new ethers.Contract(contractAddress, abi, provider);

const getDate = (date) => {
  var today = new Date(date);
  return today.toISOString().substring(0, 10);
};

export const getProjects = async () => {
  try {
    let activeProjects = await contractInstance.getActiveProjects();
    let ids = activeProjects[1];

    let projectsDetails = await Promise.all(
      await ids.map(async (el, index) => {
        let details = await contractInstance.projectById(el);
        // let countdown = await contractInstance.getCountDown(el);
        // let claimStatus = await contractInstance.getClaimStatus(el);
        // let investStatus = await contractInstance.getInvestStatus(el);
        // let payoutSymbol = await contractInstance.getPayoutSymbol(el);
        let project = {
          title: details.name,
          price: `${Number(details.price / 10 ** 18).toFixed(4)} BNB`,
          priceWei: details.price,
          period: 0,
          dates: `${getDate(details.startTime * 1000)} /${getDate(
            details.endTime * 1000
          )}`,
          description: "-",
          schedule: [{}],
          id: Number(details.id),
          selected: Number(details.id) === 0 ? true : false,
        };

        return {
          ...project,
          //   claimStatus,
          //   investStatus,
          //   countdown,
          //   payoutSymbol,
          //   selected: index === 0 ? true : false,
          id: Number(el),
        };
      })
    );
    console.log(projectsDetails);
    return projectsDetails;
  } catch (error) {
    console.log(error, "getActiveProjects");
  }
};

export const mint = async (amount, projectId, price) => {
  try {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner(0);

    let newInstance = new ethers.Contract(contractAddress, abi, signer);

    console.log(price, price * amount);
    let value = (price * amount).toString();

    let receipt = await newInstance.mint(projectId, amount, { value });

    let result = await receipt.wait();

    return result;
  } catch (error) {
    console.log(error, "Mint");
  }
};
