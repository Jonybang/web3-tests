pragma solidity ^0.4.0;

contract ValidatorsList {
    address owner;
    address masterOfCeremony = 0xe091c3a55485bc1b09472d30a8a40ffb2c86d090;
    uint votesToBecameValidator = 1;
    
    address[] validators;
    
    mapping(address => Candidate) candidates;
    
    struct Candidate {
        address accountAddress;
        string fullName;
        string city;
        string minerCreation;
        string licenseExpiration;
        uint licenseId;
        uint votes;
        bool isValidator;
        bool isValue;
        mapping(address => bool) voters;
    }
    
    modifier isVoted(address validator, address candidate) {
        require(candidates[candidate].voters[validator] == false);
        _;
    }
    
    modifier isValidator(address validator, address candidate) {
        bool isValidator = false;
        
        for (uint i = 0; i < validators.length; i++) {
            if (validators[i] == validator) isValidator = true;
        }
        
        require(isValidator == true);
        _;
    }
    
    function ValidatorsList() public {
        validators.push(masterOfCeremony);
        
        candidates[masterOfCeremony] = Candidate(
            0x6087193278c66d65b014390d28b5fF90d344D957,
            "Panichev Evgenii",
            "Kaliningrad",
            "27-03-2018",
            "1-01-2025",
            1,
            100,
            true,
            true
        );
    }
    
    function setCandidate(address accountAddress,
                          string fullName,
                          string city,
                          string minerCreation,
                          string licenseExpiration,
                          uint licenseId) public
    {
        assert(accountAddress != 0 || accountAddress != 0x0);
        assert(bytes(fullName).length != 0);
        assert(bytes(city).length != 0);
        assert(bytes(minerCreation).length != 0);
        assert(bytes(licenseExpiration).length != 0);
        assert(licenseId > 0);
        
        Candidate memory c = Candidate(
            accountAddress,
            fullName,
            city,
            minerCreation,
            licenseExpiration,
            licenseId,
            0,
            false,
            true
        );
        
        candidates[accountAddress] = c;
    }
    
    function getValidators() public view returns (address[]) {
        address[] memory addrs = new address[](validators.length);
        
        for (uint i = 0; i < validators.length; i++) {
            addrs[i] = validators[i];
        }
        
        return (addrs);
    }
    
    function getCandidateByAddress(address accountAddress) public view returns (
        string fullName,
        string city,
        string minerCreation,
        string licenseExpiration,
        uint licenseId,
        uint votes,
        bool isValidator
    ) {
        assert(accountAddress != 0);
        assert(candidates[accountAddress].isValue != false);
        
        return (
            candidates[accountAddress].fullName,
            candidates[accountAddress].city,
            candidates[accountAddress].minerCreation,
            candidates[accountAddress].licenseExpiration,
            candidates[accountAddress].licenseId,
            candidates[accountAddress].votes,
            candidates[accountAddress].isValidator);
    }
    
    function vote(address validator, address candidate) 
        public
        isVoted(validator, candidate)
        isValidator(validator, candidate)
    {
        assert(candidates[candidate].isValidator != true);
        
        candidates[candidate].voters[candidate] = true;
        candidates[candidate].votes++;
        
        if (candidates[candidate].votes >= votesToBecameValidator) {
            candidates[candidate].isValidator = true;
            validators.push(candidate);
            
            if (votesToBecameValidator <= 10) {
                votesToBecameValidator = validators.length;
            }
        }
    }
}
