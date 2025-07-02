// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract QRPrizeCampaign {
    using SafeMath for uint256;

    address public platformOwner;
    uint256 public platformFeePercent = 10;

    struct Campaign {
        address company;
        uint256 endTime;
        uint256 prizePerWinner;
        uint256 totalPrizes;
        uint256 prizesClaimed;
        uint256 totalFunds;
        bytes32[] winningHashes;
        mapping(bytes32 => bool) isWinningHash;
        mapping(bytes32 => bool) isClaimedHash;
        mapping(address => bool) hasClaimed;
        bool isEnded;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) private campaigns;

    event CampaignCreated(
        uint256 campaignId,
        address company,
        uint256 totalFunds,
        uint256 prizePerWinner,
        uint256 endTime
    );

    event PrizeClaimed(uint256 campaignId, address winner, bytes32 qrHash);
    event CampaignEnded(uint256 campaignId, uint256 platformFee);

    constructor() {
        platformOwner = msg.sender;
    }

    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner, "Not platform owner");
        _;
    }

    function createCampaign(uint256 _totalPrizes, uint256 _prizePerWinner, uint256 _durationInSeconds) external payable {
        require(msg.value == _totalPrizes.mul(_prizePerWinner), "Incorrect total funds sent");
        require(_totalPrizes > 0, "Must have at least one prize");
        require(_durationInSeconds > 0, "Duration must be positive");

        campaignCount++;
        Campaign storage c = campaigns[campaignCount];

        c.company = msg.sender;
        c.endTime = block.timestamp + _durationInSeconds;
        c.prizePerWinner = _prizePerWinner;
        c.totalPrizes = _totalPrizes;
        c.totalFunds = msg.value;

        for (uint256 i = 0; i < _totalPrizes; i++) {
            bytes32 hash = keccak256(abi.encodePacked(block.timestamp, msg.sender, campaignCount, i));
            c.winningHashes.push(hash);
            c.isWinningHash[hash] = true;
        }

        emit CampaignCreated(campaignCount, msg.sender, msg.value, _prizePerWinner, c.endTime);
    }

    function claimPrize(uint256 _campaignId, bytes32 _qrHash) external {
        Campaign storage c = campaigns[_campaignId];

        require(block.timestamp <= c.endTime, "Campaign ended");
        require(c.isWinningHash[_qrHash], "Not a winning QR hash");
        require(!c.isClaimedHash[_qrHash], "QR already claimed");
        require(!c.hasClaimed[msg.sender], "Address already claimed");
        require(address(this).balance >= c.prizePerWinner, "Insufficient balance");

        c.isClaimedHash[_qrHash] = true;
        c.hasClaimed[msg.sender] = true;
        c.prizesClaimed++;

        (bool sent, ) = msg.sender.call{value: c.prizePerWinner}("");
        require(sent, "Transfer failed");

        emit PrizeClaimed(_campaignId, msg.sender, _qrHash);
    }

    function endCampaign(uint256 _campaignId) external {
        Campaign storage c = campaigns[_campaignId];

        require(block.timestamp > c.endTime, "Campaign still active");
        require(!c.isEnded, "Already ended");

        uint256 remainingFunds = c.totalFunds.sub(c.prizesClaimed.mul(c.prizePerWinner));
        uint256 platformFee = remainingFunds.mul(platformFeePercent).div(100);
        uint256 companyRefund = remainingFunds.sub(platformFee);

        c.isEnded = true;

        if (platformFee > 0) {
            (bool sentPlatform, ) = platformOwner.call{value: platformFee}("");
            require(sentPlatform, "Platform fee transfer failed");
        }

        if (companyRefund > 0) {
            (bool sentCompany, ) = c.company.call{value: companyRefund}("");
            require(sentCompany, "Company refund transfer failed");
        }

        emit CampaignEnded(_campaignId, platformFee);
    }

    function getCampaignBalance(uint256 _campaignId) external view returns (uint256) {
        Campaign storage c = campaigns[_campaignId];
        return c.totalFunds.sub(c.prizesClaimed.mul(c.prizePerWinner));
    }

    function getWinningHashes(uint256 _campaignId) external view returns (bytes32[] memory) {
        Campaign storage c = campaigns[_campaignId];
        return c.winningHashes;
    }
}
