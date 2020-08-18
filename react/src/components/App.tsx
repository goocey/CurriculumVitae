import * as React from "react";

import "./../assets/scss/App.scss";
import { ParsedQuery } from "query-string";
import axios from "axios";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import * as geechs from "./../assets/env/geechs.json";
import * as levatech from "./../assets/env/levatech.json";

type Props = {
  qs: ParsedQuery;
};

const markdownUrl =
  "https://raw.githubusercontent.com/g00chy/CurriculumVitae/master/README.md";

// eslint-disable-next-line react/prop-types
const App: React.FC<Props> = ({ qs }) => {
  const [markdownFile, setMarkdownFile] = useState(null);
  let markdown = "";
  let agentInfo = {};

  const getMarkdown = async () => {
    await axios.get(markdownUrl, null).then((res) => {
      markdown = res.data;
    });
  };

  const setAgentInfo = (): void => {
    // eslint-disable-next-line react/prop-types
    if (qs.agent == "levatech") {
      agentInfo = levatech;
      // eslint-disable-next-line react/prop-types
    } else if (qs.agent == "geechs") {
      agentInfo = geechs;
    } else {
      agentInfo = {};
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
        data = data + "|" + key + "|" + val;
      }
      data = data + "|";
    }
    markdown = markdown.replace("{{REPLACE_BASICINFO}}", data);

    setMarkdownFile(markdown);
  };

  useEffect(() => {
    getMarkdown().then((value) => {
      replaceMarkdown();
    });
  }, []);

  return <Markdown source={markdownFile} />;
};

export default App;
