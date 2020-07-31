pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
    function verifyTx(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public returns (bool r);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Mintable {
    Verifier private verifierContract;
	
// TODO define a solutions struct that can hold an index & an address
	struct Solution {
		uint index;
		address addr;
	}

// TODO define an array of the above struct
	Solution[] public solutionsArray;

// TODO define a mapping to store unique solutions submitted
	// solutions[hash].index/.addr
	mapping(bytes32 => Solution) solutions;

// TODO Create an event to emit when a solution is added
	event SolutionAdded(uint index, address to, uint tokenId, address creator);

	constructor(address verifierAddress, string memory name, string memory symbol) 
		CustomERC721Mintable(name, symbol) public 
	{
		verifierContract = Verifier(verifierAddress);
	}

// TODO Create a function to add the solutions to the array and emit the event
// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSupply
	function addSolution(
	    uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input,
		address to,
		uint tokenId
        ) public {

		// Hash args
        bytes32 solHash = keccak256(abi.encodePacked(a, b, c, input));

        // Check if solution is unique
        require(solutions[solHash].addr == address(0), "This solution has already been submitted");

        // Verify solution
        require(verifierContract.verifyTx(a, b, c, input), "Solution could not be verified");

        // Add solution to array
        uint _index = solutionsArray.length + 1;
		solutions[solHash] = Solution({
			index: _index, 
			addr: msg.sender
		});
		solutionsArray.push(solutions[solHash]);
		
		emit SolutionAdded(_index, to, tokenId, msg.sender);

		// Mint NFT
		super.mint(to, tokenId);
	}
}