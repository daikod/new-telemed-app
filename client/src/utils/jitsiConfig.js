export const getJitsiConfig = (roomName, userInfo) => {
    return {
        roomName: `${process.env.REACT_APP_JITSI_ROOM_PREFIX || 'telemedicine-'}${roomName}`,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-container'),
        configOverwrite: {
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            startWithAudioMuted: true,
            startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop',
                'fullscreen', 'fodeviceselection', 'hangup', 'chat',
                'settings', 'raisehand', 'videoquality', 'filmstrip',
                'tileview', 'download', 'help'
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
        },
        userInfo: {
            displayName: userInfo.name,
            email: userInfo.email,
        }
    };
}; 