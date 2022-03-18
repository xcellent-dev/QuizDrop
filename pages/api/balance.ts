import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from "web3";
import contract from "@truffle/contract";
import QdropToken from "build/contracts/QdropToken.json";

const provider = new Web3.providers.HttpProvider(process.env.rpcUrl);
const web3 = new Web3(provider);

type ErrorType = {
    message: string
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Object | ErrorType>
) => {
    try {
        const { account } = req.body;

        const QdropTokenContract = contract(QdropToken);
        QdropTokenContract.setProvider(provider);

        const instance = await QdropTokenContract.deployed();
        const result = await instance.balanceOf.call(account);
        const balance = web3.utils.fromWei(result.toString(), 'ether');

        res.json({ balance });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export default handler;