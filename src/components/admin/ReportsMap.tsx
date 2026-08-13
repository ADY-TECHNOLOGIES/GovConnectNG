import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

/* =========================================================
   LEAFLET DEFAULT ICON
========================================================= */

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* =========================================================
   TYPES
========================================================= */

type Report = {
  id: string | number;

  title?: string | null;

  location?: string | null;

  lga?: string | null;

  state?: string | null;

  status?: string | null;

  priority?: string | null;

  latitude?: number | string | null;

  longitude?: number | string | null;
};

type Props = {
  reports: Report[];
};

/* =========================================================
   COORDINATE VALIDATION
========================================================= */

function getValidCoordinates(report: Report) {
  /*
   * IMPORTANT:
   * Do not use Number(null) without checking null first.
   *
   * Number(null) === 0
   */

  if (
    report.latitude === null ||
    report.latitude === undefined ||
    report.latitude === "" ||
    report.longitude === null ||
    report.longitude === undefined ||
    report.longitude === ""
  ) {
    return null;
  }

  const latitude = Number(report.latitude);
  const longitude = Number(report.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  /*
   * Valid geographic ranges
   */

  if (latitude < -90 || latitude > 90) {
    return null;
  }

  if (longitude < -180 || longitude > 180) {
    return null;
  }

  /*
   * 0,0 is technically a geographic coordinate,
   * but it is almost certainly invalid for a Nigerian
   * citizen report.
   */

  if (latitude === 0 && longitude === 0) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

/* =========================================================
   FIT MAP TO REPORTS
========================================================= */

function FitBounds({
  reports,
}: {
  reports: Report[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!reports.length) {
      return;
    }

    const coordinates = reports
      .map((report) => {
        const coords = getValidCoordinates(report);

        if (!coords) {
          return null;
        }

        return [
          coords.latitude,
          coords.longitude,
        ] as [number, number];
      })
      .filter(
        (
          coordinate
        ): coordinate is [number, number] =>
          coordinate !== null
      );

    if (!coordinates.length) {
      return;
    }

    /*
     * Only one report
     */

    if (coordinates.length === 1) {
      map.setView(
        coordinates[0],
        15,
        {
          animate: true,
        }
      );

      return;
    }

    /*
     * Multiple reports
     */

    const bounds =
      L.latLngBounds(coordinates);

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [reports, map]);

  return null;
}

/* =========================================================
   REPORTS MAP
========================================================= */

export default function ReportsMap({
  reports,
}: Props) {
  const navigate = useNavigate();

  /* =======================================================
     VALID REPORTS
  ======================================================= */

  const validReports = useMemo(() => {
    return reports.filter((report) => {
      return getValidCoordinates(report) !== null;
    });
  }, [reports]);

  /* =======================================================
     REPORTS WITHOUT VALID COORDINATES
  ======================================================= */

  const reportsWithoutCoordinates =
    useMemo(() => {
      return reports.filter((report) => {
        return getValidCoordinates(report) === null;
      });
    }, [reports]);

  /* =======================================================
     DEBUG INFORMATION
  ======================================================= */

  useEffect(() => {
    console.log(
      "=========================================="
    );

    console.log(
      "REPORTS MAP"
    );

    console.log(
      "Total Reports:",
      reports.length
    );

    console.log(
      "Valid Reports:",
      validReports.length
    );

    console.log(
      "Reports Without Coordinates:",
      reportsWithoutCoordinates.length
    );

    if (reportsWithoutCoordinates.length > 0) {
      console.warn(
        "REPORTS WITHOUT VALID COORDINATES:",
        reportsWithoutCoordinates
      );
    }

    console.log(
      "=========================================="
    );
  }, [
    reports,
    validReports,
    reportsWithoutCoordinates,
  ]);

  /* =======================================================
     MAP
  ======================================================= */

  return (
    <MapContainer
      center={[9.082, 8.6753]}
      zoom={6}
      scrollWheelZoom={true}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* ===================================================
          MAP TILES
      =================================================== */}

      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ===================================================
          AUTOMATIC MAP BOUNDS
      =================================================== */}

      <FitBounds
        reports={validReports}
      />

      {/* ===================================================
          MARKER CLUSTER
      =================================================== */}

      <MarkerClusterGroup
        chunkedLoading={true}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={17}
        maxClusterRadius={50}
      >
        {validReports.map(
          (report, index) => {
            const coordinates =
              getValidCoordinates(report);

            /*
             * Extra safety check.
             */

            if (!coordinates) {
              return null;
            }

            console.log(
              "Rendering marker",
              index,
              report.title,
              coordinates.latitude,
              coordinates.longitude
            );

            return (
              <Marker
                key={`report-marker-${report.id}`}
                position={[
                  coordinates.latitude,
                  coordinates.longitude,
                ]}
              >
                <Popup>
                  <div className="space-y-2 min-w-[220px]">

                    {/* TITLE */}

                    <h3 className="font-bold text-lg">
                      {report.title ||
                        "Untitled Report"}
                    </h3>

                    {/* LOCATION */}

                    <p>
                      📍{" "}
                      {report.location ||
                        "Location unavailable"}
                    </p>

                    {/* GOVERNMENT LOCATION */}

                    <p>
                      🏛{" "}
                      {report.lga ||
                        "LGA unavailable"}
                      ,{" "}
                      {report.state ||
                        "State unavailable"}
                    </p>

                    {/* STATUS */}

                    <p>
                      🚦 Status:{" "}
                      <strong>
                        {report.status ||
                          "Unknown"}
                      </strong>
                    </p>

                    {/* PRIORITY */}

                    <p>
                      ⚠ Priority:{" "}
                      <strong>
                        {report.priority ||
                          "Normal"}
                      </strong>
                    </p>

                    {/* COORDINATES */}

                    <p className="text-xs text-muted-foreground">
                      📍{" "}
                      {coordinates.latitude.toFixed(
                        6
                      )}
                      ,{" "}
                      {coordinates.longitude.toFixed(
                        6
                      )}
                    </p>

                    {/* OPEN REPORT */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/reports/${report.id}`
                        )
                      }
                      className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 transition-colors"
                    >
                      Open Report
                    </button>

                  </div>
                </Popup>
              </Marker>
            );
          }
        )}
      </MarkerClusterGroup>
    </MapContainer>
  );
}