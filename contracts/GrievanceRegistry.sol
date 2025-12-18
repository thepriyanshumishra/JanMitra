// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title GrievanceRegistry
 * @dev Stores immutable records of citizen grievances on the blockchain.
 */
contract GrievanceRegistry {
    struct GrievanceRecord {
        string id;          // The internal ID (e.g., from Supabase)
        string dataHash;    // SHA-256 hash of the grievance data
        uint256 timestamp;  // Block timestamp
        address reporter;   // Wallet address of the reporter (optional)
    }

    // Mapping from Grievance ID to Record
    mapping(string => GrievanceRecord) public grievances;
    
    // Array of IDs for enumeration
    string[] public grievanceIds;

    // Event emitted when a new grievance is registered
    event GrievanceRegistered(string indexed id, string dataHash, uint256 timestamp);

    /**
     * @dev Registers a new grievance hash on the blockchain.
     * @param _id The unique ID of the grievance.
     * @param _dataHash The cryptographic hash of the grievance details.
     */
    function registerGrievance(string memory _id, string memory _dataHash) public {
        require(bytes(grievances[_id].id).length == 0, "Grievance already registered");

        GrievanceRecord memory newRecord = GrievanceRecord({
            id: _id,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            reporter: msg.sender
        });

        grievances[_id] = newRecord;
        grievanceIds.push(_id);

        emit GrievanceRegistered(_id, _dataHash, block.timestamp);
    }

    /**
     * @dev Returns the total number of registered grievances.
     */
    function getGrievanceCount() public view returns (uint256) {
        return grievanceIds.length;
    }

    /**
     * @dev Verifies if a given hash matches the stored record for an ID.
     */
    function verifyGrievance(string memory _id, string memory _dataHash) public view returns (bool) {
        return keccak256(bytes(grievances[_id].dataHash)) == keccak256(bytes(_dataHash));
    }
}
