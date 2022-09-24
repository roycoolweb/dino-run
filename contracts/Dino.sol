// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { 
    ISuperfluid 
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol"; //"@superfluid-finance/ethereum-monorepo/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import { 
    IConstantFlowAgreementV1 
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {
    CFAv1Library
} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Dino is ERC721URIStorage {

    using CFAv1Library for CFAv1Library.InitData;
    
    CFAv1Library.InitData public cfaV1;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor(
        ISuperfluid host
    ) ERC721("Dino NFT", "DN") {
    cfaV1 = CFAv1Library.InitData(
        host,
        IConstantFlowAgreementV1(
            address(host.getAgreementClass(
                    keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")
                ))
            )
        );
    }
    
    function donateSuperTokens(
        address receiver,
        address token,
        int96 flowRate
    ) public {
        cfaV1.createFlow(receiver, token, flowRate);
    }

    function cancelSuperTokens(
        address sender,
        address receiver,
        address token
    ) public {
        cfaV1.deleteFlow(sender, receiver, token);
    }

    function mintNFT(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}