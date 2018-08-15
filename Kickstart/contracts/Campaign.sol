pragma solidity ^0.4.17;

contract Campaign {
    struct Request {
        // contains reason why a request should be processed and the money sent to a vendor
        string description;
        // says how much money we ant to send to a vendor
        uint value;
        address recipient;
        // says if the request is completed and the money sent to the vendor
        bool isCompleted;
    }
    
    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    Request[] public requestList;
    
    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }
    
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
    
    function createRequest(string description, uint value, address recipient) 
        public restrictedToManager {
        Request newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            isCompleted: false
        });
        
        requestList.push(newRequest);
    }
}