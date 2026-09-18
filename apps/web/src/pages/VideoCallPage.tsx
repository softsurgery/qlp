import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LiveKitRoom,
  PreJoin,
  RoomAudioRenderer,
  VideoConference,
  type LocalUserChoices,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { ParticipantRole, type MediaTokenResponseDto } from "@qlp/api-client";
import { Spinner } from "@qlp/components";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@qlp/ui";
import { Eye, Loader2 } from "lucide-react";
import {
  useMediaRoom,
  useMediaToken,
} from "@/hooks/useMedia";
import { useAuthUser } from "@/hooks/useAuth";

type Stage = "lobby" | "connecting" | "connected";

export default function VideoCallPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [stage, setStage] = useState<Stage>("lobby");
  const [choices, setChoices] = useState<LocalUserChoices | null>(null);
  const [grant, setGrant] = useState<MediaTokenResponseDto | null>(null);

  const { data: authUser } = useAuthUser();
  const displayName = useMemo(
    () =>
      [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ").trim() ||
      authUser?.username ||
      "",
    [authUser],
  );

  const room = useMediaRoom(roomId);
  const tokenMutation = useMediaToken();

  const leave = useCallback(() => navigate("/"), [navigate]);

  const handleJoin = useCallback(
    async (userChoices: LocalUserChoices) => {
      if (!roomId) return;
      setChoices(userChoices);
      setStage("connecting");
      try {
        const issued = await tokenMutation.mutateAsync({
          roomId,
          participantName: userChoices.username,
        });
        setGrant(issued);
      } catch {
        setStage("lobby");
        void room.refetch();
      }
    },
    [roomId, tokenMutation, room],
  );

  const isObserver = grant?.role === ParticipantRole.OBSERVER;
  const publishVideo = Boolean(choices?.videoEnabled) && !isObserver;
  const publishAudio = Boolean(choices?.audioEnabled) && !isObserver;

  if (!roomId) return null;

  if (room.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }


  if (stage !== "lobby" && grant) {
    return (
      <div className="h-[calc(100vh-8rem)] overflow-hidden rounded-lg border">
        <LiveKitRoom
          token={grant.token}
          serverUrl={grant.livekitUrl}
          connect
          video={publishVideo}
          audio={publishAudio}
          onDisconnected={leave}
          onError={() => setStage("lobby")}
          data-lk-theme="default"
          className="flex h-full flex-col"
        >
          {isObserver && (
            <div className="flex shrink-0 items-center gap-2 border-b bg-muted/50 px-4 py-2 text-sm">
              <Eye className="h-4 w-4" />
              <span>{t("video.observerNotice")}</span>
            </div>
          )}
          <div className="min-h-0 flex-1">
            <VideoConference />
          </div>
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>{t("video.lobbyTitle")}</CardTitle>
          <Badge variant="secondary">{t(`video.status.${room.data?.status ?? "idle"}`)}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("video.lobbyHint")}</p>

          <div
            className="overflow-hidden rounded-md border bg-[#111] [&_.lk-prejoin]:w-full"
            data-lk-theme="default"
          >
            <PreJoin
              onSubmit={handleJoin}
              defaults={{
                username: displayName,
                videoEnabled: true,
                audioEnabled: true,
              }}
              joinLabel={t("video.join")}
              micLabel={t("video.microphone")}
              camLabel={t("video.camera")}
              userLabel={t("video.displayName")}
              persistUserChoices
            />
          </div>

          {stage === "connecting" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("video.connecting")}
            </div>
          )}

          <Button variant="ghost" onClick={leave}>
            {t("video.back")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
