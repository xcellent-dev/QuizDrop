import React, { useState, useEffect } from "react";
import type { NextPage } from 'next';
import { Page } from "components/index";
import theme from "theme/index";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { injected } from "components/wallet/connectors";
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import PreviousList from "components/quiz/PreviousList";
import StudyMaterial from "components/quiz/StudyMaterial";

const textLimit = (text: string | undefined, count: number) => {
    if (text == undefined) return '';
    return text?.slice(0, count) + (text?.length > count ? "..." : "");
}

const Dashboard: NextPage = () => {
    const router = useRouter();
    const { active, account, library, connector, activate, deactivate } = useWeb3React();
    const [balance, setBalance] = useState(0);

    async function connect() {
        try {
            await activate(injected, null, true);
        } catch (ex) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: ex.message
            })
        }
    }

    async function disconnect() {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }

    const play = async () => {
        try {
            const response = await (fetch('/api/check_available_quiz', {
                method: 'POST',
                body: JSON.stringify({account}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }));
            const quiz = await response.json();
            if (! response.ok) throw new Error(quiz.message);

            Swal.fire({
                title: 'Game Time',
                text: "Press play to enter the game.",
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Play Now'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push(`/game/${quiz.id}`);
                }
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'You want to play the game?',
                text: 'I\'m sorry but you don\'t have any more quizzes to play. Check again tomorrow.'
            })
        }
    }

    const handleUpcomingQuiz = async () => {
        try {
            const response = await fetch('/api/upcoming_quiz');
            const duration = await response.json();
            if (!response.ok) throw new Error(duration.message);

            Swal.fire({
                icon: 'question',
                title: 'Upcoming Game?',
                text: `${duration.time} left for your next daily quiz.`
            })
        } catch (error) {

        }
    }

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {

        (async () => {

            const response = await fetch('/api/balance', {
                method: 'POST',
                body: JSON.stringify({ account }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const duration = await response.json();
            setBalance(duration.balance);
        })();
    }, [account]);

    return (
        <Page>
            <main className="flex w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
                    <div className="col-span-4">
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col w-full h-full mb-4 p-10" style={{ backgroundColor: theme.colors.blue }}>
                                <h1 className="flex flex-grow text-white text-2xl">Hi, Welcome!</h1>
                                <div>
                                    <div className="flex flex-row mt-6 px-4 py-4 border" style={{ borderColor: theme.colors.violet }}>
                                        <div className="flex flex-grow text-sm text-white">
                                            Account
                                        </div>
                                        <div className="text-right" style={{ color: theme.colors.lightblue }}>
                                            {textLimit(account?.toString(), 20)}
                                        </div>
                                    </div>
                                    <div className="flex flex-row mt-6 px-4 py-4 border" style={{ borderColor: theme.colors.violet }}>
                                        <div className="flex flex-grow text-sm text-white">
                                            Token Reward Balance
                                        </div>
                                        <div className="text-right" style={{ color: theme.colors.lightblue }}>
                                            Qdrop {balance}
                                        </div>
                                    </div>
                                    <div className="flex flex-row mt-6 px-4 py-4 border" style={{ borderColor: theme.colors.violet }}>
                                        <div className="flex flex-grow text-sm text-white">
                                            Locked Token
                                        </div>
                                        <div className="text-right" style={{ color: theme.colors.lightblue }}>
                                            Qdrop 5,000
                                        </div>
                                    </div>
                                    <div className="flex flex-row mt-6 px-4 py-4 border" style={{ borderColor: theme.colors.violet }}>
                                        <div className="flex flex-grow text-sm text-white">
                                            Game Exp
                                        </div>
                                        <div className="text-right" style={{ color: theme.colors.lightblue }}>
                                            10
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full h-full p-10" style={{ backgroundColor: theme.colors.blue }}>
                                <h1 className="flex flex-grow text-white text-2xl">Claim History</h1>
                                {/* <div>
                                    <div className="flex flex-row mt-6 px-4 py-4 border" style={{ borderColor: theme.colors.violet }}>
                                        <div className="flex flex-grow text-sm text-white">
                                            Token Reward Balance
                                        </div>
                                        <div style={{ color: theme.colors.lightblue }}>
                                            Qdrop 10,000
                                        </div>
                                    </div>
                                    <div className="flex flex-row mt-6 px-4 py-4 border" style={{ borderColor: theme.colors.violet }}>
                                        <div className="flex flex-grow text-sm text-white">
                                            Locked Token
                                        </div>
                                        <div style={{ color: theme.colors.lightblue }}>
                                            Qdrop 5,000
                                        </div>
                                    </div>
                                    <div className="flex flex-row mt-6 px-4 py-4 border" style={{ borderColor: theme.colors.violet }}>
                                        <div className="flex flex-grow text-sm text-white">
                                            Game Exp
                                        </div>
                                        <div style={{ color: theme.colors.lightblue }}>
                                            10
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4 order-first md:order-none" style={{ backgroundColor: theme.colors.blue }}>
                        <div className="flex flex-col w-full h-full p-10 items-center justify-center" style={{ backgroundColor: theme.colors.blue }}>
                            <div className="w-full flex items-center justify-center">
                                <Image src="/images/quizdrop.png" width={110} height={110} alt="Quizdrop logo" />
                            </div>
                            <div className="w-full">
                                <button className="rounded-full w-full py-4 text-white">Learn, play and earn.</button>
                            </div>
                            {account ?
                            <>
                            <div className="w-full mt-10">
                                <button className="rounded-full w-full py-4 border-4 text-qblue hover:bg-qblue hover:text-white" style={{ borderColor: theme.colors.lightblue }} onClick={play}>Play</button>
                            </div>
                            <div className="w-full mt-6">
                                <button className="rounded-full w-full py-4 border-4 text-qblue hover:bg-qblue hover:text-white" style={{ borderColor: theme.colors.lightblue }}>Lock Token</button>
                            </div>
                            <div className="w-full mt-6">
                                <button className="rounded-full w-full py-4 border-4 text-qblue hover:bg-qblue hover:text-white" style={{ borderColor: theme.colors.lightblue }}>Claim Token</button>
                            </div>
                            <div className="w-full mt-6">
                                <button onClick={handleUpcomingQuiz} className="rounded-full w-full py-4 border-4 text-qblue hover:bg-qblue hover:text-white" style={{ borderColor: theme.colors.lightblue }}>Upcoming quizzes</button>
                            </div>
                            </> :
                            <div className="w-full mt-10">
                                <button onClick={connect} className="rounded-full w-full py-4 border-4 text-qblue hover:bg-qblue hover:text-white" style={{ borderColor: theme.colors.lightblue }}>Connect</button>
                            </div>}

                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col w-full h-full mb-4 p-10" style={{ backgroundColor: theme.colors.blue }}>
                                <h1 className="flex text-white text-2xl">Study Sources</h1>
                                <StudyMaterial />
                            </div>
                            <div className="flex flex-col w-full h-full p-10" style={{ backgroundColor: theme.colors.blue }}>
                                <h1 className="flex text-white text-2xl">Your Previous Quizzes</h1>
                                <PreviousList account={account} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Page>
    )
}

export default Dashboard
