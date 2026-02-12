// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title TruthLens
 * @dev Digital notary for image verification on Polygon Mumbai
 */
contract TruthLens {
    
    struct Verification {
        bytes32 imageHash;           // SHA-256 hash of image
        string ipfsCid;              // IPFS content identifier
        int256 latitude;             // GPS latitude (multiplied by 1e6)
        int256 longitude;            // GPS longitude (multiplied by 1e6)
        uint256 timestamp;           // Block timestamp
        address verifier;            // Who verified this
        string aiAnalysis;           // AI analysis result (JSON string)
        bool exists;                 // Check if verification exists
    }
    
    // Mapping from verification ID to Verification
    mapping(bytes32 => Verification) public verifications;
    
    // Mapping from user address to their verification IDs
    mapping(address => bytes32[]) public userVerifications;
    
    // Array of all verification IDs
    bytes32[] public allVerificationIds;
    
    // Events
    event ImageVerified(
        bytes32 indexed verificationId,
        bytes32 indexed imageHash,
        address indexed verifier,
        uint256 timestamp,
        string ipfsCid
    );
    
    /**
     * @dev Create a new verification record
     * @param _imageHash SHA-256 hash of the image
     * @param _ipfsCid IPFS content identifier
     * @param _latitude GPS latitude (multiplied by 1e6)
     * @param _longitude GPS longitude (multiplied by 1e6)
     * @param _aiAnalysis AI analysis result as JSON string
     * @return verificationId Unique identifier for this verification
     */
    function createVerification(
        bytes32 _imageHash,
        string memory _ipfsCid,
        int256 _latitude,
        int256 _longitude,
        string memory _aiAnalysis
    ) external returns (bytes32) {
        // Generate unique verification ID
        bytes32 verificationId = keccak256(
            abi.encodePacked(
                _imageHash,
                msg.sender,
                block.timestamp,
                block.number
            )
        );
        
        require(!verifications[verificationId].exists, "Verification already exists");
        
        // Create verification record
        verifications[verificationId] = Verification({
            imageHash: _imageHash,
            ipfsCid: _ipfsCid,
            latitude: _latitude,
            longitude: _longitude,
            timestamp: block.timestamp,
            verifier: msg.sender,
            aiAnalysis: _aiAnalysis,
            exists: true
        });
        
        // Add to user's verifications
        userVerifications[msg.sender].push(verificationId);
        
        // Add to global list
        allVerificationIds.push(verificationId);
        
        // Emit event
        emit ImageVerified(
            verificationId,
            _imageHash,
            msg.sender,
            block.timestamp,
            _ipfsCid
        );
        
        return verificationId;
    }
    
    /**
     * @dev Get verification by ID
     * @param _verificationId The verification ID
     */
    function getVerification(bytes32 _verificationId) 
        external 
        view 
        returns (
            bytes32 imageHash,
            string memory ipfsCid,
            int256 latitude,
            int256 longitude,
            uint256 timestamp,
            address verifier,
            string memory aiAnalysis
        ) 
    {
        require(verifications[_verificationId].exists, "Verification does not exist");
        
        Verification memory v = verifications[_verificationId];
        return (
            v.imageHash,
            v.ipfsCid,
            v.latitude,
            v.longitude,
            v.timestamp,
            v.verifier,
            v.aiAnalysis
        );
    }
    
    /**
     * @dev Verify an image hash exists
     * @param _imageHash The image hash to check
     */
    function verifyImageHash(bytes32 _imageHash) 
        external 
        view 
        returns (bool exists, bytes32 verificationId) 
    {
        // Search through all verifications (not gas efficient for production)
        // In production, use a mapping: imageHash => verificationId
        for (uint i = 0; i < allVerificationIds.length; i++) {
            bytes32 vId = allVerificationIds[i];
            if (verifications[vId].imageHash == _imageHash) {
                return (true, vId);
            }
        }
        return (false, bytes32(0));
    }
    
    /**
     * @dev Get all verification IDs for a user
     * @param _user The user address
     */
    function getUserVerifications(address _user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userVerifications[_user];
    }
    
    /**
     * @dev Get total number of verifications
     */
    function getTotalVerifications() external view returns (uint256) {
        return allVerificationIds.length;
    }
}