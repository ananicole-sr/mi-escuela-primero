// import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod"; 
import fs from "fs/promises";
import path from "path";

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("REJECTION:", err);
  process.exit(1);
});

const ROOT = "C:/Users/danna/Desktop/TEC/4th semester/Software construction and decision making/miEscuelaPrimero/mi-escuela-primero";

const server = new McpServer({
  name: "mcp-dev-mep",
  version: "1.0.0",
});

const transport = new StdioServerTransport();

server.tool(
    "hello_world_mep",
    {
        // inputSchema: {
        //     name: z.string(),
        // },
        name: z.string(),
    },
    async ({ name }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `Hola ${name}, tu MCP funciona`,
                },
            ],
        };
    }
);

server.tool(
  "read_file",
  {
    // inputSchema: {
    //   path: z.string(),
    // },
    path: z.string(),
  },
  async ({ path: filePath }) => {
  try {
    const safePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(ROOT, filePath);

    const fullPath = path.resolve(safePath);

    // if (!fullPath.startsWith(ROOT)) {
    const relative = path.relative(ROOT, fullPath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return {
        content: [{ type: "text", text: "Acceso denegado" }],
      };
    }

    const content = await fs.readFile(fullPath, "utf-8");

    return {
      content: [{ type: "text", text: content }],
    };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error: ${err.message}` }],
    };
  }
}
);

async function searchFiles(dir, query, results = [], depth = 0, startTime = Date.now()) {
  if (results.length >= 50) return results;
  
  const TIME_LIMIT = 5000; // 5 seconds

  if (Date.now() - startTime > TIME_LIMIT) {
      return results;
  }  

  if (depth > 10) return results;
  const lowerQuery = query.toLowerCase();

    const files = await fs.readdir(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);

        let stat;
        try {
            stat = await fs.stat(fullPath);
        } catch (err) {
            console.log(err);
            continue;
        }
        
        if (stat.isDirectory()) {
            if (
                file === "node_modules" ||
                file === ".next" ||
                file === "dist" ||
                file === "build" ||
                file.startsWith(".")
            ) continue;

            await searchFiles(fullPath, query, results, depth + 1, startTime);
            if (results.length >= 50) return results;

        } else {
            if (
                !file.endsWith(".js") &&
                !file.endsWith(".ts") &&
                !file.endsWith(".tsx") &&
                !file.endsWith(".jsx") &&
                !file.endsWith(".json")
            ) continue;

             // SKIP LARGE FILES
            if (stat.size > 200_000) continue;

            const content = await fs.readFile(fullPath, "utf-8");

            const lowerContent = content.toLowerCase();
            // const lowerQuery = query.toLowerCase();

            // if (lowerContent.includes(lowerQuery)) {
            //     results.push(path.relative(ROOT, fullPath));
            // }
            if (lowerContent.includes(lowerQuery)) {
                results.push(path.relative(ROOT, fullPath));

                // 🔴 LIMIT RESULTS
                if (results.length >= 50) return results;
            }
        }
    }
    
    return results;
}

server.tool(
    "search_code",
    {
        query: z.string(),
    },
    async ({ query }) => {
      console.error("SEARCH START:", query);

      const start = Date.now();
      const results = await searchFiles(ROOT, query);
      const duration = Date.now() - start;

      console.error("SEARCH DONE:", duration, "ms", results.length, "results");

      return {
          content: [
              {
                  type: "text",
                  text: results.join("\n") || "No encontrado",
              },
          ],
      };
  }
);


server.tool(
  "get_components",
  {
    path: z.string().optional(),
  },
  async ({ path: targetPath = "" }) => {
    try {
      const baseDir = path.resolve(ROOT, targetPath);
      const results = [];

      function extractVariants(content) {
        const variants = {};

        const regex = /(\w+)\??:\s*(".*?"(\s*\|\s*".*?")*)/g;

        let match;

        while ((match = regex.exec(content)) !== null) {
          const propName = match[1];
          const raw = match[2];

          const values = raw
            .split("|")
            .map(v => v.replace(/"/g, "").trim());

          variants[propName] = values;
        }

        return variants;
      }


      function extractStates(content) {
        const states = new Set();

        if (content.includes("loading")) states.add("loading");
        if (content.includes("disabled")) states.add("disabled");
        if (content.includes("hover")) states.add("hover");
        if (content.includes("error")) states.add("error");
        if (content.includes("success")) states.add("success");

        return Array.from(states);
      }


      function classifyComponent(name) {
        const lower = name.toLowerCase();

        if (
          lower.includes("button") ||
          lower.includes("input") ||
          lower.includes("select")
        ) {
          return "ui";
        }

        if (
          lower.includes("card") ||
          lower.includes("container") ||
          lower.includes("section")
        ) {
          return "layout";
        }

        if (
          lower.includes("modal") ||
          lower.includes("dialog") ||
          lower.includes("drawer")
        ) {
          return "overlay";
        }

        if (
          lower.includes("table") ||
          lower.includes("list")
        ) {
          return "data";
        }

        return "unknown";
      }


      async function scan(dir, depth = 0) {
        if (depth > 6) return;

        const files = await fs.readdir(dir);

        for (const file of files) {
          const fullPath = path.join(dir, file);

          let stat;
          try {
            stat = await fs.stat(fullPath);
          } catch {
            continue;
          }

          if (stat.isDirectory()) {
            if (
              file === "node_modules" ||
              file === ".next" ||
              file === "dist" ||
              file === "build" ||
              file.startsWith(".")
            ) continue;

            await scan(fullPath, depth + 1);
          } else {
            if (!file.endsWith(".tsx") && !file.endsWith(".jsx")) continue;

            if (stat.size > 150000) continue;

            const content = await fs.readFile(fullPath, "utf-8");

            const matches = content.match(
              /export\s+(default\s+)?function\s+([A-Z][A-Za-z0-9]+)/g
            );

            if (!matches) continue;

            for (const match of matches) {
              const nameMatch = match.match(/([A-Z][A-Za-z0-9]+)/);
              const componentName = nameMatch?.[1];

              if (!componentName) continue;

              const variants = extractVariants(content);
              const states = extractStates(content);
              const type = classifyComponent(componentName);

              results.push({
                name: componentName,
                type,
                path: path.relative(ROOT, fullPath),
                variants,
                states,
              });
            }
          }
        }
      }

      await scan(baseDir);

      return {
        content: [
          {
            type: "text",
            text:
              JSON.stringify(results, null, 2) ||
              "No components found",
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err.message}`,
          },
        ],
      };
    }
  }
);



try {
  await server.connect(transport);
  console.error("MCP server MEP corriendo wooohoooo");
} catch (err) {
  console.error("Error conectando:", err);
}