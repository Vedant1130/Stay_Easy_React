import React, { useState } from "react";
import "./TaxToggle.css";

const TaxToggle = ({ isTaxEnabled, setIsTaxEnabled }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    let taxInfo = document.getElementsByClassName("tax-info");
    for (let info of taxInfo) {
      info.style.display = isChecked ? "none" : "inline";
    }
  };
  return (
    <div className="tax-toggle d-flex align-items-center justify-content-between">
      <label className="form-check-label" htmlFor="taxSwitch">
        Display total after taxes
      </label>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="taxSwitch"
          checked={isTaxEnabled}
          onChange={() => setIsTaxEnabled(!isTaxEnabled)}
        />
      </div>
    </div>
  );
};

export default TaxToggle;
