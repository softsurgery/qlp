import * as React from "react";
import { useTranslation } from "react-i18next";
import { ConnectionState, RoomEvent, Track } from "livekit-client";
import {
  CarouselLayout,
  ChatCloseIcon,
  ChatEntry,
  ChatIcon,
  ChatToggle,
  DisconnectButton,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  LayoutContextProvider,
  LeaveIcon,
  MediaDeviceMenu,
  ParticipantTile,
  SpinnerIcon,
  StartMediaButton,
  Toast,
  TrackToggle,
  isTrackReference,
  useChat,
  useConnectionState,
  useCreateLayoutContext,
  useLocalParticipantPermissions,
  useMaybeLayoutContext,
  usePersistentUserChoices,
  usePinnedTracks,
  useTracks,
  type ChatMessage,
  type TrackReferenceOrPlaceholder,
  type WidgetState,
} from "@livekit/components-react";

/*
 * A translated copy of LiveKit's <VideoConference /> prefab. LiveKit hardcodes its English
 * labels ("Microphone", "Leave", "Enter a message...", ...), so the prefab and the pieces
 * that carry text (ControlBar, Chat, ConnectionStateToast) are rebuilt here from LiveKit's
 * exported building blocks, keeping their class names so @livekit/components-styles applies.
 * Room audio is rendered by the page (<RoomAudioRenderer />), not here.
 */

const sameTrack = (
  a?: TrackReferenceOrPlaceholder,
  b?: TrackReferenceOrPlaceholder,
) =>
  Boolean(a && b) &&
  a!.participant.identity === b!.participant.identity &&
  a!.source === b!.source &&
  (isTrackReference(a!) ? a.publication.trackSid : undefined) ===
    (isTrackReference(b!) ? b.publication.trackSid : undefined);

const supportsScreenSharing = () =>
  typeof navigator !== "undefined" &&
  Boolean(navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices);

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function MeetingConference() {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });
  const lastAutoFocusedScreenShare = React.useRef<TrackReferenceOrPlaceholder | null>(null);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const layoutContext = useCreateLayoutContext();
  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter((track) => track.publication.source === Track.Source.ScreenShare);
  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter((track) => !sameTrack(track, focusTrack));

  // Focus a new screen share automatically and drop the focus when it stops, like the prefab.
  React.useEffect(() => {
    if (
      screenShareTracks.some((track) => track.publication.isSubscribed) &&
      lastAutoFocusedScreenShare.current === null
    ) {
      layoutContext.pin.dispatch?.({ msg: "set_pin", trackReference: screenShareTracks[0] });
      lastAutoFocusedScreenShare.current = screenShareTracks[0];
    } else if (
      lastAutoFocusedScreenShare.current &&
      !screenShareTracks.some(
        (track) =>
          track.publication.trackSid ===
          lastAutoFocusedScreenShare.current?.publication?.trackSid,
      )
    ) {
      layoutContext.pin.dispatch?.({ msg: "clear_pin" });
      lastAutoFocusedScreenShare.current = null;
    }
    if (focusTrack && !isTrackReference(focusTrack)) {
      const updated = tracks.find(
        (track) =>
          track.participant.identity === focusTrack.participant.identity &&
          track.source === focusTrack.source,
      );
      if (updated !== focusTrack && isTrackReference(updated)) {
        layoutContext.pin.dispatch?.({ msg: "set_pin", trackReference: updated });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    screenShareTracks
      .map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`)
      .join(),
    focusTrack?.publication?.trackSid,
    tracks,
  ]);

  return (
    <div className="lk-video-conference">
      <LayoutContextProvider value={layoutContext} onWidgetChange={setWidgetState}>
        <div className="lk-video-conference-inner">
          {!focusTrack ? (
            <div className="lk-grid-layout-wrapper">
              <GridLayout tracks={tracks}>
                <ParticipantTile />
              </GridLayout>
            </div>
          ) : (
            <div className="lk-focus-layout-wrapper">
              <FocusLayoutContainer>
                <CarouselLayout tracks={carouselTracks}>
                  <ParticipantTile />
                </CarouselLayout>
                <FocusLayout trackRef={focusTrack} />
              </FocusLayoutContainer>
            </div>
          )}
          <MeetingControlBar />
        </div>
        <MeetingChat style={{ display: widgetState.showChat ? "grid" : "none" }} />
      </LayoutContextProvider>
      <MeetingConnectionToast />
    </div>
  );
}

function MeetingControlBar() {
  const { t } = useTranslation("web");
  const layoutContext = useMaybeLayoutContext();
  const isChatOpen = Boolean(layoutContext?.widget.state?.showChat);
  const isTooLittleSpace = useMediaQuery(`(max-width: ${isChatOpen ? 1000 : 760}px)`);
  const showText = !isTooLittleSpace;

  const permissions = useLocalParticipantPermissions();
  const canPublish = (source: Track.Source) => {
    if (!permissions?.canPublish) return false;
    const protocolSource =
      source === Track.Source.Camera ? 1 : source === Track.Source.Microphone ? 2 : 3;
    return (
      permissions.canPublishSources.length === 0 ||
      permissions.canPublishSources.includes(protocolSource)
    );
  };

  const [isSharing, setIsSharing] = React.useState(false);
  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices();

  return (
    <div className="lk-control-bar">
      {canPublish(Track.Source.Microphone) && (
        <div className="lk-button-group">
          <TrackToggle
            source={Track.Source.Microphone}
            showIcon
            onChange={(enabled, byUser) => byUser && saveAudioInputEnabled(enabled)}
          >
            {showText && t("video.microphone")}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, id) => saveAudioInputDeviceId(id ?? "default")}
            />
          </div>
        </div>
      )}
      {canPublish(Track.Source.Camera) && (
        <div className="lk-button-group">
          <TrackToggle
            source={Track.Source.Camera}
            showIcon
            onChange={(enabled, byUser) => byUser && saveVideoInputEnabled(enabled)}
          >
            {showText && t("video.camera")}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="videoinput"
              onActiveDeviceChange={(_kind, id) => saveVideoInputDeviceId(id ?? "default")}
            />
          </div>
        </div>
      )}
      {canPublish(Track.Source.ScreenShare) && supportsScreenSharing() && (
        <TrackToggle
          source={Track.Source.ScreenShare}
          captureOptions={{ audio: true, selfBrowserSurface: "include" }}
          showIcon
          onChange={setIsSharing}
        >
          {showText && t(isSharing ? "video.room.stopScreenShare" : "video.room.shareScreen")}
        </TrackToggle>
      )}
      {permissions?.canPublishData && (
        <ChatToggle>
          <ChatIcon />
          {showText && t("video.room.chat")}
        </ChatToggle>
      )}
      <DisconnectButton>
        <LeaveIcon />
        {showText && t("video.room.leave")}
      </DisconnectButton>
      <StartMediaButton label={t("video.room.allowPlayback")} />
    </div>
  );
}

function MeetingChat(props: React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation("web");
  const listRef = React.useRef<HTMLUListElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { chatMessages, send, isSending } = useChat();
  const layoutContext = useMaybeLayoutContext();
  const lastReadAt = React.useRef<ChatMessage["timestamp"]>(0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text || !inputRef.current) return;
    await send(text);
    inputRef.current.value = "";
    inputRef.current.focus();
  };

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chatMessages]);

  // Keep the unread badge on the chat button in sync, like the prefab.
  React.useEffect(() => {
    if (!layoutContext || chatMessages.length === 0) return;
    const last = chatMessages[chatMessages.length - 1]?.timestamp;
    if (layoutContext.widget.state?.showChat && lastReadAt.current !== last) {
      lastReadAt.current = last;
      return;
    }
    const unread = chatMessages.filter(
      (msg) => !lastReadAt.current || msg.timestamp > lastReadAt.current,
    ).length;
    if (unread > 0 && layoutContext.widget.state?.unreadMessages !== unread) {
      layoutContext.widget.dispatch?.({ msg: "unread_msg", count: unread });
    }
  }, [chatMessages, layoutContext?.widget]);

  return (
    <div {...props} className="lk-chat">
      <div className="lk-chat-header">
        {t("video.room.messages")}
        {layoutContext && (
          <ChatToggle className="lk-close-button" aria-label={t("video.room.closeChat")}>
            <ChatCloseIcon />
          </ChatToggle>
        )}
      </div>
      <ul className="lk-list lk-chat-messages" ref={listRef}>
        {chatMessages.map((msg, idx, all) => {
          const hideName = idx >= 1 && all[idx - 1].from === msg.from;
          const hideTimestamp = idx >= 1 && msg.timestamp - all[idx - 1].timestamp < 60_000;
          return (
            <ChatEntry
              key={msg.id ?? idx}
              entry={msg}
              hideName={hideName}
              hideTimestamp={hideName ? hideTimestamp : false}
            />
          );
        })}
      </ul>
      <form className="lk-chat-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="lk-form-control lk-chat-form-input"
          type="text"
          disabled={isSending}
          placeholder={t("video.room.messagePlaceholder")}
          onInput={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onKeyUp={(event) => event.stopPropagation()}
        />
        <button type="submit" className="lk-button lk-chat-form-button" disabled={isSending}>
          {t("video.room.send")}
        </button>
      </form>
    </div>
  );
}

function MeetingConnectionToast() {
  const { t } = useTranslation("web");
  const state = useConnectionState();

  if (state === ConnectionState.Reconnecting || state === ConnectionState.Connecting) {
    return (
      <Toast className="lk-toast-connection-state">
        <SpinnerIcon className="lk-spinner" />{" "}
        {t(
          state === ConnectionState.Reconnecting
            ? "video.room.reconnecting"
            : "video.room.connecting",
        )}
      </Toast>
    );
  }
  if (state === ConnectionState.Disconnected) {
    return (
      <Toast className="lk-toast-connection-state">{t("video.room.disconnected")}</Toast>
    );
  }
  return null;
}
