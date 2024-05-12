import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, username } = req.body
    if ([fullName, email, password, username].some((field) => field?.trim === '')) {
        throw new ApiError(400, 'All field is required')
    }
    const exitstingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (exitstingUser) throw new ApiError(409, 'User already exist is required')
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) throw new ApiError(400, 'Avatar file is required')
    const avatar = await uploadFile(avatarLocalPath)
    const coverImage = coverImageLocalPath && await uploadFile(coverImageLocalPath)
    if (!avatar) throw new ApiError(400, 'Avatar file is required')
    const user = await User.create({
        fullName,
        email,
        username: username?.toLowerCase(),
        password,
        avatar: avatar?.url || 'test',
        coverImage: coverImage?.url || "",
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -watchHistroy"
    );

    if (!createdUser) {
        removeFile(req);
        throw new ApiError(500, "Something went wrong while registering user");
    }

    // send response to frontend
    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "userSuccessfully registered"));
})

export { registerUser }