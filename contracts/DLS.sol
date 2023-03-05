//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";

contract DLS {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private totalModerators;
    Counters.Counter private totalAdmins;

    struct UserItem {
        address userAddress;
        bool isRegistered;
        uint256 modApprovals;
        bool isModerator;
        uint256 adminApprovals;
        bool isAdmin;
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

    modifier verifiedModerator() {
        require(users[msg.sender].isModerator, "Unauthorized Access");
        _;
    }

    modifier verifiedAdmin() {
        require(users[msg.sender].isAdmin, "Unauthorized Access");
        _;
    }

    modifier verifiedModeratorORAdmin() {
        require(
            users[msg.sender].isModerator || users[msg.sender].isAdmin,
            "Unauthorized Access"
        );
        _;
    }

    constructor() {
        usersAddresses.push(msg.sender);
        users[msg.sender] = UserItem(msg.sender, true, 0, false, 0, true);
        totalAdmins.increment();
    }

    // User Functions

    // Add new user.
    function registerNewUser() public returns (bool) {
        require(!users[msg.sender].isRegistered, "User already exists!");

        usersAddresses.push(msg.sender);
        users[msg.sender] = UserItem(msg.sender, true, 0, false, 0, false);
        return true;
    }

    // Make new Moderator
    function addNewModerator(address _newModerator)
        public
        verifiedAdmin
        returns (bool)
    {
        require(users[_newModerator].isRegistered, "User does not exist!");
        require(!users[_newModerator].isModerator, "User already Moderator!");

        uint256 majorityAdminCount = (totalAdmins.current() / 2) + 1;
        users[_newModerator].modApprovals++;

        if (users[_newModerator].modApprovals >= majorityAdminCount) {
            users[_newModerator].isModerator = true;
            totalModerators.increment();
        }
        return true;
    }

    //Make new Admin
    function addNewAdmin(address _newAdmin)
        public
        verifiedAdmin
        returns (bool)
    {
        require(users[_newAdmin].isRegistered, "User does not exist!");
        require(!users[_newAdmin].isAdmin, "User already Admin!");

        uint256 majorityAdminCount = (totalAdmins.current() / 2) + 1;
        users[_newAdmin].adminApprovals++;

        if (users[_newAdmin].adminApprovals >= majorityAdminCount) {
            users[_newAdmin].isAdmin = true;
            totalAdmins.increment();
        }
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
        verifiedModeratorORAdmin
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

    // fetch all Moderators
    function fetchAllModerators()
        public
        view
        verifiedAdmin
        returns (UserItem[] memory)
    {
        uint256 allUsersCount = usersAddresses.length;
        uint256 currentIndex = 0;

        UserItem[] memory allModerators = new UserItem[](
            totalModerators.current()
        );
        for (uint256 i = 0; i < allUsersCount; i++) {
            address UAddress = usersAddresses[i];
            if (users[UAddress].isModerator == true) {
                UserItem storage currentUser = users[UAddress];
                allModerators[currentIndex] = currentUser;
                currentIndex++;
            }
        }

        return allModerators;
    }

    // fetch all Admins
    function fetchAllAdmins()
        public
        view
        verifiedAdmin
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

    // Property Functions

    // Create a New Property
    function createProperty(string memory _ipfsHashValue)
        public
        verifiedModerator
    {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToPropertyItem[itemId] = PropertyItem(
            itemId,
            Status.Pending,
            _ipfsHashValue
        );
    }

    // Approve a Property
    function approveProperty(uint256 _itemId) public verifiedAdmin {
        require(
            idToPropertyItem[_itemId].status == Status.Pending,
            "Property already Approved or Rejected"
        );
        idToPropertyItem[_itemId].status = Status.Approved;
    }

    // Reject a Property
    function rejectProperty(uint256 _itemId) public verifiedAdmin {
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
        verifiedModerator
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
    function approveOwnershipChange(uint256 _itemId) public verifiedAdmin {
        idToPropertyItem[_itemId].status = Status.Approved;
        // idToPropertyItem[_itemId].ipfsHash = ownershipChangeItems[_itemId]
        //     .ipfsHash;
        delete ownershipChangeItems[_itemId];
    }

    // Reject Change of Property Ownership
    function rejectOwnershipChange(uint256 _itemId) public verifiedAdmin {
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
        verifiedModeratorORAdmin
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
        verifiedModeratorORAdmin
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
        verifiedModeratorORAdmin
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
