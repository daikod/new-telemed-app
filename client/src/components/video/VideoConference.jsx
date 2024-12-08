import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getJitsiConfig } from '../../utils/jitsiConfig';

const VideoConference = () => {
    const { appointmentId } = useParams();
    const [api, setApi] = useState(null);
    const domain = process.env.REACT_APP_JITSI_DOMAIN;

    useEffect(() => {
        const initJitsi = async () => {
            try {
                // Get appointment details
                const { data: appointment } = await axios.get(`/api/appointments/${appointmentId}`);
                
                if (!appointment || appointment.status !== 'scheduled') {
                    throw new Error('Invalid or cancelled appointment');
                }

                if (!window.JitsiMeetExternalAPI) {
                    throw new Error('Jitsi Meet API not loaded');
                }

                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const config = getJitsiConfig(appointmentId, {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email
                });

                const jitsiApi = new window.JitsiMeetExternalAPI(domain, config);

                jitsiApi.addEventListeners({
                    readyToClose: handleClose,
                    participantLeft: handleParticipantLeft,
                    videoConferenceJoined: handleVideoConferenceJoined,
                    videoConferenceLeft: handleVideoConferenceLeft
                });

                setApi(jitsiApi);
            } catch (error) {
                console.error('Failed to initialize video conference:', error);
                Swal.fire('Error', error.message, 'error');
            }
        };

        initJitsi();

        return () => {
            if (api) {
                api.dispose();
            }
        };
    }, [appointmentId, domain]);

    const handleClose = () => {
        console.log('Video call ended');
    };

    const handleParticipantLeft = async (participant) => {
        console.log('Participant left:', participant);
    };

    const handleVideoConferenceJoined = async (participant) => {
        console.log('Joined video conference:', participant);
    };

    const handleVideoConferenceLeft = () => {
        console.log('Left video conference');
    };

    return (
        <div className="h-screen bg-gray-100">
            <div id="jitsi-container" className="w-full h-full" />
        </div>
    );
};

export default VideoConference; 