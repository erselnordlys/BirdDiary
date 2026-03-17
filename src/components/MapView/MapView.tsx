import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import type { BirdEntry } from '../../types/BirdEntry';
import styles from './MapView.module.scss';

interface MapViewProps {
  entries: BirdEntry[];
}

function createIcon(photoUrl?: string): L.DivIcon {
  const inner = photoUrl
    ? `<img src="${photoUrl}" style="width:36px;height:36px;object-fit:cover;" />`
    : `<span style="font-size:20px;line-height:36px;">🐦</span>`;

  return L.divIcon({
    html: `<div style="width:40px;height:40px;border-radius:50%;border:2.5px solid #3d8c40;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.25);">${inner}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    tooltipAnchor: [0, -24],
  });
}

export function MapView({ entries }: MapViewProps) {
  return (
    <div className={styles.wrapper}>
      <MapContainer
        center={[54.5, -2.5]}
        zoom={6}
        className={styles.map}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup chunkedLoading>
          {entries.map((entry) => (
            <Marker
              key={entry.id}
              position={[entry.lat, entry.lon]}
              icon={createIcon(entry.photoUrl)}
            >
              <Tooltip direction="top" offset={[0, -24]}>
                <strong>{entry.species}</strong>
              </Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {entries.length === 0 && (
        <div className={styles.emptyOverlay}>
          <p>No sightings yet — log your first bird!</p>
        </div>
      )}
    </div>
  );
}
