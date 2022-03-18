// SPDX-License-Identifier: --🦉--

pragma solidity =0.7.6;

import "./SafeMath.sol";
import "./IERC20.sol";
import "./Context.sol";
import "./Ownable.sol";
// NOT DONE: testing
contract GameReward is Ownable {
    using SafeMath for uint256;

    address public qdropToken;
    address public rewardAddress;

    struct DataReward {
        uint256 totalRewards;
        uint lastTimeStamp;
        uint256 lastReward;
    }

    mapping (address => DataReward) private _rewards;

    event Reward(
        address indexed to,
        uint256 value
    );

    event Claim(
        address indexed to,
        uint256 value
    );

    constructor (address _qdropToken, address payable _rewardAddress) {
        qdropToken = _qdropToken;
        rewardAddress = _rewardAddress;
    }

    function addReward(address _to, uint256 amount) public onlyOwner returns (bool) {
        require(_to != address(0x0));

        uint256 balance = IERC20(qdropToken).balanceOf(rewardAddress);
        require(amount <= balance, "No available funds.");

        IERC20(qdropToken).approve(_to, amount);

        _rewards[_to].totalRewards += amount;
        _rewards[_to].lastTimeStamp = block.timestamp;
        _rewards[_to].lastReward = amount;

        emit Reward(
            _to,
            amount
        );

        return true;
    }

    function claim(address _to) public returns (bool) {
        DataReward memory _reward = _rewards[_to];
        require(_reward.totalRewards > 0, "No claimable rewards.");

        uint256 claimable = (_reward.lastTimeStamp + 1 days < block.timestamp) ? _reward.totalRewards : (_reward.totalRewards.sub(_reward.lastReward));
        require(claimable > 0, "No claimable rewards.");

        _reward.lastReward -= claimable;

        IERC20(qdropToken).transferFrom(rewardAddress, _to, claimable);

        emit Claim(
            _to,
            claimable
        );

        return true;
    }

    function reward(address _from) public view returns (uint256, uint, uint256) {
        DataReward memory _reward = _rewards[_from];
        return (_reward.totalRewards, _reward.lastTimeStamp, _reward.lastReward);
    }
}