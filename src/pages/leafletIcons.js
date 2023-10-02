import L from "leaflet";
import pointIcon from "../assets/marker.png";


//Leaflet Icons
export const point = L.icon({
    iconUrl: pointIcon,
    iconSize: [33, 33],
    iconAnchor: [15, 20],
    popupAnchor: [4, -24],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
});