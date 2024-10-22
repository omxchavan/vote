#include <iostream>
#include <vector>
#include <ctime>
#include <sstream>
#include <string>
#include <unordered_set> // For keeping track of voters
#include <functional>    // For std::hash
#include <unordered_map> // For counting votes

using namespace std;

// Function to calculate a simple hash using std::hash
string calculateHash(string data) {
    hash<string> hasher;
    size_t hashValue = hasher(data);                            //universal key
    stringstream ss;
    ss << hex << hashValue;
    return ss.str();
}

// Block Class
class Block {
public:
    int index;                           // Block number in the chain
    string previousHash;                 // Hash of the previous block
    string timestamp;                    // Time when the block was created
    string voteData;                     // The vote (e.g., voter ID and candidate)
    string hash;                         // Hash of the current block

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
    vector<Block> chain;                               // The chain of blocks
    unordered_set<string> votersList;                    // Set to keep track of voters who have already voted
    unordered_map<string, int> voteCount;                  // Map to count votes for each candidate

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
    bool addBlock(string voterID, string candidate) {                 //magic begins here
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

        // Count the vote for the candidate
        voteCount[candidate]++;

        cout << "Voter " << voterID << " successfully voted for " << candidate << ".\n";
        return true;
    }

    // Determine the candidate with the most votes
    void showVotingResults() {
        string winner;
        int maxVotes = 0;

        cout << "\nVoting Results:\n";

        // Iterate through the vote count map
        for (const auto& pair : voteCount) {
            cout << "Candidate " << pair.first << ": " << pair.second << " votes.\n";
            if (pair.second > maxVotes) {
                maxVotes = pair.second;
                winner = pair.first;
            }
        }

        cout << "\nThe winner is: Candidate " << winner << " with " << maxVotes << " votes!\n";
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

    // Show the voting results after all votes
    votingBlockchain.showVotingResults();

    return 0;
}
