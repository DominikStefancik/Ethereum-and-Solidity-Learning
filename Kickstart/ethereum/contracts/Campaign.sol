pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimumContribution) public {
        address newCampaignAddress = new Campaign(minimumContribution, msg.sender);
        deployedCampaigns.push(newCampaignAddress);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        // contains reason why a request should be processed and the money sent to a vendor
        string description;
        // says how much money we want to send to a vendor
        uint value;
        address recipient;
        // says if the request is completed and the money sent to the vendor
        bool isCompleted;
        // number of contributors who approved the given request
        uint approvalCount;
        // a mapping of contributors who voted for approving/disapproving the given request
        mapping(address => bool) approvers;
    }
    
    Request[] public requestList;
    address public manager;
    uint public minimumContribution;
    
    // IMPORTANT: the keys are NOT stored in the mapping, only values are
    // Mapping only serves as a lookup structure, we CANNOT iterate over its keys or values
    mapping(address => bool) public contributors;
    uint public contributorsCount;
    
    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimumAmount, address creator) public {
        manager = creator;
        minimumContribution = minimumAmount;
    }
    
    function contribute() public payable {
        // msg.value contains amount of money a caller sent in the transaction
        // in order to call the "contribute" function
        require(msg.value >= minimumContribution);
        
        // IMPORTANT: the addresses are NOT stored in the mapping, only bool values are
        contributors[msg.sender] = true;
        contributorsCount++;
    }
    
    function createRequest(string description, uint value, address recipient) 
        public restrictedToManager {
        // whenever we create a new object it is located in memory
        // that's why we need to insert the keyword "memory" when we declare a new variable
        //
        // whenever we create a new instance of a struct, we need to provide values for all its 
        // VALUE type properties 
        // REFERENCE types DON'T have to be provided (here the property of mapping doesn't have to be provided)
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            isCompleted: false,
            approvalCount: 0
        });
        
        requestList.push(newRequest);
    }
    
    function approveRequest(uint requestIndex) public {
        // we want to change the request from the requestList, that's why we use "storage" keyword
        Request storage request = requestList[requestIndex];
        
        // first check if the person who wants to approve a request, contributed to the project
        require(contributors[msg.sender]);
        // then check if the person already approved the particular request
        require(!request.approvers[msg.sender]);
        
        request.approvers[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint requestIndex) public restrictedToManager {
        Request storage request = requestList[requestIndex];
        
        // we can finalise only requests which are incomplete
        require(!request.isCompleted);
        // the request can be finalised only if we have more than 50% of contributors who approved it
        require(request.approvalCount > (contributorsCount / 2));
        
        request.recipient.transfer(request.value);
        request.isCompleted = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requestList.length,
            contributorsCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requestList.length;
    }
}