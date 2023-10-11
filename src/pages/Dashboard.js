import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from 'leaflet';

import * as mqtt from 'react-paho-mqtt'
import { Button } from '@radix-ui/themes';
import { point } from "./leafletIcons";


import DataCard from '../components/elements/card/DataCard'

const center = [-6.213082, 106.618501]; // Latitude and longitude
const zoom = 13;
export default function Dashboard() {

    const [temperature, setTemperature] = useState(25);
    const [humidity, setHumidity] = useState(80);
    const [expectedTemperature, setExpectedTemperature] = useState(20);
    const [iotLocation, setIotLocation] = useState(center);

    const [client, setClient] = useState(null);
    const _topic = ["cooler-box/+"];
    const _options = {};

    useEffect(() => {
        if (client === null) {
            _init();
        }
    }, []);

    useEffect(() => {
        if (client !== null) {
            _onSubscribe();
        }
    }, [client]);

    const generateRandomString = () => {

        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]};:,<.>/?";
        let result = "";
        for (let i = 0; i < 32; i++) {

            result += chars[Math.floor(Math.random() * chars.length)];

        }

        return result;

    }

    const _init = () => {
        const c = mqtt.connect(
            "broker.hivemq.com", // mqtt broker address
            Number(8000), // mqtt broker port
            generateRandomString(), // client id
            _onConnectionLost, // connection lost callback
            _onMessageArrived // message arrived callback
        ); // mqtt.connect(host, port, clientId, _onConnectionLost, _onMessageArrived)

        setClient(c);
    };

    // called when client lost connection
    const _onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:");
        }
    };

    // called when messages arrived
    const _onMessageArrived = async (message) => {
        const messageString = message.payloadString.toString();
        const messageObj = JSON.parse(messageString);
        setTemperature(messageObj.temperature);
        setHumidity(messageObj.humidity);
        setIotLocation([messageObj.latitude, messageObj.longitude]);
    };

    // called when subscribing topic(s)
    const _onSubscribe = () => {
        // console.log(client.clientId);
        client.connect({
            reconnect: true,
            onSuccess: () => {
                for (var i = 0; i < _topic.length; i++) {
                    client.subscribe(_topic[i], _options);
                }
            },
        }); // called when the client connects
    };


    const increaseTemperature = () => {

        setExpectedTemperature(expectedTemperature + 1);

    }

    const decreaseTemperature = () => {

        setExpectedTemperature(expectedTemperature - 1);

    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="flex w-screen max-w-screen-sm relative h-screen flex-col">

                    <div className="p-5">
                        <h1 className="text-center text-xl font-bold">Cooler Box Control Center</h1>
                    </div>

                    <div className="flex justify-center items-center">
                        <div className="w-full rounded-lg shadow-lg bg-slate-500 m-4 py-4">

                            <div className="m-4 space-y-4">
                                <div className="flex justify-center items-center space-x-4">
                                    <DataCard type="Temperature" value={temperature + "°C"} />
                                    <DataCard type="Humidity" value={humidity + "%"} />
                                </div>
                                <div className="flex justify-center items-center space-x-4">
                                    <DataCard type="Expected Temperature" value={expectedTemperature + "°C"} />
                                    <div className="flex flex-col justify-center space-y-4">
                                        <Button size="3" onClick={increaseTemperature}>+</Button>
                                        <Button size="3" onClick={decreaseTemperature}>-</Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* <MapContainer
                        scrollWheelZoom={true}
                        zoomControl={false}
                        minZoom={15}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.google.com/help/legalnotices_maps/">Google</a> Maps'
                            url="https://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}"
                            subdomains={["mt0", "mt1", "mt2", "mt3"]}
                        // className='map-tiles'
                        />
                    </MapContainer> */}
                    <div className="m-2">
                        <MapContainer center={center} zoom={zoom} style={{ height: '50vh', width: '100%', borderRadius: '25px' }}>
                            <TileLayer
                                url="https://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}"
                                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                            />
                            <Marker position={iotLocation} icon={point}>
                                <Popup>
                                    A popup with information about this location.
                                </Popup>
                            </Marker>

                        </MapContainer>
                    </div>

                </div>
            </div>
        </>
    )
}