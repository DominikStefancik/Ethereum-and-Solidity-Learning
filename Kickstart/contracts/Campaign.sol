pragma solidity ^0.4.17;

contract Campaign {
    address public manager;
    
    constructor() {
        manager = msg.sender;
    }
}