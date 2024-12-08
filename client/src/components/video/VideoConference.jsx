import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const VideoConference = () => {
    const { appointmentId } = useParams();
    const domain = process.env.REACT_APP_JITSI_DOMAIN || 'meet.jit.si';

    useEffect(() => {
        const initJitsi = async () => {
            try {
                // Check if appointment exists and is valid
                const { data: appointment } = await axios.get(`/api/appointments/${appointmentId}`);
                
                if (!appointment || appointment.status !== 'scheduled') {
                    throw new Error('Invalid or cancelled appointment');
                }

                // Check if Jitsi API is loaded
                if (!window.JitsiMeetExternalAPI) {
                    throw new Error('Jitsi Meet API not loaded');
                }

                const options = {
                    roomName: `telemedicine-${appointmentId}`,
                    width: '100%',
                    height: '100%',
                    parentNode: document.querySelector('#jitsi-container'),
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop',
                            'fullscreen', 'fodeviceselection', 'hangup', 'chat',
                            'recording', 'livestreaming', 'etherpad', 'settings',
                            'raisehand', 'videoquality', 'filmstrip', 'feedback',
                            'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
                            'download', 'help', 'mute-everyone'
                        ],
                    },
                    configOverwrite: {
                        startWithAudioMuted: true,
                        disableModeratorIndicator: true,
                        startScreenSharing: false,
                        enableWelcomePage: false
                    },
                    userInfo: {
                        displayName: localStorage.getItem('user')?.name || 'Participant'
                    }
                };

                const api = new window.JitsiMeetExternalAPI(domain, options);

                // Handle video conference events
                api.addEventListeners({
                    readyToClose: () => {
                        console.log('Video call ended');
                    },
                    participantLeft: () => {
                        console.log('Participant left');
                    },
                    videoConferenceJoined: () => {
                        console.log('Joined video conference');
                    },
                    error: (error) => {
                        console.error('Jitsi error:', error);
                        Swal.fire('Error', 'Video conference error occurred', 'error');
                    }
                });

                // Cleanup
                return () => {
                    if (api) {
                        api.dispose();
                    }
                };
            } catch (error) {
                console.error('Failed to initialize video conference:', error);
                Swal.fire('Error', error.message, 'error');
            }
        };

        initJitsi();
    }, [appointmentId, domain]);

    return (
        <div className="h-screen">
            <div id="jitsi-container" className="h-full w-full" />
        </div>
    );
};

export default VideoConference; 