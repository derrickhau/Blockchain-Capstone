var CustomERC721Mintable = artifacts.require('CustomERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    const name = "MyToken";
    const symbol = "MT";

    describe('match erc721 spec', () => {
        beforeEach(async() => { 
            this.contract = await CustomERC721Mintable.new(name, symbol, { from: owner });

            // TODO: mint multiple tokens
            for (let i = 1; i <= 10; i++) {
                await this.contract.mint(account_one, i, { from: owner });
            }
        });

        it('should return total supply', async() => { 
            var totalSupply = await this.contract.totalSupply();

            assert.equal(totalSupply.toNumber(), 10, "Total supply is incorrect");
        });

        it('should get token balance', async() => { 
            var tokenBalance = await this.contract.balanceOf(account_one);

            assert.equal(tokenBalance.toNumber(), 10, "Token balance is incorrect");            
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async() => { 
            var tokenURI = await this.contract.tokenURI(1);

            assert.equal(tokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1', "Token uri is incorrect")            
        });

        it('should transfer token from one owner to another', async() => { 
            // Verify current tokenOwner
            var tokenOwner = await this.contract.ownerOf(1);
            assert.equal(tokenOwner, account_one, "Token is not owned by account_two")

            // Transfer token
            await this.contract.transferFrom(account_one, account_two, 1, { from: account_one });

            // Verify new tokenOwner
            var newTokenOwner = await this.contract.ownerOf(1);
            assert.equal(newTokenOwner, account_two, "Token did not successfully transfer")
        });
    });

    describe('have ownership properties', () => {
        beforeEach(async() => { 
            this.contract = await CustomERC721Mintable.new(name, symbol, { from: owner });
        });

        it('should fail when minting when address is not contract owner', async() => { 
            try {
                await this.contract.mint(account_one, 1, { from: account_one });
            } catch(err) {
                assert.equal(err.reason, "Must be contract owner", "Minting from non-owner account should fail");
            }
        });

        it('should return contract owner', async() => { 
            let contractOwner = await this.contract.getOwner.call();

            assert.equal(contractOwner, owner);
        });
    });
})