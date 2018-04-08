pragma solidity ^0.4.18;

contract SongRequest {
    
    bytes32[] songQueue;
    uint256 songCounter = 0;

    event AddedSong(address from, bytes32 songId);

    function getQueue() constant public returns (bytes32[]){
        return songQueue;
    }
    
    function addSong(address from, bytes32 songID) public{
        songQueue.push(songID);
        emit AddedSong(from, songID);
    }
    
    function playSong() public returns (bytes32 upNext){
        upNext = songQueue[songCounter];
        songCounter++;
        return upNext;
    }
    
}