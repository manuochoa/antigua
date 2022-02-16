import { abi } from "./abi";
import { ethers } from "ethers";
import axios from "axios";
import Moralis from "moralis";

const serverUrl = "https://976agwdn6f4b.moralishost.com:2053/server";
const appId = "kR1EIjrVMujm4cJuQEGZQuAZR65tZ7WSLFXkJvLK";
Moralis.start({ serverUrl, appId });

// projectById
// mint
let busdAbi = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

let provider = new ethers.providers.JsonRpcProvider(
  "https://speedy-nodes-nyc.moralis.io/1d19a6082204e3ecd8dcf0b9/bsc/testnet"
);

let contractAddress = "0x8f7b6A8CF106ff613358384A8CF961Fced6ACFB4";
let busdAddress = "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7";

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
        let metadata = {
          description: "",
          schedule: [{}],
        };

        try {
          let data = await axios.get(details.uri);
          metadata = data.data;
        } catch (error) {
          console.log(error, "axios metadata");
        }
        let project = {
          title: details.name,
          price: `${Number(details.price / 10 ** 18).toFixed(4)} ${
            details.paymentSymbol
          }`,
          priceWei: details.price,
          period: 0,
          dates: `${getDate(details.startTime * 1000)} /${getDate(
            details.endTime * 1000
          )}`,
          description: "-",
          symbol: details.paymentSymbol,
          id: Number(details.id),
          selected: Number(details.id) === 0 ? true : false,
          paymentToken: details.paymentToken,
          ...metadata,
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

    let receipt = await newInstance.mint(projectId, amount);

    let result = await receipt.wait();

    return result;
  } catch (error) {
    console.log(error, "Mint");
  }
};

export const checkAllowance = async (userAddress) => {
  try {
    let tokenInstance = new ethers.Contract(busdAddress, busdAbi, provider);

    let allowance = await tokenInstance.allowance(userAddress, contractAddress);

    return allowance > 0;
  } catch (error) {
    console.log(error, "check allowance");
  }
};

export const approveToken = async () => {
  try {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner(0);

    let tokenInstance = new ethers.Contract(busdAddress, busdAbi, signer);
    const maxInt =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    let tx = await tokenInstance.approve(contractAddress, maxInt);
    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "approveBUSD");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const createProject = async (data) => {
  try {
    let {
      name,
      price,
      maxSupply,
      startTime,
      endTime,
      projectWallet,
      description,
      schedule,
      URI,
      Hash,
    } = data;
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.authenticate({
        signingMessage: "Antigua Ventures Project Creator",
      });
    }
    const metadata = new Moralis.File("metadata.json", {
      base64: btoa(
        JSON.stringify({
          description,
          schedule,
          URI,
          Hash,
        })
      ),
    });
    await metadata.saveIPFS();

    let _price = ethers.utils.parseUnits(price.toString(), "ether");

    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner(0);
    let newInstance = new ethers.Contract(contractAddress, abi, signer);

    let receipt = await newInstance.createProject(
      name,
      metadata._ipfs,
      _price,
      maxSupply,
      startTime,
      endTime,
      projectWallet
    );
    let result = await receipt.wait();
    return result;
  } catch (error) {
    console.log(error, "createProject");
  }
};

export async function uploadFile(data) {
  try {
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.authenticate({
        signingMessage: "Antigua Ventures Project Creator",
      });
    }
    const fileToUpload = new Moralis.File(data.name, data);
    fileToUpload.type = data.type;
    await fileToUpload.saveIPFS();

    return fileToUpload;
  } catch (error) {
    console.log(error);
  }
}

// function createProject (string memory _name, string memory _uri, uint256 _price, uint256 _maxSupply, uint256 _startTime, uint256 _endTime, address _projectWallet, address _paymentToken)
