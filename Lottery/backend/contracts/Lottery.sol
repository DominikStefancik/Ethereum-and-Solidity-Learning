pragma solidity ^0.4.17;

contract Lottery {
    // address of a person who creates the contract Lottery
    address public manager;
    address[] public players;
    
    constructor() public {
        // "msg" is a global variable available in any function inside our contract
        // it represents a transaction which goes into a function
        manager = msg.sender;
    }
    
    // "payable" says the if somebody wants to call this function, he has to pay some amount of ether
    function enter() public payable {
        // "require()" is a global function which is used for validation
        // "msg.value" uses "wei" units
        require(msg.value > 0.1 ether); // when "ether" keyword is present, the value 0.1 is automatically converted into wei
        
        // whoever calls this function, he wants to enter the lottery -> add him to the list of players
        players.push(msg.sender);
    }
    
    function generateRandomNumber() private view returns (uint) {
        // "block" and "now" are global variables
        // "block.difficulty" says how difficult it was to mine the block in the blockchain
        return uint(keccak256(block.difficulty, now, players));
    }
    
    // "restricted" is our custom modifier defined below
    function pickWinner() public calledByManager {
        uint index = generateRandomNumber() % players.length;
        
        // data type "address" is a like a class and has a set of methods 
        // "this" keyword is a reference to the contract object
        // "this.balance" contains amount of money which this contract has available to it
        players[index].transfer(this.balance);
        
        // after the money is transfered to an address, we want to reset the contract state by 
        // reinitialising the array of players to an empty array
        players = new address[](0); // assign a new array with no players in it
    }
    
    // this defines a new function modifier which will be added to our contract
    // function modifiers are for reducing repeating code
    modifier calledByManager() {
        require(msg.sender == manager); // only manager can call this function
        _; // this statement takes the content (all statements) of the function to which the modifier is attached
           // and puts it to this place (this is done by the compiler behind the scenes) 
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}