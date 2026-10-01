import api from "./api";
export const searchHospitals=async(query,coords)=>{const params={q:query};if(coords){params.latitude=coords.latitude;params.longitude=coords.longitude}const{data}=await api.get("/hospitals/search",{params});return data.data||[]};
export const getNearbyHospitals=async(coords,radius=5000)=>{const{data}=await api.get("/hospitals/nearby",{params:{latitude:coords.latitude,longitude:coords.longitude,radius}});return data.data||[]};
export const getHospitalDetails=async(placeId)=>{const{data}=await api.get(`/hospitals/${encodeURIComponent(placeId)}`);return data.data};
export const getDirections=async(origin,destination)=>{const{data}=await api.get("/hospitals/directions",{params:{originLatitude:origin.latitude,originLongitude:origin.longitude,destinationLatitude:destination.latitude,destinationLongitude:destination.longitude}});return data.data};
