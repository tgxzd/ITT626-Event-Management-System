// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventPayment {
    address public owner;
    mapping(uint256 => mapping(address => bool)) public registrations;
    mapping(uint256 => uint256) public eventPrices;
    mapping(uint256 => address) public eventOrganizers;

    event EventRegistered(uint256 eventId, address attendee);
    event EventPriceSet(uint256 eventId, uint256 price);
    event PaymentReceived(uint256 eventId, address attendee, uint256 amount);
    event PaymentWithdrawn(uint256 eventId, address organizer, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyEventOrganizer(uint256 eventId) {
        require(msg.sender == eventOrganizers[eventId], "Only event organizer can call this function");
        _;
    }

    function setEventPrice(uint256 eventId, uint256 price) external {
        require(msg.sender == owner || msg.sender == eventOrganizers[eventId], "Unauthorized");
        eventPrices[eventId] = price;
        emit EventPriceSet(eventId, price);
    }

    function setEventOrganizer(uint256 eventId, address organizer) external onlyOwner {
        eventOrganizers[eventId] = organizer;
    }

    function registerForEvent(uint256 eventId) external payable {
        require(!registrations[eventId][msg.sender], "Already registered");
        require(msg.value == eventPrices[eventId], "Incorrect payment amount");

        registrations[eventId][msg.sender] = true;
        emit EventRegistered(eventId, msg.sender);
        emit PaymentReceived(eventId, msg.sender, msg.value);
    }

    function withdrawPayments(uint256 eventId) external onlyEventOrganizer(eventId) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No payments to withdraw");

        (bool sent, ) = payable(msg.sender).call{value: balance}("");
        require(sent, "Failed to withdraw payment");

        emit PaymentWithdrawn(eventId, msg.sender, balance);
    }

    function isRegistered(uint256 eventId, address attendee) external view returns (bool) {
        return registrations[eventId][attendee];
    }

    function getEventPrice(uint256 eventId) external view returns (uint256) {
        return eventPrices[eventId];
    }
} 