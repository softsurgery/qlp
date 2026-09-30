import { VideoGrant } from 'livekit-server-sdk';
import { ParticipantRole } from '../enums/participant-role.enum';

export const MEDIA_ROLE_GRANTS: Readonly<Record<ParticipantRole, Readonly<VideoGrant>>> =
  Object.freeze({
    [ParticipantRole.HOST]: Object.freeze({
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: true,
      canUpdateOwnMetadata: true,
      roomCreate: false,
      roomList: false,
      roomRecord: false,
      ingressAdmin: false,
      hidden: false,
      recorder: false,
    }),
    [ParticipantRole.STUDENT]: Object.freeze({
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: false,
      canUpdateOwnMetadata: false,
      roomCreate: false,
      roomList: false,
      roomRecord: false,
      ingressAdmin: false,
      hidden: false,
      recorder: false,
    }),
    [ParticipantRole.OBSERVER]: Object.freeze({
      roomJoin: true,
      canPublish: false,
      canSubscribe: true,
      canPublishData: false,
      roomAdmin: false,
      canUpdateOwnMetadata: false,
      roomCreate: false,
      roomList: false,
      roomRecord: false,
      ingressAdmin: false,
      hidden: false,
      recorder: false,
    }),
  });
