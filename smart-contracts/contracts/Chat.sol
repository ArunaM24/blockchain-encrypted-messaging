// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    struct Message {
        address sender;
        string content;
    }

    mapping(bytes32 => Message[]) private chats;

    function getChatId(address a, address b) private pure returns (bytes32) {
        return a < b ? keccak256(abi.encode(a, b)) : keccak256(abi.encode(b, a));
    }

    function sendMessage(address to, string calldata message) external {
        bytes32 chatId = getChatId(msg.sender, to);
        chats[chatId].push(Message(msg.sender, message));
    }

    function getMessages(address a, address b)
        external
        view
        returns (Message[] memory)
    {
        return chats[getChatId(a, b)];
    }
}
