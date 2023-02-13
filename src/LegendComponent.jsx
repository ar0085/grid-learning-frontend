import React from "react";

const LegendComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "5%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="legend-container">
        <div style={{ display: "flex", marginRight: "5%" }}>
          <div className="grid-cell-legend" cellStatus="Unmarked"></div>
          <span>Initial/Default</span>
        </div>
        <div style={{ display: "flex", marginRight: "5%" }}>
          <div className="grid-cell-legend" cellStatus="Path"></div>
          <span>Path</span>
        </div>
        <div style={{ display: "flex", marginRight: "5%" }}>
          <div className="grid-cell-legend" cellStatus="Focused"></div>
          <span>Focusing</span>
        </div>
        <div style={{ display: "flex", marginRight: "5%" }}>
          <div className="grid-cell-legend" cellStatus="Capturing"></div>
          <span>Capturing</span>
        </div>
        <div style={{ display: "flex" }}>
          <div className="grid-cell-legend" cellStatus="Captured"></div>
          <span>Captured</span>
        </div>
      </div>
      <div>
        <p>* The cell with the red border indicates the current cell</p>
      </div>
    </div>
  );
};

export default LegendComponent;
