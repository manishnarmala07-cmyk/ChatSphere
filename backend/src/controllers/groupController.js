const Group =
  require("../models/Group");

const createGroup =
  async (req, res) => {
    try {
      const { name } =
        req.body;

      const group =
        await Group.create({
          name,
          createdBy:
            req.user._id,
          members: [
            req.user._id,
          ],
        });

      res.status(201).json(
        group
      );
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const getGroups =
  async (req, res) => {
    try {
      const groups =
        await Group.find({
          members:
            req.user._id,
        });

      res.json(groups);
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const joinGroup =
  async (req, res) => {
    try {
      const {
        groupId,
      } = req.body;

      const group =
        await Group.findById(
          groupId
        );

      if (!group)
        return res
          .status(404)
          .json({
            message:
              "Group not found",
          });

      if (
        !group.members.includes(
          req.user._id
        )
      ) {
        group.members.push(
          req.user._id
        );

        await group.save();
      }

      res.json(group);
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
const searchGroups =
  async (req, res) => {
    try {
      const query =
        req.query.q || "";

      const groups =
        await Group.find({
          name: {
            $regex: query,
            $options: "i",
          },
        });

      res.json(groups);
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
const getGroupDetails =
  async (req, res) => {
    try {
      const group =
        await Group.findById(
          req.params.id
        )
          .populate(
            "members",
            "name email"
          )
          .populate(
            "createdBy",
            "name"
          );

      if (!group) {
        return res
          .status(404)
          .json({
            message:
              "Group not found",
          });
      }

      res.json(group);
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
const leaveGroup =
  async (req, res) => {
    try {
      const group =
        await Group.findById(
          req.params.id
        );

      group.members =
        group.members.filter(
          (
            member
          ) =>
            member.toString() !==
            req.user._id.toString()
        );

      await group.save();

      res.json({
        message:
          "Left group",
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
  const removeMember =
  async (req, res) => {
    try {
      const group =
        await Group.findById(
          req.params.id
        );

      if (
        group.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Only creator can remove members",
          });
      }

      group.members =
        group.members.filter(
          (
            member
          ) =>
            member.toString() !==
            req.body.memberId
        );

      await group.save();

      res.json({
        message:
          "Member removed",
        });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
};
module.exports = {
  createGroup,
  getGroups,
  joinGroup,
  searchGroups,
  getGroupDetails,
  leaveGroup,
  removeMember,
};