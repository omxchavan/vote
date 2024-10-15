#include <iostream>
#include <vector>
#include <ctime>
#include <sstream>
#include <string>
#include <unordered_set> // For keeping track of voters
#include <functional>    // For std::hash

using namespace std;

// Function to calculate a simple hash using std::hash
string calculateHash(string data) {
    hash<string> hasher;
    size_t hashValue = hasher(data);
    stringstream ss;
    ss << hex << hashValue;
    return ss.str();
}

// Block Class
class Block {
public:
    int index;            // Block number in the chain
    string previousHash;   // Hash of the previous block
    string timestamp;      // Time when the block was created
    string voteData;       // The vote (e.g., voter ID and candidate)
    string hash;           // Hash of the current block

    // Constructor
    Block(int idx, string prevHash, string vote) {
        index = idx;
        previousHash = prevHash;
        voteData = vote;
        timestamp = to_string(time(0)); // Current timestamp
        hash = calculateHash(previousHash + timestamp + voteData);
    }
};

// Blockchain Class
class Blockchain {
private:
    vector<Block> chain;              // The chain of blocks
    unordered_set<string> votersList; // Set to keep track of voters who have already voted

public:
    // Constructor to initialize the blockchain with a Genesis block
    Blockchain() {
        // Genesis block (index 0, no previous hash, dummy vote data)
        chain.push_back(Block(0, "0", "Genesis Block"));
    }

    // Get the latest block in the chain
    Block getLastBlock() {
        return chain.back();
    }

    // Add a new block to the chain
    bool addBlock(string voterID, string candidate) {
        // Check if the voter has already voted
        if (votersList.find(voterID) != votersList.end()) {
            cout << "Error: Voter " << voterID << " has already voted.\n";
            return false;
        }

        // Mark the voter as having voted
        votersList.insert(voterID);

        // Create the vote data and add the block
        string voteData = "VoterID: " + voterID + ", Candidate: " + candidate;
        Block newBlock(chain.size(), getLastBlock().hash, voteData);
        chain.push_back(newBlock);
        cout << "Voter " << voterID << " successfully voted for " << candidate << ".\n";
        return true;
    }

    // Validate the blockchain by checking the hashes
    bool isChainValid() {
        for (int i = 1; i < chain.size(); i++) {
            Block currentBlock = chain[i];
            Block previousBlock = chain[i - 1];

            // Check if current block's hash is correct
            if (currentBlock.hash != calculateHash(currentBlock.previousHash + currentBlock.timestamp + currentBlock.voteData)) {
                return false;
            }
            // Check if current block's previous hash matches the previous block's hash
            if (currentBlock.previousHash != previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    // Print the entire blockchain
    void printBlockchain() {
        for (const auto& block : chain) {
            cout << "Block " << block.index << ":\n";
            cout << "Previous Hash: " << block.previousHash << "\n";
            cout << "Timestamp: " << block.timestamp << "\n";
            cout << "Vote Data: " << block.voteData << "\n";
            cout << "Hash: " << block.hash << "\n";
            cout << "-----------------------------\n";
        }
    }
};

// Main function to simulate the voting process
int main() {
    Blockchain votingBlockchain;

    // Sample voter input
    int numberOfVoters;
    cout << "Enter the number of voters: ";
    cin >> numberOfVoters;

    for (int i = 0; i < numberOfVoters; ++i) {
        string voterID, candidate;
        cout << "Enter Voter ID: ";
        cin >> voterID;
        cout << "Enter Candidate (A/B/C): ";
        cin >> candidate;

        // Add the vote to the blockchain
        votingBlockchain.addBlock(voterID, candidate);
    }

    // Print the blockchain after all votes
    votingBlockchain.printBlockchain();

    // Validate the blockchain
    if (votingBlockchain.isChainValid()) {
        cout << "Blockchain is valid.\n";
    } else {
        cout << "Blockchain has been tampered with!\n";
    }

    return 0;
}
