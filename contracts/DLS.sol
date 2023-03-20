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
        address[] removalRequests;
    }

    struct UserReturnItem {
        address userAddress;
        Role role;
        address[] modApprovals;
        uint256 modApprovalsLeft;
        address[] adminApprovals;
        uint256 adminApprovalsLeft;
        address[] removalRequests;
        uint256 removalRequestsLeft;
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
        address addedBy;
        address updatedBy;
        string message;
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
        UserItem memory uItem;
        uItem.userAddress = msg.sender;
        uItem.isRegistered = true;
        uItem.role = Role.Admin;
        users[msg.sender] = uItem;

        usersAddresses.push(msg.sender);
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
    function addNewModerator(
        address _newModerator
    ) public verifiedAdmin returns (bool) {
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
            delete users[_newModerator].removalRequests;
            totalModerators.increment();
        }
        return true;
    }

    //Make new Admin
    function addNewAdmin(
        address _newAdmin
    ) public verifiedAdmin returns (bool) {
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
            delete users[_newAdmin].removalRequests;
            totalAdmins.increment();
        }
        return true;
    }

    //Demote a user from the status of admin/moderator
    function demoteUser(
        address _userAddress
    ) public verifiedAdmin returns (bool) {
        require(users[_userAddress].isRegistered, "User does not exist!");
        require(
            users[_userAddress].role != Role.Visitor,
            "User cannot be demoted!"
        );

        uint256 majorityAdminCount = (totalAdmins.current() / 2) + 1;

        for (
            uint256 i = 0;
            i < users[_userAddress].removalRequests.length;
            i++
        ) {
            if (users[_userAddress].removalRequests[i] == msg.sender) {
                revert();
            }
        }
        users[_userAddress].removalRequests.push(msg.sender);

        if (users[_userAddress].removalRequests.length >= majorityAdminCount) {
            if (users[_userAddress].role == Role.Admin) {
                totalAdmins.decrement();
            } else {
                totalModerators.decrement();
            }
            users[_userAddress].role = Role.Visitor;
            delete users[_userAddress].modApprovals;
            delete users[_userAddress].adminApprovals;
        }
        return true;
    }

    // get the logged in user
    function getUser() public view returns (UserReturnItem memory) {
        return fetchUser(msg.sender);
    }

    // fetch a single user
    function fetchSingleUser(
        address userAddress
    ) public view verifiedAdmin returns (UserReturnItem memory) {
        return fetchUser(userAddress);
    }

    // fetch a specific user private function
    function fetchUser(
        address userAddress
    ) private view returns (UserReturnItem memory) {
        uint256 majorityAdminCount = (totalAdmins.current() / 2) + 1;

        UserReturnItem memory userItem;
        userItem.userAddress = users[userAddress].userAddress;
        userItem.role = users[userAddress].role;
        userItem.modApprovals = users[userAddress].modApprovals;
        userItem.modApprovalsLeft =
            majorityAdminCount -
            users[userAddress].modApprovals.length;
        userItem.adminApprovals = users[userAddress].adminApprovals;
        userItem.adminApprovalsLeft =
            majorityAdminCount -
            users[userAddress].adminApprovals.length;
        userItem.removalRequests = users[userAddress].removalRequests;
        userItem.removalRequestsLeft =
            majorityAdminCount -
            users[userAddress].removalRequests.length;

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
    function createProperty(
        string memory _ipfsHashValue
    ) public verifiedModerator {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToPropertyItem[itemId] = PropertyItem(
            itemId,
            Status.Pending,
            _ipfsHashValue,
            msg.sender,
            address(0),
            ""
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
    function rejectProperty(
        uint256 _itemId,
        string memory rejectionMessage
    ) public verifiedAdmin {
        require(
            idToPropertyItem[_itemId].status == Status.Pending,
            "Property already Approved or Rejected"
        );
        idToPropertyItem[_itemId].status = Status.Rejected;
        idToPropertyItem[_itemId].message = rejectionMessage;
        // delete idToPropertyItem[_itemId];
    }

    // Change Ownership of Property
    function changeOwnership(
        uint256 _itemId,
        string memory _ipfsHashValue
    ) public verifiedModerator {
        require(
            idToPropertyItem[_itemId].status == Status.Approved,
            "Property does not Exist or Has Not Been Approved"
        );
        ownershipChangeItems[_itemId] = PropertyItem(
            _itemId,
            Status.UnderChangeReview,
            idToPropertyItem[_itemId].ipfsHash,
            idToPropertyItem[_itemId].addedBy,
            msg.sender,
            ""
        );
        idToPropertyItem[_itemId].status = Status.UnderChangeReview;
        idToPropertyItem[_itemId].ipfsHash = _ipfsHashValue;
        idToPropertyItem[_itemId].updatedBy = msg.sender;
    }

    // Approve Change of Property Ownership
    function approveOwnershipChange(uint256 _itemId) public verifiedAdmin {
        require(
            idToPropertyItem[_itemId].status == Status.UnderChangeReview,
            "No ownership request for the designated property exists"
        );
        idToPropertyItem[_itemId].status = Status.Approved;
        delete ownershipChangeItems[_itemId];
    }

    // Reject Change of Property Ownership
    function rejectOwnershipChange(
        uint256 _itemId,
        string memory rejectionMessage
    ) public verifiedAdmin {
        require(
            idToPropertyItem[_itemId].status == Status.UnderChangeReview,
            "No ownership request for the designated property exists"
        );
        idToPropertyItem[_itemId].status = Status.Approved;
        idToPropertyItem[_itemId].ipfsHash = ownershipChangeItems[_itemId]
            .ipfsHash;
        idToPropertyItem[_itemId].updatedBy = address(0);
        idToPropertyItem[_itemId].message = rejectionMessage;
        delete ownershipChangeItems[_itemId];
    }

    //fetch a single property
    function fetchSingleProperty(
        uint256 _itemId
    ) public view returns (PropertyItem memory) {
        return idToPropertyItem[_itemId];
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
        return fetchSpecificStatusProperties(Status.Approved);
    }

    // fetch all Rejected Properties
    function fetchAllRejectedProperties()
        public
        view
        verifiedModeratorORAdmin
        returns (PropertyItem[] memory)
    {
        return fetchSpecificStatusProperties(Status.Rejected);
    }

    // fetch all Pending Properties
    function fetchAllPendingProperties()
        public
        view
        verifiedModeratorORAdmin
        returns (PropertyItem[] memory)
    {
        return fetchSpecificStatusProperties(Status.Pending);
    }

    // fetch all UnderReview Properties
    function fetchAllUnderReviewProperties()
        public
        view
        verifiedModeratorORAdmin
        returns (PropertyItem[] memory)
    {
        return fetchSpecificStatusProperties(Status.UnderChangeReview);
    }

    // fetch all UnderReview Properties
    function fetchSpecificStatusProperties(
        Status propertyStatus
    ) private view verifiedModeratorORAdmin returns (PropertyItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 propertyCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == propertyStatus) {
                propertyCount++;
            }
        }

        PropertyItem[] memory properties = new PropertyItem[](propertyCount);

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToPropertyItem[i + 1].status == propertyStatus) {
                uint256 currentId = i + 1;
                PropertyItem storage currentItem = idToPropertyItem[currentId];
                properties[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        return properties;
    }
}
