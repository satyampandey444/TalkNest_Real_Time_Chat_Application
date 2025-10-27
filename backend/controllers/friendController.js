import { User } from "../models/userModel.js";

// 🔍 Search users by name or username
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const currentUser = await User.findById(req.userId);

    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: req.userId }, // ✅ exclude self
    }).select("fullName userName profilePhoto");

    // Attached relationship status for each user
    const updatedUsers = users.map((user) => {
      let status = "none";
      if (currentUser.friends.includes(user._id)) status = "friends";
      else if (currentUser.sentRequests.includes(user._id)) status = "sent";
      else if (currentUser.friendRequests.includes(user._id)) status = "pending";
      return { ...user.toObject(), status };
    });

    res.json({ users: updatedUsers });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    if (senderId.toString() === receiverId)
      return res.status(400).json({ message: "You cannot send a request to yourself" });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    // Pehle se friends?
    if (sender.friends.includes(receiverId))
      return res.status(400).json({ message: "Already friends" });

    // Already sent request ?
    if (sender.sentRequests.includes(receiverId))
      return res.status(400).json({ message: "Request already sent" });

    // If receiver already sent you one → auto accept
    if (sender.friendRequests.includes(receiverId)) {
      sender.friends.push(receiverId);
      receiver.friends.push(senderId);

      sender.friendRequests = sender.friendRequests.filter(
        (id) => id.toString() !== receiverId
      );
      receiver.sentRequests = receiver.sentRequests.filter(
        (id) => id.toString() !== senderId
      );
    } else {
      sender.sentRequests.push(receiverId);
      receiver.friendRequests.push(senderId);
    }

    await sender.save();
    await receiver.save();

    res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Send request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept friend request aceept kro
export const acceptFriendRequest = async (req, res) => {
  try {
    const receiverId = req.userId;
    const senderId = req.params.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!sender || !receiver)
      return res.status(404).json({ message: "User not found" });

    // Check if request exists
    if (!receiver.friendRequests.includes(senderId))
      return res.status(400).json({ message: "No request from this user" });

    // Add each other as friends
    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    // Remove pending requests
    receiver.friendRequests = receiver.friendRequests.filter(
      (id) => id.toString() !== senderId
    );
    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== receiverId
    );

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Accept request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//list of user's friends
export const getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "friends",
      "fullName userName profilePhoto"
    );

    res.json({ friends: user.friends });
  } catch (error) {
    console.error("Friend list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get friend requests (both received and sent)
export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("friendRequests", "fullName userName profilePhoto")
      .populate("sentRequests", "fullName userName profilePhoto");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      received: user.friendRequests || [],
      sent: user.sentRequests || [],
    });
  } catch (error) {
    console.error("Get friend requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
