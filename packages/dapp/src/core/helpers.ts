function capitalize([first, ...rest]: string) {
  return first.toUpperCase() + rest.join("").toLowerCase();
}

function convertToKebabCase(string: string) {
  return string.replace(/\s+/g, "-").toLowerCase();
}

export { capitalize, convertToKebabCase };
