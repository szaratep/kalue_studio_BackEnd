import { dbGetUserByEmail, dbGetUserByNickName } from "../service/user.service.js";

const verifyEmailOrNickname = async (inputData) => {
    if (inputData.user.includes('@')) {
        return await dbGetUserByEmail(inputData.user);
        
    } else {
        return await dbGetUserByNickName(inputData.user);
    }
}

export default verifyEmailOrNickname;
