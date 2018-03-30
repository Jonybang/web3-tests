/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/

pragma solidity ^0.4.18;

import "./EIP20Interface.sol";

library Library {
    struct payment {
        uint256 last_timestamp;
        uint256 total_amount;
    }
    struct participationRequest {
        bool sent;
        bool confirmed;
        uint256 confirmations_count;
        mapping (address => uint8) confirmations;
    }
}

contract City is EIP20Interface {
    using Library for Library.payment;
    using Library for Library.participationRequest;

    uint256 public totalSupply;
    uint256 public currentSupply;
    uint256 public confirmsToParticipation;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event ParticipationRequest(address indexed _requested);
    event ParticipationConfirm(address indexed _requested, address indexed _confirmed, bool indexed _fully);

    uint256 constant private MAX_UINT256 = 2 ** 256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;

    mapping (address => Library.payment) public payments;
    mapping (address => Library.participationRequest) public participationRequests;

    string public name;
    uint8 public decimals;
    string public symbol;

    uint256 public payment;
    uint256 public paymentPeriod;

    address public mayor;

    function City(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
    ) public {
        totalSupply = _initialAmount;
        name = _tokenName;
        decimals = _decimalUnits;
        symbol = _tokenSymbol;

        confirmsToParticipation = 1;

        mayor = msg.sender;
        balances[msg.sender] = 1;

        currentSupply = totalSupply - balances[msg.sender];
    }

    function configurePayment(
        uint256 _payment,
        uint256 _paymentPeriod
    ) public {
        require(msg.sender == mayor);

        payment = _payment;
        paymentPeriod = _paymentPeriod;
    }

    function increaseSupply(
        uint256 _additionalSupply
    ) public {
        require(msg.sender == mayor);

        currentSupply += _additionalSupply;
        totalSupply += _additionalSupply;
    }

    function configureConfirmsToParticipation(
        uint256 _confirmsToParticipation
    ) public {
        require(msg.sender == mayor);

        confirmsToParticipation = _confirmsToParticipation;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);

        require(_value == 1);
        require(balances[_to] < 1);
        //can transfer tokens if payment available(hack defence)
        require(now - paymentPeriod >= payments[msg.sender].last_timestamp);

        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function() public payable { }

    function getPayment() public returns (uint256 next_date) {
        assert(payment != 0);
        assert(paymentPeriod != 0);

        require(balances[msg.sender] > 0);
        require(now - paymentPeriod >= payments[msg.sender].last_timestamp);

        if(payments[msg.sender].last_timestamp > 0){
            payments[msg.sender].last_timestamp += paymentPeriod;
            payments[msg.sender].total_amount += payment;
        } else {
            payments[msg.sender] = Library.payment({ last_timestamp: now, total_amount: payment });
        }

        msg.sender.transfer(payment);

        return payments[msg.sender].last_timestamp + paymentPeriod;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);

        require(_value == 1);
        require(balances[_to] < 1);
        //can transfer tokens if payment available(hack defence)
        require(now - paymentPeriod >= payments[msg.sender].last_timestamp);

        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_value == 1);
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function requestParticipation() public returns (uint256 count) {
        require(currentSupply > 0);
        require(balances[msg.sender] == 0);

        if(!participationRequests[msg.sender].sent){
            participationRequests[msg.sender] = Library.participationRequest({ sent: true, confirmed: false, confirmations_count: 0 });
            emit ParticipationRequest(msg.sender);
        }
        return participationRequests[msg.sender].confirmations_count;
    }

    function confirmParticipation(address _requested) public returns (uint256 count) {
        require(currentSupply > 0);
        require(balances[_requested] == 0);
        require(balances[msg.sender] == 1);
        require(participationRequests[_requested].sent);
        require(!participationRequests[_requested].confirmed);

        if(participationRequests[_requested].confirmations_count >= confirmsToParticipation){
            participationRequests[_requested].confirmed = true;
            balances[_requested] = 1;
            currentSupply -= 1;
            emit ParticipationConfirm(_requested, msg.sender, true);
            return participationRequests[_requested].confirmations_count;
        }

        require(participationRequests[_requested].confirmations[msg.sender] == 0);

        participationRequests[_requested].confirmations[msg.sender] = 1;
        participationRequests[_requested].confirmations_count += 1;

        if(participationRequests[_requested].confirmations_count >= confirmsToParticipation){
            participationRequests[_requested].confirmed = true;
            balances[_requested] = 1;
            currentSupply -= 1;
            emit ParticipationConfirm(_requested, msg.sender, true);
        } else {
            emit ParticipationConfirm(_requested, msg.sender, false);
        }

        return participationRequests[_requested].confirmations_count;
    }

    function depriveParticipation(address _participant) public returns (bool success) {
        require(msg.sender == mayor);
        require(balances[_participant] == 1);

        balances[_participant] -= 1;
        currentSupply += 1;
        return true;
    }

    function refuseParticipation() public returns (bool success) {
        require(balances[msg.sender] == 1);

        balances[msg.sender] -= 1;
        currentSupply += 1;
        return true;
    }
}
