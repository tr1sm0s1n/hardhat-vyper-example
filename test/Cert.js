import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";
import chai from "chai";

const { expect } = chai;

describe("Cert", function () {
  async function deployCertFixture() {
    const [admin, other] = await ethers.getSigners();

    const Cert = await ethers.getContractFactory("Cert");
    const cert = await Cert.deploy();

    return { cert, admin, other };
  }

  it("Should set the right admin", async function () {
    const { cert, admin } = await loadFixture(deployCertFixture);

    expect(cert.deploymentTransaction().from).to.equal(admin.address);
  });

  it("Should issue the certificate", async function () {
    const { cert } = await loadFixture(deployCertFixture);

    await expect(
      cert.issue(
        900,
        "Langley",
        "MBCC",
        "S",
        "2186-06-12",
        "0x2f44454d59535449462f6e6578742d63657274696669636174652d646170702f"
      )
    )
      .to.emit(cert, "Issued")
      .withArgs(900, "MBCC", "2186-06-12");
  });

  it("Should read the certificate", async function () {
    const { cert } = await loadFixture(deployCertFixture);

    await cert.issue(
      900,
      "Langley",
      "MBCC",
      "S",
      "2186-06-12",
      "0x2f44454d59535449462f6e6578742d63657274696669636174652d646170702f"
    );

    const certificate = await cert.Certificates(900);

    expect(certificate[0]).to.equal("Langley");
    expect(certificate[1]).to.equal("MBCC");
    expect(certificate[2]).to.equal("S");
    expect(certificate[3]).to.equal("2186-06-12");
    expect(certificate[4]).to.equal(
      "0x2f44454d59535449462f6e6578742d63657274696669636174652d646170702f"
    );
  });

  it("Should revert the issuing", async function () {
    const { cert, other } = await loadFixture(deployCertFixture);

    await expect(
      cert
        .connect(other)
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
