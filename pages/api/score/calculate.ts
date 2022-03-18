import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from 'middleware/mongodb';
import Quiz from 'models/quiz';
import Answer from 'models/answer';
import Tokenreward from 'models/tokenreward';
import Reward from 'models/reward';
import dayjs from "dayjs";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Object | null>
) => {
    try {
        const { account, quiz } = req.body;
        let points = 0;
        let reward = 0;
        const tokenReward = await Tokenreward.findOne();
        const answerModel = await Answer.findOne({ account, quiz });
        const quizModel = await Quiz.findOne({ _id: quiz }).populate('questions');
        const rewardModel = await Reward.findOne({ account, quiz });

        if (!answerModel) throw new Error("No answers found.");

        if (rewardModel) {
            points = rewardModel.points;
            reward = rewardModel.token;
        } else {
            answerModel.answers.forEach(answer => {
                const question = quizModel.questions.find(q => q._id.toString() === answer.question.toString());
                // check if answer is correct
                // correct answer should be on the first index of array
                // the question's options will be shuffled on get request
                if (question && question.options[0] === answer.chosen) {
                    points++;
                }
            });

            reward = points * tokenReward.value;

            Reward.create({
                account,
                quiz,
                points,
                token: reward,
                datetime: dayjs().format('YYYYMMDDHHmmss')
            });
        }

        res.json({ points, reward });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export default connectDB(handler);