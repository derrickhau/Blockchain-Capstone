var SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol');
var Verifier = artifacts.require('Verifier');
const Proof = require("../../zokrates/code/square/proof.json");

contract("TestSolnSquareVerifier", accounts => {
    const owner = accounts[0];
    const account_one = accounts[1];

	beforeEach(async() => {
    	const tokenName = "MyToken";
	    const tokenSymbol = "MT";
		
		let verifier = await Verifier.new({ from: owner });
		this.contract = await SolnSquareVerifier.new(verifier.address, tokenName, tokenSymbol, { from: owner });
	});

	// Test if a new solution can be added for contract - SolnSquareVerifier
	// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
	it("Should successfully add new solution and mint new token", async() => {
		let solutionAdded;
		const tokenId = 1;

		try {
			await this.contract.addSolution(...Object.values(Proof.proof), Proof.inputs, account_one, tokenId, { from: owner });
			solutionAdded = true;
		} catch(err) {
			solutionAdded = false;
		}
		
		assert.equal(solutionAdded, true, "Solution not added and new token not minted");
	});

	it("Duplicate solution will not be added", async() => {
		let result = false;
		const tokenId = 1;

		try {
			await this.contract.addSolution(...Object.values(Proof.proof), Proof.inputs, account_one, tokenId, { from: owner });
			await this.contract.addSolution(...Object.values(Proof.proof), Proof.inputs, account_one, tokenId, { from: owner });
			result = true;
		} catch(err) {
			result = false;
            assert.equal(err.reason, "This solution has already been submitted", "Failed for reason other than duplicate");			
		}
		
		assert.equal(result, false, "Duplicate solution not prevented from being added");
	});
});