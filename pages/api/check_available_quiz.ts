import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from 'middleware/mongodb';
import Quiz from 'models/quiz';
import Answer from 'models/answer';
import dayjs from 'dayjs';

type ErrorType = {
    message: string
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Object | ErrorType>
) => {
    try {
        const request = req.body;
        const quiz = await Quiz.findOne({ date: dayjs().format('YYYY-MM-DD') });
        if (! quiz ) throw new Error("Quiz not found.");
        // check if done answering
        const answer = await Answer.findOne({ account: request.account, quiz: quiz._id });

        if (answer) {
            if (answer.answers.length == 10) {
                throw new Error("You are done answering the quiz.");
            }
        }

        res.json({ id: quiz._id });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export default connectDB(handler);