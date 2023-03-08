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
        Role role;
        address[] modApprovals;
        address[] adminApprovals;
    }

    struct UserReturnItem {
        address userAddress;
        Role role;
        address[] modApprovals;
        uint256 modApprovalsLeft;
        address[] adminApprovals;
        uint256 adminApprovalsLeft;
    }

    address[] usersAddresses;
    mapping(address => UserItem) users;

    enum Role {
        Visitor,
        Moderator,
        Admin
    }

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
        require(
            users[msg.sender].role == Role.Moderator,
            "Unauthorized Access"
        );
        _;
    }

    modifier verifiedAdmin() {
        require(users[msg.sender].role == Role.Admin, "Unauthorized Access");
        _;
    }

    modifier verifiedModeratorORAdmin() {
        require(
            users[msg.sender].role == Role.Moderator ||
                users[msg.sender].role == Role.Admin,
            "Unauthorized Access"
        );
        _;
    }

    constructor() {
        usersAddresses.push(msg.sender);

        UserItem memory uItem;
        uItem.userAddress = msg.sender;
        uItem.isRegistered = true;
        uItem.role = Role.Admin;
        users[msg.sender] = uItem;
        totalAdmins.increment();
    }

    // User Functions

    // Add new user.
    function registerNewUser() public returns (bool) {
        require(!users[msg.sender].isRegistered, "User already exists!");

        UserItem memory uItem;
        uItem.userAddress = msg.sender;
        uItem.isRegistered = true;
        uItem.role = Role.Visitor;
        users[msg.sender] = uItem;

        usersAddresses.push(msg.sender);
        users[msg.sender] = uItem;
        return true;
    }

    // Make new Moderator
    function addNewModerator(address _newModerator)
        public
        verifiedAdmin
        returns (bool)
    {
        require(users[_newModerator].isRegistered, "User does not exist!");
        require(
            users[_newModerator].role == Role.Visitor,
            "User cannot be promoted to a Moderator!"
        );

        uint256 majorityAdminCount = (totalAdmins.current() / 2) + 1;

        for (uint256 i = 0; i < users[_newModerator].modApprovals.length; i++) {
            if (users[_newModerator].modApprovals[i] == msg.sender) {
                revert();
            }
        }

        users[_newModerator].modApprovals.push(msg.sender);

        if (users[_newModerator].modApprovals.length >= majorityAdminCount) {
            users[_newModerator].role = Role.Moderator;
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
        require(
            users[_newAdmin].role == Role.Moderator,
            "User cannot be promoted to an Admin!"
        );

        uint256 majorityAdminCount = (totalAdmins.current() / 2) + 1;

        for (uint256 i = 0; i < users[_newAdmin].adminApprovals.length; i++) {
            if (users[_newAdmin].adminApprovals[i] == msg.sender) {
                revert();
            }
        }
        users[_newAdmin].adminApprovals.push(msg.sender);

        if (users[_newAdmin].adminApprovals.length >= majorityAdminCount) {
            users[_newAdmin].role = Role.Admin;
            totalAdmins.increment();
        }
        return true;
    }

    // get a specific user
    function getUser() public view returns (UserReturnItem memory) {
        uint256 majorityAdminCount = (totalAdmins.current() / 2) + 1;

        UserReturnItem memory userItem;
        userItem.userAddress = users[msg.sender].userAddress;
        userItem.role = users[msg.sender].role;
        userItem.modApprovals = users[msg.sender].modApprovals;
        userItem.modApprovalsLeft =
            majorityAdminCount -
            users[msg.sender].modApprovals.length;
        userItem.adminApprovals = users[msg.sender].adminApprovals;
        userItem.adminApprovalsLeft =
            majorityAdminCount -
            users[msg.sender].adminApprovals.length;

        return userItem;
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
            if (users[UAddress].role == Role.Moderator) {
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
            if (users[UAddress].role == Role.Admin) {
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
