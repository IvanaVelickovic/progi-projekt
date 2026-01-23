import { JaaSMeeting } from "@jitsi/react-sdk";

interface Props {
  appId: string;
  roomName: string;
  jwt: string;
  onMeetingEnd: () => void;
}

const JaasMeeting = ({
  appId,
  roomName,
  jwt,
  onMeetingEnd,
}: Props) => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <JaaSMeeting
        appId={appId}
        roomName={roomName}
        jwt={jwt}
        onReadyToClose={onMeetingEnd}
        getIFrameRef={(node) => {
          if (node) node.style.height = "100%";
        }}
        configOverwrite={{
          prejoinPageEnabled: false,
        }}
      />
    </div>
  );
};

export default JaasMeeting;
