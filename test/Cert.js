const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Cert", function () {
  let cert;

  it("Should deploy the contract", async function () {
    const owner = await ethers.getSigner();

    const Cert = await ethers.getContractFactory("Cert");
    cert = await Cert.deploy();

    expect(cert.deployTransaction.from).to.equal(owner.address);
  });

  it("Should issue the certificate", async function () {
    await expect(
      cert.issue(
        1024,
        "Lindsey",
        "TTE",
        "S",
        "2186-06-12",
        "0x2f44454d59535449462f6e6578742d63657274696669636174652d646170702f"
      )
    )
      .to.emit(cert, "Issued")
      .withArgs(1024, "TTE", "2186-06-12");
  });

  it("Should read the certificate", async function () {
    const certificate = await cert.Certificates(1024);

    expect(certificate[0]).to.equal("Lindsey");
    expect(certificate[1]).to.equal("TTE");
    expect(certificate[2]).to.equal("S");
    expect(certificate[3]).to.equal("2186-06-12");
    expect(certificate[4]).to.equal(
      "0x2f44454d59535449462f6e6578742d63657274696669636174652d646170702f"
    );
  });

  it("Should revert the issuing", async function () {
    const accounts = await ethers.getSigners();

    await expect(
      cert
        .connect(accounts[1])
        .issue(
          1024,
          "Abigail",
          "UNO",
          "S",
          "2186-06-12",
          "0x2f44454d59535449462f6e6578742d63657274696669636174652d646170702f"
        )
    ).to.be.revertedWith("Not Authorized");
  });
});
