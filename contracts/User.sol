// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract User is Ownable, ReentrancyGuard {
    struct UserProfile {
        string username;
        string email;
        string profileImage;
        string bio;
        bool isSeller;
        uint256 sellerRating;
        uint256 totalSales;
        uint256 totalPurchases;
        address[] createdAuctions;
        address[] purchasedItems;
        bool exists;
    }

    mapping(address => UserProfile) public users;
    mapping(string => bool) public usernames;
    address[] public allUsers;

    event UserCreated(address indexed user, string username);
    event UserUpdated(address indexed user);
    event SellerStatusChanged(address indexed user, bool isSeller);
    event RatingUpdated(address indexed seller, uint256 newRating);

    modifier onlyExistingUser() {
        require(users[msg.sender].exists, "User does not exist");
        _;
    }

    modifier onlySeller() {
        require(users[msg.sender].isSeller, "User is not a seller");
        _;
    }

    function createUser(
        string memory _username,
        string memory _email,
        string memory _profileImage,
        string memory _bio
    ) external nonReentrant {
        require(!users[msg.sender].exists, "User already exists");
        require(!usernames[_username], "Username already taken");
        require(bytes(_username).length >= 3, "Username too short");
        require(bytes(_email).length > 0, "Email required");

        users[msg.sender] = UserProfile({
            username: _username,
            email: _email,
            profileImage: _profileImage,
            bio: _bio,
            isSeller: false,
            sellerRating: 0,
            totalSales: 0,
            totalPurchases: 0,
            createdAuctions: new address[](0),
            purchasedItems: new address[](0),
            exists: true
        });

        usernames[_username] = true;
        allUsers.push(msg.sender);

        emit UserCreated(msg.sender, _username);
    }

    function updateProfile(
        string memory _email,
        string memory _profileImage,
        string memory _bio
    ) external onlyExistingUser nonReentrant {
        require(bytes(_email).length > 0, "Email required");

        users[msg.sender].email = _email;
        users[msg.sender].profileImage = _profileImage;
        users[msg.sender].bio = _bio;

        emit UserUpdated(msg.sender);
    }

    function becomeSeller() external onlyExistingUser nonReentrant {
        require(!users[msg.sender].isSeller, "Already a seller");

        users[msg.sender].isSeller = true;
        emit SellerStatusChanged(msg.sender, true);
    }

    function addCreatedAuction(address auctionAddress) external onlyExistingUser {
        users[msg.sender].createdAuctions.push(auctionAddress);
    }

    function addPurchase(address itemAddress) external onlyExistingUser {
        users[msg.sender].purchasedItems.push(itemAddress);
        users[msg.sender].totalPurchases++;
    }

    function updateSellerRating(address seller, uint256 rating) external onlyOwner {
        require(users[seller].exists, "User does not exist");
        require(users[seller].isSeller, "User is not a seller");
        require(rating <= 5, "Rating must be between 0 and 5");

        users[seller].sellerRating = rating;
        emit RatingUpdated(seller, rating);
    }

    function incrementSales(address seller) external onlyOwner {
        require(users[seller].exists, "User does not exist");
        require(users[seller].isSeller, "User is not a seller");

        users[seller].totalSales++;
    }

    function getUserProfile(address user) external view returns (
        string memory username,
        string memory email,
        string memory profileImage,
        string memory bio,
        bool isSeller,
        uint256 sellerRating,
        uint256 totalSales,
        uint256 totalPurchases,
        address[] memory createdAuctions,
        address[] memory purchasedItems
    ) {
        UserProfile memory profile = users[user];
        return (
            profile.username,
            profile.email,
            profile.profileImage,
            profile.bio,
            profile.isSeller,
            profile.sellerRating,
            profile.totalSales,
            profile.totalPurchases,
            profile.createdAuctions,
            profile.purchasedItems
        );
    }

    function getAllUsers() external view returns (address[] memory) {
        return allUsers;
    }

    function isUserSeller(address user) external view returns (bool) {
        return users[user].isSeller;
    }

    function getUserCreatedAuctions(address user) external view returns (address[] memory) {
        return users[user].createdAuctions;
    }

    function getUserPurchases(address user) external view returns (address[] memory) {
        return users[user].purchasedItems;
    }
} 