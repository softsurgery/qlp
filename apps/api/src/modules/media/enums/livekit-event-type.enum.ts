export enum LiveKitEventType {
  ROOM_STARTED = 'room_started',
  ROOM_FINISHED = 'room_finished',
  PARTICIPANT_JOINED = 'participant_joined',
  PARTICIPANT_LEFT = 'participant_left',
  PARTICIPANT_CONNECTION_ABORTED = 'participant_connection_aborted',
  TRACK_PUBLISHED = 'track_published',
  TRACK_UNPUBLISHED = 'track_unpublished',
  EGRESS_STARTED = 'egress_started',
  EGRESS_UPDATED = 'egress_updated',
  EGRESS_ENDED = 'egress_ended',
  INGRESS_STARTED = 'ingress_started',
  INGRESS_ENDED = 'ingress_ended',
}
