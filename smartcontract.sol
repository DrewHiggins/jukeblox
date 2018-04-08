pragma solidity ^0.4.21;

contract SongRequest {
    
    bytes32[] songQueue;
    uint256 songCounter = 0;

    function getQueue() constant public returns (bytes32[]){
        return songQueue;
    }
    
    function addSong(bytes32 songID) public{
        songQueue.push(songID);
    }
    
    function playSong() public returns (bytes32 upNext){
        upNext = songQueue[songCounter];
        songCounter++;
        return upNext;
    }
    
}