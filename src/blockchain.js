const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.createHash();
    }
    createHash() {
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        return new Block(0, '01/01/2023', { GenesisBlock: 'The first block of a blockhain is called genesis block' }, '0')
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }
    addBlockToTheChain(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.createHash(); //So,whenever we alter any data of the block we have to re-generate the hash
        //for that block.For example,here we called add block chain to add a block and to add we alter the block's previousHash
        //property so we are generating the new hash.
        this.chain.push(newBlock);
    }
    isChainValid() {//method to check the integrity of the block chain.
        for (let i = 1; i < this.chain.length; i++) { //i=1 because the first block at 0 index is a genesis block.
            let current_block = this.chain[i]
            let previous_block = this.chain[i - 1]
            if (current_block.hash !== current_block.createHash()) return false //hash of the block already generated
            //is not equal to the newly generated hash that means some tampering has been performed in the block
            //after generatig the hash
            if (current_block.previousHash !== previous_block.hash) return false
        }
        return true
    }
}

//CREATING THE BLOCKCHAIN AND ADDING BLOCS TO IT==============>
let bitcoin = new BlockChain()
bitcoin.addBlockToTheChain(new Block(1, '02/01/2023', { amount: 4, transactionType: 'Debit' }));
bitcoin.addBlockToTheChain(new Block(2, '03/01/2023', { amount: 10, transactionType: 'Credit' }));

//TAMPERING THE BLOCK CHAIN====================================>
bitcoin.chain[1].data.amount = 40
//So,here we tampered the first block by changing the amount of the transaction and our
//blockchain got invalid,beacuse the hash got altered as the block's data got altered.
//Even if we create a new hash after altering the block still it will result in false as the next block hash will be the old
//one and to change that we also have to change the previous has in next block and so on.So,basically the whole blockChain
//gets disturbed.
bitcoin.chain[1].hash = bitcoin.chain[1].createHash();

//CONSOLE TO VERIFY THE OUTPUT OF OUR BLOCKCHAIN.===============>
console.log(JSON.stringify(bitcoin, null, 4))
console.log(bitcoin.isChainValid())