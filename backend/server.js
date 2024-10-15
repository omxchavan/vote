const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

// Block class
class Block {
    constructor(index, previousHash, timestamp, voteData, hash) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.voteData = voteData;
        this.hash = hash;
    }
}

// Blockchain class
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.votersSet = new Set(); // Track who has already voted
        this.candidateVotes = {}; // Track votes for each candidate
    }

    createGenesisBlock() {
        return new Block(0, "0", Date.now(), "Genesis Block", this.calculateHash(0, "0", Date.now(), "Genesis Block"));
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    calculateHash(index, previousHash, timestamp, voteData) {
        return crypto
            .createHash('sha256')
            .update(index + previousHash + timestamp + voteData)
            .digest('hex');
    }

    addBlock(voterID, candidate) {
        // Check if voter already voted
        if (this.votersSet.has(voterID)) {
            return { success: false, message: "Voter has already voted!" };
        }

        const newBlockData = `VoterID: ${voterID}, Candidate: ${candidate}`;
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(
            this.chain.length,
            previousBlock.hash,
            Date.now(),
            newBlockData,
            this.calculateHash(this.chain.length, previousBlock.hash, Date.now(), newBlockData)
        );

        // Add voter to the set of people who have voted
        this.votersSet.add(voterID);
        this.chain.push(newBlock);

        // Increment vote count for the candidate
        if (this.candidateVotes[candidate]) {
            this.candidateVotes[candidate]++;
        } else {
            this.candidateVotes[candidate] = 1;
        }

        return { success: true, message: "Vote added successfully!" };
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Recalculate hash and check integrity
            if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.timestamp, currentBlock.voteData)) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    printBlockchain() {
        return this.chain.map(block => ({
            index: block.index,
            previousHash: block.previousHash,
            timestamp: block.timestamp,
            voteData: block.voteData,
            hash: block.hash
        }));
    }

    getVoteResults() {
        return this.candidateVotes;
    }
}

// Express server setup
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const votingBlockchain = new Blockchain();

// Endpoint to vote
app.post('/vote', (req, res) => {
    const { voterID, candidate } = req.body;
    if (!voterID || !candidate) {
        return res.status(400).json({ success: false, message: "Invalid voterID or candidate!" });
    }
    
    const result = votingBlockchain.addBlock(voterID, candidate);
    res.json(result);
});

// Endpoint to check the blockchain
app.get('/blockchain', (req, res) => {
    res.json(votingBlockchain.printBlockchain());
});

// Endpoint to validate the blockchain
app.get('/validate', (req, res) => {
    const isValid = votingBlockchain.isChainValid();
    res.json({ isValid });
});

// Endpoint to get vote results
app.get('/results', (req, res) => {
    const results = votingBlockchain.getVoteResults();
    res.json(results);
});

// Start the server
app.listen(port, () => {
    console.log(`Voting backend running at http://localhost:${port}`);
});
