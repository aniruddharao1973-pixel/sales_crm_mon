// CRM-Backend/src/modules/email/templateParser.js

/*
=====================================================
ADVANCED EMAIL TEMPLATE PARSER (PRODUCTION VERSION)

Supports:

{{contact.firstName}}
{{deal.amount}}
{{account.industry}}
{{today}}
{{contact.firstName || "Customer"}}

Features:
✔ Nested object resolution
✔ Safe fallback values
✔ Prevents runtime crashes
✔ Supports global variables
✔ Handles missing CRM fields gracefully
=====================================================
*/

/*
=====================================================
RESOLVE NESTED OBJECT PATH
Example:
resolvePath(obj, "account.industry")
=====================================================
*/
function resolvePath(object, path) {
  if (!object || !path) return undefined;

  return path.split(".").reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return current[key];
    }
    return undefined;
  }, object);
}

/*
=====================================================
GLOBAL VARIABLES
=====================================================
*/
function resolveGlobalVariable(name) {
  switch (name) {
    case "today":
      return new Date().toLocaleDateString();

    case "year":
      return new Date().getFullYear();

    default:
      return undefined;
  }
}

/*
=====================================================
MAIN TEMPLATE PARSER
=====================================================
*/
export function parseTemplate(template, variables = {}) {
  if (!template || typeof template !== "string") return "";

  return template.replace(/{{\s*(.*?)\s*}}/g, (_, expression) => {
    try {
      /*
      =====================================================
      SUPPORT FALLBACK VALUES
      Example:
      {{contact.firstName || "Customer"}}
      =====================================================
      */
      const [path, fallback] = expression.split("||").map((s) => s.trim());

      /*
      =====================================================
      CHECK GLOBAL VARIABLES
      =====================================================
      */
      let value = resolveGlobalVariable(path);

      /*
      =====================================================
      RESOLVE FROM CRM VARIABLES
      =====================================================
      */
      if (value === undefined) {
        value = resolvePath(variables, path);
      }

      /*
      =====================================================
      HANDLE EMPTY OR MISSING VALUES
      =====================================================
      */
      if (value === undefined || value === null || value === "") {
        if (fallback) {
          return fallback.replace(/['"]/g, "");
        }
        return "";
      }

      return String(value);
    } catch (err) {
      console.warn("⚠️ Template parsing error:", expression);
      return "";
    }
  });
}
