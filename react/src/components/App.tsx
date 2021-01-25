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
import slug from "remark-slug";
import merge from "deepmerge";
import sanitizeGhSchema from "hast-util-sanitize/lib/github.json"

type Props = {
  qs: ParsedQuery;
};

// eslint-disable-next-line react/prop-types
const App: React.FC<Props> = ({ qs }) => {
  const [markdownFile, setMarkdownFile] = useState(null);
  let markdown = "";
  let title = "";
  let agentInfo: { default?: any; };
  const processor = remark().use(slug).
    use(reactRenderer, {
      sanitize: merge(sanitizeGhSchema, {
        clobberPrefix: "",
        attributes: { code: ["className"] },
      })
    });

  const getMarkdown = async () => {
    const markdownUrl = process.env.REACT_APP_MARKDOWN_URL;
    await axios.get(markdownUrl, null).then((res) => {
      markdown = res.data;
    });
  };

  const setAgentInfo = (): void => {
    // eslint-disable-next-line react/prop-types
    const agent = qs.agent == null ? "normal" : qs.agent;
    agentInfo = config.get(agent).basic_info;
    title = config.get(agent).title;
  };

  const replaceMarkdown = (): void => {
    setAgentInfo();
    let data = "";
    if (Object.keys(agentInfo).length == 0) {
      data = "";
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      for (const [key, val] of Object.entries(agentInfo)) {
        data = data + "|" + key + "|" + val + "|\n";
      }
    }
    markdown = markdown.replace(/{{REPLACE_BASIC_INFO}}[\r\n]+/, data);
    setMarkdownFile(markdown);
  };

  useEffect(() => {
    getMarkdown().then((value) => {
      replaceMarkdown();
      document.title = title;
    });
  }, []);

  return <div>{processor.processSync(markdownFile).result}</div>;
};

export default App;
