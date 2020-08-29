import * as React from "react";

import "./../assets/scss/App.scss";
import { ParsedQuery } from "query-string";
import axios from "axios";
import { useEffect, useState } from "react";

import * as geechs from "./../assets/env/geechs.json";
import * as levatech from "./../assets/env/levatech.json";
import * as normal from "./../assets/env/normal.json";

const config = new Map();
config.set("normal", normal);
config.set("levatech", levatech);
config.set("geechs", geechs);

import remark from "remark";
import reactRenderer from "remark-react";

type Props = {
  qs: ParsedQuery;
};

// eslint-disable-next-line react/prop-types
const App: React.FC<Props> = ({ qs }) => {
  const [markdownFile, setMarkdownFile] = useState(null);
  let markdown = "";
  let agentInfo;
  const processor = remark().use(reactRenderer);

  const getMarkdown = async () => {
    const markdownUrl = process.env.REACT_APP_MARKDOWN_URL;
    await axios.get(markdownUrl, null).then((res) => {
      markdown = res.data;
    });
  };

  const setAgentInfo = (): void => {
    // eslint-disable-next-line react/prop-types
    if (qs.agent == null) {
      agentInfo = config.get("normal");
    } else {
      // eslint-disable-next-line react/prop-types
      agentInfo = config.get(`${qs.agent}`);
    }
  };

  const replaceMarkdown = (): void => {
    setAgentInfo();
    let data = "";
    if (Object.keys(agentInfo).length == 0) {
      data = "";
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      for (const [key, val] of Object.entries(agentInfo.default)) {
        data = data + "|" + key + "|" + val + "|\n";
      }
    }
    markdown = markdown.replace(/{{REPLACE_BASIC_INFO}}[\r\n]+/, data);

    setMarkdownFile(markdown);
  };

  useEffect(() => {
    getMarkdown().then((value) => {
      replaceMarkdown();
    });
  }, []);

  return <div>{processor.processSync(markdownFile).result}</div>;
};

export default App;
