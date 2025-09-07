import { LANGUAGES, METHODS } from '~/constants';
import type { Header, RequestHeader } from '~/types';

const arrayToObject = (arr: Header[]): RequestHeader =>
  arr.reduce(
    (acc, item) => ({
      ...acc,
      [item.name]: item.value,
    }),
    {}
  );

export const generateCode = (
  method: METHODS,
  url: string = '',
  body: string,
  requestHeaders: Header[],
  language: LANGUAGES
): string => {
  const headers = arrayToObject(requestHeaders);

  switch (language) {
    case LANGUAGES.curl:
      return generateCurlCode(method, url, body, headers);
    case LANGUAGES['javascript-fetch']:
      return generateJavascriptFetchCode(method, url, body, headers);
    case LANGUAGES['javascript-xhr']:
      return generateJavascriptXHRCode(method, url, body, headers);
    case LANGUAGES.nodejs:
      return generateNodeJSCode(method, url, body, headers);
    case LANGUAGES.python:
      return generatePythonCode(method, url, body, headers);
    case LANGUAGES.java:
      return generateJavaCode(method, url, body, headers);
    case LANGUAGES.csharp:
      return generateCSharpCode(method, url, body, headers);
    case LANGUAGES.go:
      return generateGoCode(method, url, body, headers);
    default:
      return `// Code generation for ${language} not implemented yet`;
  }
};

const generateCurlCode = (
  method: METHODS,
  url: string,
  body: string,
  headers: RequestHeader
): string => {
  let curlCommand = `curl -X ${method} "${url}"`;

  Object.entries(headers).forEach(([key, value]) => {
    curlCommand += ` \\\n  -H "${key}: ${value}"`;
  });

  if (
    body &&
    [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(method)
  ) {
    curlCommand += ` \\\n  -d '${body}'`;
  }

  return curlCommand;
};

const generateJavascriptFetchCode = (
  method: METHODS,
  url: string,
  body: string,
  headers: RequestHeader
): string => {
  let code = `fetch("${url}", {\n`;
  code += `  method: "${method}",\n`;

  if (Object.keys(headers).length > 0) {
    code += `  headers: {\n`;
    Object.entries(headers).forEach(([key, value]) => {
      code += `    "${key}": "${value}",\n`;
    });
    code = code.slice(0, -2);
    code += `\n  },\n`;
  }

  if (
    body &&
    [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(method)
  ) {
    try {
      JSON.parse(body);
      code += `  body: JSON.stringify(${body}),\n`;
    } catch {
      code += `  body: \`${body}\`,\n`;
    }
  }

  code += `})`;
  code += `\n  .then(response => response.json())\n`;
  code += `  .then(data => console.log(data))\n`;
  code += `  .catch(error => console.error('Error:', error));`;

  return code;
};

const generateJavascriptXHRCode = (
  method: METHODS,
  url: string,
  body: string,
  headers: RequestHeader
): string => {
  let code = `const xhr = new XMLHttpRequest();\n`;
  code += `xhr.open("${method}", "${url}");\n\n`;

  Object.entries(headers).forEach(([key, value]) => {
    code += `xhr.setRequestHeader("${key}", "${value}");\n`;
  });

  code += `\nxhr.onreadystatechange = function() {\n`;
  code += `  if (xhr.readyState === 4) {\n`;
  code += `    console.log(xhr.responseText);\n`;
  code += `  }\n`;
  code += `};\n\n`;

  if (
    body &&
    [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(method)
  ) {
    code += `xhr.send(${JSON.stringify(body)});`;
  } else {
    code += `xhr.send();`;
  }

  return code;
};

const generateNodeJSCode = (
  method: METHODS,
  url: string,
  body: string,
  headers: RequestHeader
): string => {
  const urlObj = new URL(url || location.href);
  const isHttps = urlObj.protocol === 'https:';

  let code = `const ${isHttps ? 'https' : 'http'} = require('${isHttps ? 'https' : 'http'}');\n\n`;

  code += `const options = {\n`;
  code += `  hostname: '${urlObj.hostname}',\n`;
  if (urlObj.port) {
    code += `  port: ${urlObj.port},\n`;
  }
  code += `  path: '${urlObj.pathname}${urlObj.search}',\n`;
  code += `  method: '${method}',\n`;

  if (Object.keys(headers).length > 0) {
    code += `  headers: {\n`;
    Object.entries(headers).forEach(([key, value]) => {
      code += `    '${key}': '${value}',\n`;
    });
    code = code.slice(0, -2);
    code += `\n  }\n`;
  }

  code += `};\n\n`;

  code += `const req = ${isHttps ? 'https' : 'http'}.request(options, (res) => {\n`;
  code += `  let data = '';\n\n`;
  code += `  res.on('data', (chunk) => {\n`;
  code += `    data += chunk;\n`;
  code += `  });\n\n`;
  code += `  res.on('end', () => {\n`;
  code += `    console.log(data);\n`;
  code += `  });\n`;
  code += `});\n\n`;

  code += `req.on('error', (error) => {\n`;
  code += `  console.error('Error:', error);\n`;
  code += `});\n\n`;

  if (
    body &&
    [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(method)
  ) {
    code += `req.write(${JSON.stringify(body)});\n`;
  }

  code += `req.end();`;

  return code;
};

const generatePythonCode = (
  method: METHODS,
  url: string,
  body: string,
  headers: RequestHeader
): string => {
  let code = `import requests\n\n`;

  code += `url = "${url}"\n`;

  let headersString = '';
  if (Object.keys(headers).length > 0) {
    headersString = `headers = {\n`;
    Object.entries(headers).forEach(([key, value]) => {
      headersString += `    "${key}": "${value}",\n`;
    });
    headersString = headersString.slice(0, -2);
    headersString += `\n}\n\n`;
  }

  code += headersString;

  let bodyString = '';
  if (
    body &&
    [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(method)
  ) {
    try {
      JSON.parse(body);
      bodyString = `data = ${body}\n\n`;
    } catch {
      bodyString = `data = """${body}"""\n\n`;
    }
  }

  code += bodyString;

  code += `response = requests.${method.toLowerCase()}(${headersString ? 'url, headers=headers' : 'url'}${bodyString ? ', json=data' : ''})\n\n`;
  code += `print(response.text)`;

  return code;
};

const generateJavaCode = (
  method: METHODS,
  url: string,
  body: string,
  headers: RequestHeader
): string => {
  let code = `import java.net.HttpURLConnection;\n`;
  code += `import java.net.URL;\n`;
  code += `import java.io.OutputStream;\n`;
  code += `import java.io.BufferedReader;\n`;
  code += `import java.io.InputStreamReader;\n\n`;

  code += `public class Main {\n`;
  code += `    public static void main(String[] args) throws Exception {\n`;
  code += `        URL url = new URL("${url}");\n`;
  code += `        HttpURLConnection con = (HttpURLConnection) url.openConnection();\n`;
  code += `        con.setRequestMethod("${method}");\n\n`;

  Object.entries(headers).forEach(([key, value]) => {
    code += `        con.setRequestProperty("${key}", "${value}");\n`;
  });

  if (
    body &&
    [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(method)
  ) {
    code += `        con.setDoOutput(true);\n`;
    code += `        String jsonInputString = ${JSON.stringify(body)};\n\n`;
    code += `        try(OutputStream os = con.getOutputStream()) {\n`;
    code += `            byte[] input = jsonInputString.getBytes("utf-8");\n`;
    code += `            os.write(input, 0, input.length);\n`;
    code += `        }\n\n`;
  }

  code += `        int status = con.getResponseCode();\n\n`;
  code += `        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));\n`;
  code += `        String inputLine;\n`;
  code += `        StringBuffer content = new StringBuffer();\n`;
  code += `        while ((inputLine = in.readLine()) != null) {\n`;
  code += `            content.append(inputLine);\n`;
  code += `        }\n`;
  code += `        in.close();\n\n`;
  code += `        System.out.println(content.toString());\n`;
  code += `        con.disconnect();\n`;
  code += `    }\n`;
  code += `}`;

  return code;
};

const generateCSharpCode = (
  method: METHODS,
  url: string,
  body: string,
  headers: RequestHeader
): string => {
  let code = `using System;\n`;
  code += `using System.Net;\n`;
  code += `using System.IO;\n`;
  code += `using System.Text;\n\n`;

  code += `class Program\n`;
  code += `{\n`;
  code += `    static void Main()\n`;
  code += `    {\n`;
  code += `        HttpWebRequest request = (HttpWebRequest)WebRequest.Create("${url}");\n`;
  code += `        request.Method = "${method}";\n\n`;

  Object.entries(headers).forEach(([key, value]) => {
    code += `        request.Headers["${key}"] = "${value}";\n`;
  });

  if (
    body &&
    [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(method)
  ) {
    code += `        string json = ${JSON.stringify(body)};\n`;
    code += `        byte[] byteArray = Encoding.UTF8.GetBytes(json);\n`;
    code += `        request.ContentLength = byteArray.Length;\n\n`;
    code += `        using (Stream dataStream = request.GetRequestStream())\n`;
    code += `        {\n`;
    code += `            dataStream.Write(byteArray, 0, byteArray.Length);\n`;
    code += `        }\n\n`;
  }

  code += `        try\n`;
  code += `        {\n`;
  code += `            WebResponse response = request.GetResponse();\n`;
  code += `            using (Stream responseStream = response.GetResponseStream())\n`;
  code += `            {\n`;
  code += `                StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);\n`;
  code += `                Console.WriteLine(reader.ReadToEnd());\n`;
  code += `            }\n`;
  code += `        }\n`;
  code += `        catch (WebException ex)\n`;
  code += `        {\n`;
  code += `            WebResponse errorResponse = ex.Response;\n`;
  code += `            using (Stream responseStream = errorResponse.GetResponseStream())\n`;
  code += `            {\n`;
  code += `                StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);\n`;
  code += `                Console.WriteLine(reader.ReadToEnd());\n`;
  code += `            }\n`;
  code += `        }\n`;
  code += `    }\n`;
  code += `}`;

  return code;
};

const generateGoCode = (
  method: METHODS,
  url: string,
  body: string,
  headers: RequestHeader
): string => {
  let code = `package main\n\n`;
  code += `import (\n`;
  code += `    "bytes"\n`;
  code += `    "fmt"\n`;
  code += `    "net/http"\n`;
  code += `    "io/ioutil"\n`;
  code += `)\n\n`;

  code += `func main() {\n`;
  code += `    url := "${url}"\n\n`;

  let bodyString = '';
  if (
    body &&
    [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(method)
  ) {
    code += `    var jsonStr = []byte(\`${body}\`)\n`;
    bodyString = `    req, err := http.NewRequest("${method}", url, bytes.NewBuffer(jsonStr))\n`;
  } else {
    bodyString = `    req, err := http.NewRequest("${method}", url, nil)\n`;
  }

  code += bodyString;
  code += `    if err != nil {\n`;
  code += `        panic(err)\n`;
  code += `    }\n\n`;

  Object.entries(headers).forEach(([key, value]) => {
    code += `    req.Header.Set("${key}", "${value}")\n`;
  });

  code += `\n    client := &http.Client{}\n`;
  code += `    resp, err := client.Do(req)\n`;
  code += `    if err != nil {\n`;
  code += `        panic(err)\n`;
  code += `    }\n`;
  code += `    defer resp.Body.Close()\n\n`;
  code += `    body, _ := ioutil.ReadAll(resp.Body)\n`;
  code += `    fmt.Println(string(body))\n`;
  code += `}`;

  return code;
};
