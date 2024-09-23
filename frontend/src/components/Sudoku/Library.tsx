import { Tabs, Tab, TabList, Button } from "@carbon/react";
import { Link } from "react-router-dom";

const easy = "000800500006109000150070060000090007020000910500004000080900072000240800007003000";
const  moderate = "070030000030109004009402000008000200004008905091700600000905400900200030000080050";
const tough = "000006001030000004000472060300001200704060900001700003080915000900000030200080000";

export const Library = () => (
  <Tabs>
    <TabList aria-label="Category">
      <Tab>Easy</Tab>
      <Tab>Moderate</Tab>
      <Tab>Tough</Tab>
    </TabList>
  </Tabs>
)