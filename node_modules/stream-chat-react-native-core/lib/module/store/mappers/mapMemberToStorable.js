Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapMemberToStorable = void 0;
var _mapDateTimeToStorable = require("./mapDateTimeToStorable");
var mapMemberToStorable = exports.mapMemberToStorable = function mapMemberToStorable(_ref) {
  var cid = _ref.cid,
    member = _ref.member;
  var archived_at = member.archived_at,
    banned = member.banned,
    channel_role = member.channel_role,
    created_at = member.created_at,
    invite_accepted_at = member.invite_accepted_at,
    invite_rejected_at = member.invite_rejected_at,
    invited = member.invited,
    is_moderator = member.is_moderator,
    role = member.role,
    shadow_banned = member.shadow_banned,
    updated_at = member.updated_at,
    user_id = member.user_id,
    pinned_at = member.pinned_at;
  return {
    archivedAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(archived_at),
    banned: banned,
    channelRole: channel_role,
    cid: cid,
    createdAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(created_at),
    inviteAcceptedAt: invite_accepted_at,
    invited: invited,
    inviteRejectedAt: invite_rejected_at,
    isModerator: is_moderator,
    pinnedAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(pinned_at),
    role: role,
    shadowBanned: shadow_banned,
    updatedAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(updated_at),
    userId: user_id
  };
};
//# sourceMappingURL=mapMemberToStorable.js.map