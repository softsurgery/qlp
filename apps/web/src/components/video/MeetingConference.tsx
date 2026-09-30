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
import { cn } from "@qlp/ui";

/*
 * A translated copy of LiveKit's <VideoConference /> prefab. LiveKit hardcodes its English
 * labels ("Microphone", "Leave", "Enter a message...", ...), so the prefab and the pieces
 * that carry text (ControlBar, Chat, ConnectionStateToast) are rebuilt here from LiveKit's
 * exported building blocks, keeping their class names so @livekit/components-styles applies.
 * Room audio is rendered by the page (<RoomAudioRenderer />), not here.
 */

/*
 * Responsive overrides. @livekit/components-styles loads after Tailwind, so properties it
 * already sets need the `!` modifier to win; properties it doesn't set don't.
 */
const conferenceClass = cn(
  // Landscape phones: slimmer bars, more room for video.
  "[@media(max-height:480px)]:[--lk-control-bar-height:56px]",
  "[@media(max-height:480px)]:[--lk-chat-header-height:48px]",
  // Touch screens can't hover: keep the tile's pin and connection-quality badges visible.
  "[@media(hover:none)]:[&_.lk-focus-toggle-button]:!opacity-100",
  "[@media(hover:none)]:[&_.lk-connection-quality]:!opacity-100",
);

const controlBarClass = cn(
  // Narrow phones: tighter spacing so every button fits on one row.
  "max-[480px]:!gap-1.5 max-[480px]:!p-2",
  "max-[480px]:[&_button]:!px-2.5 max-[480px]:[&_button]:!py-2",
  "[@media(max-height:480px)]:!py-1.5",
  // Finger-sized tap targets.
  "[@media(pointer:coarse)]:[&_button]:min-h-11 [@media(pointer:coarse)]:[&_button]:min-w-11",
);

// Right-to-left: border on the inner side of the chat.
const chatClass = "rtl:!border-l-0 rtl:border-r rtl:border-[var(--lk-border-color)]";

// When the call is too narrow for a chat column, the chat slides over the video instead,
// above the control bar, opening from the inline end (right, or left in Arabic).
const chatOverlayClass = cn(
  "!absolute !top-0 !bottom-[var(--lk-control-bar-height)] !right-0 !left-auto z-10",
  "!w-[min(100%,24rem)] !max-w-full shadow-2xl",
  "rtl:!left-0 rtl:!right-auto",
);

/*
 * Layout decisions use the width the call actually has, not the screen width: the call
 * sits next to the app sidebar, so a 1024px laptop with the sidebar open leaves it ~700px.
 */
// LiveKit's chat column is ~55ch (~480px); keep ~640px for video beside it.
const CHAT_COLUMN_MIN_WIDTH = 1120;
// Below this the chat overlay covers the whole call.
const CHAT_FULL_WIDTH_BELOW = 640;
// Labelled buttons (Microphone, Camera, Share screen, Chat, Leave) need about this much.
const BUTTON_LABELS_MIN_WIDTH = 720;

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

/** Live width of an element; follows sidebar toggles, window resizes and the chat column. */
function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setWidth(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

export function MeetingConference() {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });
  const lastAutoFocusedScreenShare = React.useRef<TrackReferenceOrPlaceholder | null>(null);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const callWidth = useElementWidth(rootRef);
  // The inner area shrinks when the chat is a column, so the buttons follow it too.
  const barWidth = useElementWidth(innerRef);
  const chatAsOverlay = callWidth < CHAT_COLUMN_MIN_WIDTH;
  const chatFullWidth = callWidth < CHAT_FULL_WIDTH_BELOW;
  const showButtonLabels = barWidth >= BUTTON_LABELS_MIN_WIDTH;

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
    <div ref={rootRef} className={cn("lk-video-conference", conferenceClass)}>
      <LayoutContextProvider value={layoutContext} onWidgetChange={setWidgetState}>
        <div ref={innerRef} className="lk-video-conference-inner">
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
          <MeetingControlBar showLabels={showButtonLabels} />
        </div>
        <MeetingChat
          className={cn(chatAsOverlay && chatOverlayClass, chatFullWidth && "!w-full")}
          style={{ display: widgetState.showChat ? "grid" : "none" }}
        />
      </LayoutContextProvider>
      <MeetingConnectionToast />
    </div>
  );
}

function MeetingControlBar({ showLabels }: { showLabels: boolean }) {
  const { t } = useTranslation("web");
  const showText = showLabels;

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
    <div className={cn("lk-control-bar", controlBarClass)}>
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
    <div {...props} className={cn("lk-chat", chatClass, props.className)}>
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
