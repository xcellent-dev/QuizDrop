const QdropToken = artifacts.require("QdropToken");
const Vesting = artifacts.require("Vesting");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(
        Vesting,
        accounts[0],
        accounts[1],
        accounts[2],
        accounts[3],
        accounts[4],
        accounts[5],
        accounts[6]
    );

    const vestingInstance = await Vesting.deployed();
    await deployer.deploy(QdropToken, vestingInstance.address);
};
