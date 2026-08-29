import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { bookingApi } from '../lib/api';
import { Video, PhoneOff } from 'lucide-react';

export default function VideoCallPage() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getMine().then((r) => r.data.find((b: any) => b.id === bookingId)),
    enabled: !!bookingId,
  });

  const roomUrl = booking?.videoRoomUrl;

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="p-4 flex items-center justify-between text-white">
        <h1 className="font-semibold">Live Session</h1>
        <Link to="/bookings" className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg text-sm">
          <PhoneOff className="w-4 h-4" />
          Leave
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {roomUrl ? (
          <iframe
            src={roomUrl}
            allow="camera; microphone; fullscreen; display-capture"
            className="w-full h-full border-0"
          />
        ) : (
          <div className="text-center text-white">
            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Video room not available</p>
            <p className="text-sm opacity-70 mt-2">
              Set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET in the API .env and use the LiveKit client SDK in this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
