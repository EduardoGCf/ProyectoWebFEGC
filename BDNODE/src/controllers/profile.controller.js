// profile.controller.js
export const getUserProfile = (req, res) => {
    res.json(req.user);
};
