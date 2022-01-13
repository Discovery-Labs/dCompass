import CID from "cids";

function capitalize([first, ...rest]: string) {
  return first.toUpperCase() + rest.join("").toLowerCase();
}

function convertToKebabCase(string: string) {
  return string.replace(/\s+/g, "-").toLowerCase();
}

function splitCIDS(cids: string[]) {
  const base16cids = Array(cids.length);
  const firstParts = Array(cids.length);
  const secondParts = Array(cids.length);
  cids.forEach((elem, index) => {
    base16cids[index] = new CID(elem).toV1().toString("base16");
    firstParts[index] = `0x${base16cids[index].slice(1, 9)}`;
    secondParts[index] = `0x${base16cids[index].slice(9)}`;
  });
  return { base16cids, firstParts, secondParts };
}

function streamIdToUrl(streamId: string) {
  return `ceramic://${streamId}`;
}

function streamUrlToId(streamUrl: string) {
  return streamUrl.split("://")[1];
}

export {
  capitalize,
  convertToKebabCase,
  splitCIDS,
  streamIdToUrl,
  streamUrlToId,
};
