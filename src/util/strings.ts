export function capitalize(input: string): string {
  if (input.length === 0) {
    return input;
  }

  return input.charAt(0).toUpperCase() + input.slice(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encodeDataToBase64(data: any) {
  const jsonString = JSON.stringify(data);
  const encodedData = btoa(jsonString);

  return encodedData;
}
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeBase64ToData(base64: string): any {
  const decodedString = atob(base64);
  const data = JSON.parse(decodedString);

  return data;
}