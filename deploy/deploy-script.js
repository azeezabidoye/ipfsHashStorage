module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [];
  await deploy("IPFShashStorage", {
    contract: "IPFShashStorage",
    args: args,
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["IPFShashStorage"];
