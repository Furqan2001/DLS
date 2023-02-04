//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";

contract DLS {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private totalAdmins;
    Counters.Counter private totalHeadAdmins;

    struct UserItem {
        address userAddress;
        bool isRegistered;
        bool isAdmin;
        bool isHeadAdmin;
    }

    address[] usersAddresses;
    mapping(address => UserItem) users;

    enum Status {
        Pending,
        UnderChangeReview,
        Approved,
        Rejected
    }

    struct PropertyItem {
        uint256 itemId;
        Status status;
        string ipfsHash;
    }

    mapping(uint256 => PropertyItem) private idToPropertyItem;
    mapping(uint256 => PropertyItem) private ownershipChangeItems;

    modifier verifiedAdmin() {
        require(users[msg.sender].isAdmin, "Unauthorized Access");
        _;
    }

    modifier verifiedHeadAdmin() {
        require(users[msg.sender].isHeadAdmin, "Unauthorized Access");
        _;
    }

    modifier verifiedAdminORHeadAdmin() {
        require(
            users[msg.sender].isAdmin || users[msg.sender].isHeadAdmin,
            "Unauthorized Access"
        );
        _;
    }

    constructor() {
        usersAddresses.push(msg.sender);
        users[msg.sender] = UserItem(msg.sender, true, false, true);
        totalHeadAdmins.increment();
    }

    // User Functions

    // Add new user.
    function registerNewUser() public returns (bool) {
        require(!users[msg.sender].isRegistered, "User already exists!");

        usersAddresses.push(msg.sender);
        users[msg.sender] = UserItem(msg.sender, true, false, false);
        return true;
    }

    // Make new Admin
    function addNewAdmin(address _newAdmin)
        public
        verifiedHeadAdmin
        returns (bool)
    {
        require(users[_newAdmin].isRegistered, "User does not exist!");
        require(!users[_newAdmin].isAdmin, "User already Admin!");

        users[_newAdmin].isAdmin = true;
        totalAdmins.increment();
        return true;
    }

    //Make new Head Admin
    function addNewHeadAdmin(address _newHeadAdmin)
        public
        verifiedHeadAdmin
        returns (bool)
    {
        require(users[_newHeadAdmin].isRegistered, "User does not exist!");
        require(!users[_newHeadAdmin].isHeadAdmin, "User already Head Admin!");

        users[_newHeadAdmin].isHeadAdmin = true;
        totalHeadAdmins.increment();
        return true;
    }

    // get a specific user
    function getUser() public view returns (UserItem memory) {
        return users[msg.sender];
    }

    // fetch all registered Users
    function fetchAllUsers()
        public
        view
        verifiedAdminORHeadAdmin
        returns (UserItem[] memory)
    {
        uint256 allUsersCount = usersAddresses.length;

        UserItem[] memory allUsers = new UserItem[](allUsersCount);
        for (uint256 i = 0; i < allUsersCount; i++) {
            address UAddress = usersAddresses[i];
            UserItem storage currentUser = users[UAddress];
            allUsers[i] = currentUser;
        }

        return allUsers;
    }

    // fetch all admins
    function fetchAllAdmins()
        public
        view
        verifiedHeadAdmin
        returns (UserItem[] memory)
    {
        uint256 allUsersCount = usersAddresses.length;
        uint256 currentIndex = 0;

        UserItem[] memory allAdmins = new UserItem[](totalAdmins.current());
        for (uint256 i = 0; i < allUsersCount; i++) {
            address UAddress = usersAddresses[i];
            if (users[UAddress].isAdmin == true) {
                UserItem storage currentUser = users[UAddress];
                allAdmins[currentIndex] = currentUser;
                currentIndex++;
            }
        }

        return allAdmins;
    }

    // fetch all headAdmins
    function fetchAllHeadAdmins()
        public
        view
        verifiedHeadAdmin
        returns (UserItem[] memory)
    {
        uint256 allUsersCount = usersAddresses.length;
        uint256 currentIndex = 0;

        UserItem[] memory allHeadAdmins = new UserItem[](
            totalHeadAdmins.current()
        );
        for (uint256 i = 0; i < allUsersCount; i++) {
            address UAddress = usersAddresses[i];
            if (users[UAddress].isHeadAdmin == true) {
                UserItem storage currentUser = users[UAddress];
                allHeadAdmins[currentIndex] = currentUser;
                currentIndex++;
            }
        }

        return allHeadAdmins;
    }

    // Property Functions

    // Create a New Property
    function createProperty(string memory _ipfsHashValue) public verifiedAdmin {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToPropertyItem[itemId] = PropertyItem(
            itemId,
            Status.Pending,
            _ipfsHashValue
        );
    }

    // Approve a Property
    function approveProperty(uint256 _itemId) public verifiedHeadAdmin {
        require(
            idToPropertyItem[_itemId].status == Status.Pending,
            "Property already Approved or Rejected"
        );
        idToPropertyItem[_itemId].status = Status.Approved;
    }

    // Reject a Property
    function rejectProperty(uint256 _itemId) public verifiedHeadAdmin {
        require(
            idToPropertyItem[_itemId].status == Status.Pending,
            "Property already Approved or Rejected"
        );
        idToPropertyItem[_itemId].status = Status.Rejected;
        // delete idToPropertyItem[_itemId];
    }

    // Change Ownership of Property
    function changeOwnership(uint256 _itemId, string memory _ipfsHashValue)
        public
        verifiedAdmin
    {
        require(
            idToPropertyItem[_itemId].status == Status.Approved,
            "Property does not Exist or Has Not Been Approved"
        );
        ownershipChangeItems[_itemId] = PropertyItem(
            _itemId,
            Status.UnderChangeReview,
            idToPropertyItem[_itemId].ipfsHash
        );
        idToPropertyItem[_itemId].status = Status.UnderChangeReview;
        idToPropertyItem[_itemId].ipfsHash = _ipfsHashValue;
    }

    // Approve Change of Property Ownership
    function approveOwnershipChange(uint256 _itemId) public verifiedHeadAdmin {
        idToPropertyItem[_itemId].status = Status.Approved;
        // idToPropertyItem[_itemId].ipfsHash = ownershipChangeItems[_itemId]
        //     .ipfsHash;
        delete ownershipChangeItems[_itemId];
    }

    // Reject Change of Property Ownership
    function rejectOwnershipChange(uint256 _itemId) public verifiedHeadAdmin {
        idToPropertyItem[_itemId].status = Status.Approved;
        idToPropertyItem[_itemId].ipfsHash = ownershipChangeItems[_itemId]
            .ipfsHash;
        delete ownershipChangeItems[_itemId];
    }

    // fetch all created Properties
    function fetchAllProperties() public view returns (PropertyItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 currentIndex = 0;

        PropertyItem[] memory properties = new PropertyItem[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1;
            PropertyItem storage currentItem = idToPropertyItem[currentId];
            properties[currentIndex] = currentItem;
            currentIndex++;
        }

        return properties;
    }

    // fetch all Approved Properties
    function fetchAllApprovedProperties()
        public
        view
        returns (PropertyItem[] memory)
    {
        uint256 itemCount = _itemIds.current();
        uint256 approvedPropertyCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == Status.Approved) {
                approvedPropertyCount++;
            }
        }

        PropertyItem[] memory properties = new PropertyItem[](
            approvedPropertyCount
        );
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == Status.Approved) {
                uint256 currentId = i + 1;
                PropertyItem storage currentItem = idToPropertyItem[currentId];
                properties[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        return properties;
    }

    // fetch all Rejected Properties
    function fetchAllRejectedProperties()
        public
        view
        verifiedAdminORHeadAdmin
        returns (PropertyItem[] memory)
    {
        uint256 itemCount = _itemIds.current();
        uint256 rejectedPropertyCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == Status.Rejected) {
                rejectedPropertyCount++;
            }
        }

        PropertyItem[] memory properties = new PropertyItem[](
            rejectedPropertyCount
        );
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == Status.Rejected) {
                uint256 currentId = i + 1;
                PropertyItem storage currentItem = idToPropertyItem[currentId];
                properties[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        return properties;
    }

    // fetch all Pending Properties
    function fetchAllPendingProperties()
        public
        view
        verifiedAdminORHeadAdmin
        returns (PropertyItem[] memory)
    {
        uint256 itemCount = _itemIds.current();
        uint256 pendingPropertyCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == Status.Pending) {
                pendingPropertyCount++;
            }
        }

        PropertyItem[] memory properties = new PropertyItem[](
            pendingPropertyCount
        );
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == Status.Pending) {
                uint256 currentId = i + 1;
                PropertyItem storage currentItem = idToPropertyItem[currentId];
                properties[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        return properties;
    }

    // fetch all UnderReview Properties
    function fetchAllUnderReviewProperties()
        public
        view
        verifiedAdminORHeadAdmin
        returns (PropertyItem[] memory)
    {
        uint256 itemCount = _itemIds.current();
        uint256 underReviewPropertyCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == Status.UnderChangeReview) {
                underReviewPropertyCount++;
            }
        }

        PropertyItem[] memory properties = new PropertyItem[](
            underReviewPropertyCount
        );
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == Status.UnderChangeReview) {
                uint256 currentId = i + 1;
                PropertyItem storage currentItem = idToPropertyItem[currentId];
                properties[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        return properties;
    }
}
