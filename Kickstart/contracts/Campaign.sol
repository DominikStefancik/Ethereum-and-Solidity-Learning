pragma solidity ^0.4.17;

contract Campaign {
    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    
    constructor(uint minimumAmount) public {
        manager = msg.sender;
        minimumContribution = minimumAmount;
    }
    
    function contribute() public payable {
        // msg.value contains amount of money a caller sent in the transaction
        // in order to call this function
        require(msg.value >= minimumContribution);
        
        approvers.push(msg.sender);
    }
}