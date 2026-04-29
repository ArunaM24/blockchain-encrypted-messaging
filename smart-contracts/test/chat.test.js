const { expect } = require("chai");

describe("Chat", function () {
  it("Should send and receive messages", async function () {
    const Chat = await ethers.getContractFactory("Chat");
    const chat = await Chat.deploy();

    const [a, b] = await ethers.getSigners();
    await chat.sendMessage(b.address, "Hello");

    const msgs = await chat.getMessages(a.address, b.address);
    expect(msgs.length).to.equal(1);
  });
});
