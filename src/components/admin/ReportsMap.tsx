import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  reports: any[];
};

/**
 * Automatically zooms and pans to include all report markers.
 */
function FitBounds({ reports }: { reports: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length === 0) return;

    const bounds = L.latLngBounds(
      reports.map((report) => [
        Number(report.latitude),
        Number(report.longitude),
      ])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });
  }, [reports, map]);

  return null;
}

export default function ReportsMap({ reports }: Props) {
  const navigate = useNavigate();

  // Keep only reports with valid coordinates
  const validReports = reports.filter(
    (report) =>
      Number.isFinite(Number(report.latitude)) &&
      Number.isFinite(Number(report.longitude))
  );
  console.log("Valid Reports:", validReports.length);
  console.table(validReports);
  return (
    <MapContainer
      center={[9.082, 8.6753]} // Nigeria
      zoom={6}
      scrollWheelZoom={true}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Automatically zoom to reports */}
      <FitBounds reports={validReports} />

      {validReports.map((report, index) => {
  console.log("Rendering marker", index, report.title);

  return (
    <MarkerClusterGroup>
  {validReports.map((report) => (
    <Marker
      key={report.id}
      position={[
        Number(report.latitude),
        Number(report.longitude),
      ]}
    >
      <Popup>
        <div className="space-y-2 min-w-[220px]">
          <h3 className="font-bold text-lg">
            {report.title}
          </h3>

          <p>📍 {report.location}</p>

          <p>
            🏛 {report.lga}, {report.state}
          </p>

          <p>
            🚦 Status: <strong>{report.status}</strong>
          </p>

          <p>
            ⚠ Priority: <strong>{report.priority}</strong>
          </p>

          <button
            onClick={() => navigate(`/admin/reports/${report.id}`)}
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2"
          >
            Open Report
          </button>
        </div>
      </Popup>
    </Marker>
  ))}
</MarkerClusterGroup>
);
})}
    </MapContainer>
  );
}