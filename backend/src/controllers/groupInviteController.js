const GroupInvite =
  require(
    "../models/GroupInvite"
  );

const Group =
  require(
    "../models/Group"
  );

const sendInvite =
  async (req, res) => {
    try {
      const {
        groupId,
        receiver,
      } = req.body;

      // Cannot invite yourself
      if (
        receiver ===
        req.user._id.toString()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Cannot invite yourself",
          });
      }

      const group =
        await Group.findById(
          groupId
        );

      if (!group) {
        return res
          .status(404)
          .json({
            message:
              "Group not found",
          });
      }

      // Already a member
      const isMember =
        group.members.some(
          (member) =>
            member.toString() ===
            receiver
        );

      if (isMember) {
        return res
          .status(400)
          .json({
            message:
              "User already in group",
          });
      }

      // Existing pending invite
      const existing =
        await GroupInvite.findOne({
          groupId,
          receiver,
          status:
            "pending",
        });

      if (existing) {
        return res
          .status(400)
          .json({
            message:
              "Invite already sent",
          });
      }

      const invite =
        await GroupInvite.create({
          groupId,
          sender:
            req.user._id,
          receiver,
        });

      res.status(201).json(
        invite
      );
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const getInvites =
  async (req, res) => {
    try {
      const invites =
        await GroupInvite.find({
          receiver:
            req.user._id,
          status:
            "pending",
        })
          .populate(
            "sender",
            "name"
          )
          .populate(
            "groupId",
            "name"
          );

      res.json(invites);
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const acceptInvite =
  async (req, res) => {
    try {
      const invite =
        await GroupInvite.findById(
          req.params.id
        );

      if (!invite) {
        return res
          .status(404)
          .json({
            message:
              "Invite not found",
          });
      }

      invite.status =
        "accepted";

      await invite.save();

      const group =
        await Group.findById(
          invite.groupId
        );

      const alreadyMember =
        group.members.some(
          (member) =>
            member.toString() ===
            invite.receiver.toString()
        );

      if (
        !alreadyMember
      ) {
        group.members.push(
          invite.receiver
        );

        await group.save();
      }

      res.json({
        message:
          "Joined group",
        group,
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const rejectInvite =
  async (req, res) => {
    try {
      const invite =
        await GroupInvite.findById(
          req.params.id
        );

      if (!invite) {
        return res
          .status(404)
          .json({
            message:
              "Invite not found",
          });
      }

      invite.status =
        "rejected";

      await invite.save();

      res.json({
        message:
          "Invite rejected",
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

module.exports = {
  sendInvite,
  getInvites,
  acceptInvite,
  rejectInvite,
};