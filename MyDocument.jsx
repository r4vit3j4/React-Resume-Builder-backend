import { Document, Page, Text } from "@react-pdf/renderer";
import React from "react";

const MyDocument = ({ resume }) => (
  <Document>
    <Page>
      <Text>{resume.basic.name}</Text>
    </Page>
  </Document>
);

export default MyDocument;
