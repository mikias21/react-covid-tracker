import React from "react";

// css
import "../Styles/InfoBox.css";

// Material UI
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, isRed, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infobox ${active && "info--selected"} ${
        isRed && "info--red"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary" className="infobox__title">
          {title}
        </Typography>
        <h2 className="infobox__cases">{cases}</h2>
        <Typography color="textSecondary" className="infobox__total">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
